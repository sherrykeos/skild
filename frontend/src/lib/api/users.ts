import { apiClient } from "./client";
import { PublicUserProfile, User } from "@/types/user";

export const usersApi = {
  getMe: async () => {
    const data = await apiClient<{ user: User }>("/users/me", {
      method: "GET",
    });
    return data?.user || (data as unknown as User);
  },

  updateMe: async (payload: { username?: string; avatar?: string | null }) => {
    const data = await apiClient<{ user: User }>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return data?.user || (data as unknown as User);
  },

  getPublicProfile: async (username: string) => {
    return apiClient<PublicUserProfile>(`/users/${encodeURIComponent(username)}`, {
      method: "GET",
    });
  },
};
