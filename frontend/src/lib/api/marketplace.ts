import { apiClient } from "./client";
import { MarketplaceSkillsResponse, Skill } from "@/types/skill";

export interface MarketplaceQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tags?: string[];
  sort?: "latest" | "popular" | "upvotes";
}

export const marketplaceApi = {
  getSkills: async (params: MarketplaceQueryParams = {}) => {
    return apiClient<MarketplaceSkillsResponse>("/marketplace/skills", {
      method: "GET",
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
        category: params.category,
        tags: params.tags && params.tags.length > 0 ? params.tags.join(",") : undefined,
        sort: params.sort,
      },
    });
  },

  getSkillBySlug: async (slug: string) => {
    const data = await apiClient<{ skill: Skill }>(`/marketplace/skills/${encodeURIComponent(slug)}`, {
      method: "GET",
    });
    return data?.skill || (data as unknown as Skill);
  },
};
