import { apiClient } from "./client";
import { Collection, Review } from "@/types/engagement";
import { Skill } from "@/types/skill";

export const engagementApi = {
  // Upvotes
  upvote: async (skillId: string) => {
    return apiClient<{ upvotesCount?: number }>(`/skills/${skillId}/upvote`, {
      method: "POST",
    });
  },

  removeUpvote: async (skillId: string) => {
    return apiClient<{ upvotesCount?: number }>(`/skills/${skillId}/upvote`, {
      method: "DELETE",
    });
  },

  // Reviews
  getReviews: async (skillId: string, page = 1, limit = 10) => {
    return apiClient<{ reviews: Review[]; pagination: any }>(`/skills/${skillId}/reviews`, {
      method: "GET",
      params: { page, limit },
    });
  },

  createReview: async (skillId: string, payload: { content: string }) => {
    return apiClient<Review>(`/skills/${skillId}/reviews`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateReview: async (reviewId: string, payload: { content: string }) => {
    return apiClient<Review>(`/reviews/${reviewId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  deleteReview: async (reviewId: string) => {
    return apiClient(`/reviews/${reviewId}`, {
      method: "DELETE",
    });
  },

  // Saves / Bookmarks
  saveSkill: async (skillId: string) => {
    return apiClient(`/skills/${skillId}/save`, {
      method: "POST",
    });
  },

  unsaveSkill: async (skillId: string) => {
    return apiClient(`/skills/${skillId}/save`, {
      method: "DELETE",
    });
  },

  getSavedSkills: async (page = 1, limit = 20) => {
    return apiClient<{ savedSkills: { skill: Skill; savedAt: string }[]; total?: number }>(
      "/users/me/saved",
      {
        method: "GET",
        params: { page, limit },
      }
    );
  },

  // Collections
  getCollections: async () => {
    return apiClient<{ collections: Collection[] }>("/users/me/collections", {
      method: "GET",
    });
  },

  createCollection: async (payload: { name: string; description?: string }) => {
    const data = await apiClient<{ collection: Collection }>("/users/me/collections", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data?.collection || (data as unknown as Collection);
  },

  updateCollection: async (
    collectionId: string,
    payload: { name?: string; description?: string }
  ) => {
    return apiClient<Collection>(`/collections/${collectionId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  deleteCollection: async (collectionId: string) => {
    return apiClient(`/collections/${collectionId}`, {
      method: "DELETE",
    });
  },

  addSkillToCollection: async (collectionId: string, skillId: string) => {
    return apiClient(`/collections/${collectionId}/skills/${skillId}`, {
      method: "POST",
    });
  },

  removeSkillFromCollection: async (collectionId: string, skillId: string) => {
    return apiClient(`/collections/${collectionId}/skills/${skillId}`, {
      method: "DELETE",
    });
  },

  // Downloads
  downloadSkill: async (skillId: string, filename = "skill.zip") => {
    const blob = await apiClient<Blob>(`/skills/${skillId}/download`, {
      method: "GET",
      skipAuth: false,
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};
