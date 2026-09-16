import { apiClient } from "./client";
import { UserRole } from "@/types/user";

export interface AdminStatsResponse {
  stats: {
    totalUsers: number;
    totalCreators: number;
    totalAdmins: number;
    suspendedUsers: number;
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
    role: UserRole;
    isSuspended: boolean;
    createdAt: string;
    _count?: {
      skills: number;
      reviews: number;
    };
  }>;
  recentSkills: Array<{
    id: string;
    name: string;
    slug: string;
    status: string;
    createdAt: string;
    author: {
      id: string;
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

export interface AdminUsersResponse {
  users: Array<{
    id: string;
    username: string;
    email: string;
    avatar?: string | null;
    role: UserRole;
    isSuspended: boolean;
    isEmailVerified: boolean;
    createdAt: string;
    _count: {
      skills: number;
      reviews: number;
      collections: number;
    };
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminSkillsResponse {
  skills: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    publishedAt?: string | null;
    createdAt: string;
    author: {
      id: string;
      username: string;
      email: string;
      avatar?: string | null;
    };
    category?: {
      id: string;
      name: string;
      slug: string;
    } | null;
    _count: {
      downloads: number;
      upvotes: number;
      reviews: number;
      versions: number;
    };
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminReviewsResponse {
  reviews: Array<{
    id: string;
    content: string;
    createdAt: string;
    user: {
      id: string;
      username: string;
      avatar?: string | null;
      email: string;
    };
    skill: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const adminApi = {
  getStats: async () => {
    return apiClient<AdminStatsResponse>("/admin/stats", {
      method: "GET",
    });
  },

  getUsers: async (params?: { q?: string; role?: string; status?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.set("q", params.q);
    if (params?.role) searchParams.set("role", params.role);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());

    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return apiClient<AdminUsersResponse>(`/admin/users${queryString}`, {
      method: "GET",
    });
  },

  toggleSuspendUser: async (userId: string, isSuspended?: boolean) => {
    return apiClient<{ message: string; user: any }>(`/admin/users/${userId}/suspend`, {
      method: "PATCH",
      body: JSON.stringify({ isSuspended }),
    });
  },

  deleteUser: async (userId: string) => {
    return apiClient<{ message: string }>(`/admin/users/${userId}`, {
      method: "DELETE",
    });
  },

  getSkills: async (params?: { q?: string; status?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.set("q", params.q);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());

    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return apiClient<AdminSkillsResponse>(`/admin/skills${queryString}`, {
      method: "GET",
    });
  },

  unpublishSkill: async (skillId: string) => {
    return apiClient<{ message: string; skill: any }>(`/admin/skills/${skillId}/unpublish`, {
      method: "POST",
    });
  },

  deleteSkill: async (skillId: string) => {
    return apiClient<{ message: string }>(`/admin/skills/${skillId}`, {
      method: "DELETE",
    });
  },

  getReviews: async (params?: { q?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.set("q", params.q);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());

    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return apiClient<AdminReviewsResponse>(`/admin/reviews${queryString}`, {
      method: "GET",
    });
  },

  deleteReview: async (reviewId: string) => {
    return apiClient<{ message: string }>(`/admin/reviews/${reviewId}`, {
      method: "DELETE",
    });
  },
};
