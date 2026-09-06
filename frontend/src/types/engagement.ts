import { SkillAuthor } from "./skill";

export interface Review {
  id: string;
  content: string;
  rating?: number;
  userId: string;
  skillId: string;
  user?: SkillAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string | null;
  userId: string;
  skills?: {
    skillId: string;
    skill: any;
    addedAt: string;
  }[];
  _count?: {
    skills: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GitHubInspectResult {
  repository: {
    owner: string;
    name: string;
    fullName: string;
    defaultBranch: string;
    description: string;
    htmlUrl: string;
  };
  branches: {
    name: string;
    protected: boolean;
  }[];
}

export interface GitHubTreeItem {
  path: string;
  type: "file" | "tree";
  size: number;
}

export interface GitHubTreeResult {
  branch: string;
  files: GitHubTreeItem[];
}
