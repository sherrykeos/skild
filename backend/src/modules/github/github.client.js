import ApiError from "../../utils/ApiError.js";

/**
 * Parse owner and repository name from various GitHub URL formats.
 */
export function parseGitHubUrl(inputUrl) {
  if (typeof inputUrl !== "string") return null;

  let urlStr = inputUrl.trim();
  if (!urlStr) return null;

  if (!/^https?:\/\//i.test(urlStr)) {
    urlStr = "https://" + urlStr;
  }

  try {
    const parsed = new URL(urlStr);
    const hostname = parsed.hostname.toLowerCase();

    if (hostname !== "github.com" && hostname !== "www.github.com") {
      return null;
    }

    const segments = parsed.pathname.split("/").filter(Boolean);

    if (segments.length !== 2) {
      return null;
    }

    const owner = segments[0];
    let repo = segments[1];

    if (repo.endsWith(".git")) {
      repo = repo.slice(0, -4);
    }

    const reservedKeywords = ["pulls", "issues", "wiki", "actions", "projects", "settings", "blob", "tree"];
    if (reservedKeywords.includes(repo.toLowerCase())) {
      return null;
    }

    const validPattern = /^[a-zA-Z0-9_.-]+$/;
    if (!validPattern.test(owner) || !validPattern.test(repo)) {
      return null;
    }

    return { owner, repo };
  } catch {
    return null;
  }
}

/**
 * Helper to make HTTP requests to the public GitHub REST API.
 */
async function fetchFromGitHub(endpoint) {
  const url = endpoint.startsWith("https://")
    ? endpoint
    : `https://api.github.com${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "SkillAtlas-Backend/1.0.0",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }

  let response;
  try {
    response = await fetch(url, { headers });
  } catch (err) {
    throw new ApiError(502, "Failed to connect to GitHub API.", "GITHUB_API_ERROR");
  }

  if (response.status === 404) {
    throw new ApiError(404, "GitHub resource not found.", "GITHUB_RESOURCE_NOT_FOUND");
  }

  if (response.status === 403 || response.status === 429) {
    throw new ApiError(429, "GitHub API rate limit exceeded or forbidden.", "GITHUB_RATE_LIMITED");
  }

  if (!response.ok) {
    throw new ApiError(502, `GitHub API returned status ${response.status}.`, "GITHUB_API_ERROR");
  }

  return response.json();
}

/**
 * Get repository details.
 */
export async function getRepository(owner, repo) {
  try {
    return await fetchFromGitHub(`/repos/${owner}/${repo}`);
  } catch (error) {
    if (error.code === "GITHUB_RESOURCE_NOT_FOUND") {
      throw new ApiError(404, "GitHub repository not found.", "GITHUB_REPOSITORY_NOT_FOUND");
    }
    throw error;
  }
}

/**
 * Get repository branches.
 */
export async function getBranches(owner, repo) {
  try {
    return await fetchFromGitHub(`/repos/${owner}/${repo}/branches?per_page=100`);
  } catch (error) {
    if (error.code === "GITHUB_RESOURCE_NOT_FOUND") {
      throw new ApiError(404, "GitHub repository not found.", "GITHUB_REPOSITORY_NOT_FOUND");
    }
    throw error;
  }
}

/**
 * Get full repository git tree for a specific branch.
 */
export async function getRepositoryTree(owner, repo, branch) {
  try {
    const encodedBranch = encodeURIComponent(branch);
    return await fetchFromGitHub(`/repos/${owner}/${repo}/git/trees/${encodedBranch}?recursive=1`);
  } catch (error) {
    if (error.code === "GITHUB_RESOURCE_NOT_FOUND") {
      throw new ApiError(404, `Branch '${branch}' or repository not found on GitHub.`, "GITHUB_BRANCH_NOT_FOUND");
    }
    throw error;
  }
}

/**
 * Fetch specific file content from repository branch.
 */
export async function getFileContent(owner, repo, path, branch) {
  try {
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    const encodedBranch = encodeURIComponent(branch);
    const res = await fetchFromGitHub(`/repos/${owner}/${repo}/contents/${encodedPath}?ref=${encodedBranch}`);

    if (res.type !== "file") {
      throw new ApiError(400, `Path '${path}' is a directory, not a file.`, "GITHUB_FILE_UNSUPPORTED");
    }

    let content = "";
    if (res.encoding === "base64" && res.content) {
      content = Buffer.from(res.content, "base64").toString("utf8");
    } else if (typeof res.content === "string") {
      content = res.content;
    }

    return {
      content,
      size: res.size ?? Buffer.byteLength(content, "utf8"),
      sha: res.sha,
    };
  } catch (error) {
    if (error.code === "GITHUB_RESOURCE_NOT_FOUND") {
      throw new ApiError(404, `File '${path}' not found in GitHub repository.`, "GITHUB_FILE_NOT_FOUND");
    }
    throw error;
  }
}
