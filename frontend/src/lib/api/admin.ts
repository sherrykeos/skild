import { apiClient } from "./client";

export interface AdminStatsResponse {
  stats: {
    totalUsers: number;
    totalSkills: number;
    publishedSkills: number;
    draftSkills: number;
    archivedSkills: number;
    totalDownloads: number;
    totalUpvotes: number;
    totalReviews: number;
    totalCollections: number;
  };
  recentUsers: Array<{
    id: string;
    username: string;
    email: string;
    avatar?: string | null;
    createdAt: string;
  }>;
  recentSkills: Array<{
    id: string;
    name: string;
    slug: string;
    status: string;
    createdAt: string;
    author: {
      username: string;
      avatar?: string | null;
    };
    _count: {
      downloads: number;
      upvotes: number;
      reviews: number;
    };
  }>;
}

export const adminApi = {
  getStats: async () => {
    return apiClient<AdminStatsResponse>("/admin/stats", {
      method: "GET",
    });
  },
};
