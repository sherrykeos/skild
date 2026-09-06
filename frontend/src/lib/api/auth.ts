import { apiClient, setStoredToken } from "./client";
import { AuthResponse, User } from "@/types/user";

export const authApi = {
  register: async (payload: { username: string; email: string; password: string }) => {
    return apiClient<{ message: string; user?: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
      skipAuth: true,
    });
  },

  login: async (payload: { email: string; password: string }) => {
    const data = await apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
      skipAuth: true,
    });
    if (data?.accessToken) {
      setStoredToken(data.accessToken);
    }
    return data;
  },

  verifyEmail: async (token: string) => {
    return apiClient<{ message: string }>("/auth/verify", {
      method: "GET",
      params: { token },
      skipAuth: true,
    });
  },

  resendVerification: async (email: string) => {
    return apiClient<{ message: string }>("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
      skipAuth: true,
    });
  },

  forgotPassword: async (email: string) => {
    return apiClient<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      skipAuth: true,
    });
  },

  resetPassword: async (payload: { token: string; password: string }) => {
    return apiClient<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
      skipAuth: true,
    });
  },

  refresh: async () => {
    const data = await apiClient<{ accessToken: string }>("/auth/refresh", {
      method: "POST",
      skipAuth: true,
    });
    if (data?.accessToken) {
      setStoredToken(data.accessToken);
    }
    return data;
  },

  logout: async () => {
    try {
      await apiClient("/auth/logout", {
        method: "POST",
      });
    } finally {
      setStoredToken(null);
    }
  },

  getMe: async () => {
    const data = await apiClient<{ user: User }>("/auth/me", {
      method: "GET",
    });
    return data?.user || (data as unknown as User);
  },

  changePassword: async (payload: { currentPassword: string; newPassword: string }) => {
    return apiClient<{ message: string }>("/auth/change-password", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
};
