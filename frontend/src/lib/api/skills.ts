import { apiClient } from "./client";
import { Skill, SkillFile, SkillVersion } from "@/types/skill";

export interface CreateSkillPayload {
  name: string;
  description: string;
  categoryId?: string;
  tags?: string[];
}

export interface UpdateSkillPayload {
  name?: string;
  description?: string;
  categoryId?: string | null;
  tags?: string[];
}

export interface CreateVersionPayload {
  version: string;
  changelog?: string;
  fromVersionId?: string;
  files: SkillFile[] | {
    path: string;
    content: string;
    mimeType?: string | null;
  }[];
}

export const skillsApi = {
  getMine: async () => {
    return apiClient<{ skills: Skill[]; total: number }>("/skills/mine", {
      method: "GET",
    });
  },

  getById: async (id: string) => {
    const data = await apiClient<{ skill: Skill }>(`/skills/${id}`, {
      method: "GET",
    });
    return data?.skill || (data as unknown as Skill);
  },

  create: async (payload: CreateSkillPayload) => {
    const data = await apiClient<{ skill: Skill }>("/skills", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data?.skill || (data as unknown as Skill);
  },

  update: async (id: string, payload: UpdateSkillPayload) => {
    const data = await apiClient<{ skill: Skill }>(`/skills/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return data?.skill || (data as unknown as Skill);
  },

  publish: async (id: string, versionId?: string) => {
    const data = await apiClient<{ skill: Skill }>(`/skills/${id}/publish`, {
      method: "POST",
      body: JSON.stringify(versionId ? { versionId } : {}),
    });
    return data?.skill || (data as unknown as Skill);
  },

  archive: async (id: string) => {
    return apiClient<Skill>(`/skills/${id}/archive`, {
      method: "POST",
    });
  },

  restore: async (id: string) => {
    return apiClient<Skill>(`/skills/${id}/restore`, {
      method: "POST",
    });
  },

  delete: async (id: string) => {
    return apiClient(`/skills/${id}`, {
      method: "DELETE",
    });
  },

  // Skill Versions
  getVersions: async (skillId: string) => {
    return apiClient<{ versions: SkillVersion[] }>(`/skills/${skillId}/versions`, {
      method: "GET",
    });
  },

  getVersionById: async (skillId: string, versionId: string) => {
    const data = await apiClient<{ version: SkillVersion }>(`/skills/${skillId}/versions/${versionId}`, {
      method: "GET",
    });
    return data?.version || (data as unknown as SkillVersion);
  },

  createVersion: async (skillId: string, payload: CreateVersionPayload) => {
    const data = await apiClient<{ version: SkillVersion }>(`/skills/${skillId}/versions`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data?.version || (data as unknown as SkillVersion);
  },

  updateVersion: async (
    skillId: string,
    versionId: string,
    payload: { changelog?: string; files?: SkillFile[] }
  ) => {
    return apiClient<{ version: SkillVersion }>(`/skills/${skillId}/versions/${versionId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  deleteVersion: async (skillId: string, versionId: string) => {
    return apiClient(`/skills/${skillId}/versions/${versionId}`, {
      method: "DELETE",
    });
  },
};
