import { apiClient } from "./client";
import { GitHubInspectResult, GitHubTreeResult } from "@/types/engagement";
import { Skill } from "@/types/skill";

export interface GitHubImportPayload {
  url: string;
  branch: string;
  files: string[];
}

export const githubApi = {
  inspect: async (url: string) => {
    return apiClient<GitHubInspectResult>("/github/inspect", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
  },

  getTree: async (url: string, branch: string) => {
    return apiClient<GitHubTreeResult>("/github/tree", {
      method: "GET",
      params: { url, branch },
    });
  },

  importRepo: async (payload: GitHubImportPayload) => {
    return apiClient<{ skill: Skill }>("/github/import", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
