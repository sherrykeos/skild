export type AuthProvider = "LOCAL" | "GOOGLE";

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
  provider?: AuthProvider;
  isEmailVerified?: boolean;
  emailVerifiedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PublicUserProfile {
  id: string;
  username: string;
  avatar?: string | null;
  bio?: string | null;
  website?: string | null;
  github?: string | null;
  createdAt?: string;
  _count?: {
    skills: number;
    downloads: number;
    upvotes: number;
  };
  skills?: any[];
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
