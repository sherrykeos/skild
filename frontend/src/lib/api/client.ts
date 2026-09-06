export class ApiClientError extends Error {
  statusCode: number;
  code?: string;
  errors?: any[];

  constructor(statusCode: number, message: string, code?: string, errors?: any[]) {
    super(message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("skillatlas_access_token");
}

export function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("skillatlas_access_token", token);
  } else {
    localStorage.removeItem("skillatlas_access_token");
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
  skipAuth?: boolean;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, skipAuth = false, headers = {}, ...customConfig } = options;

  let url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          searchParams.append(key, value.join(","));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const token = !skipAuth ? getStoredToken() : null;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers as Record<string, string>),
  };

  const config: RequestInit = {
    method: "GET",
    credentials: "include",
    headers: defaultHeaders,
    ...customConfig,
  };

  // Do not stringify FormData
  if (customConfig.body instanceof FormData) {
    delete defaultHeaders["Content-Type"];
  }

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (err: any) {
    throw new ApiClientError(0, "Network error or server unreachable.", "NETWORK_ERROR");
  }

  // Handle blob responses (for download endpoint)
  const contentType = response.headers.get("content-type");
  if (contentType && (contentType.includes("application/zip") || contentType.includes("application/octet-stream"))) {
    if (!response.ok) {
      throw new ApiClientError(response.status, "Failed to download package.");
    }
    return (await response.blob()) as unknown as T;
  }

  let data: any = null;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    const errorMessage = data?.message || response.statusText || "An unexpected error occurred.";
    const errorCode = data?.code;
    const errors = data?.errors;
    throw new ApiClientError(response.status, errorMessage, errorCode, errors);
  }

  // If response matches backend ApiResponse format ({ data, success, message })
  if (data && typeof data === "object" && "data" in data && "success" in data) {
    return data.data as T;
  }

  return data as T;
}
