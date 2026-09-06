export type SkillStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type SkillSourceType = "MANUAL" | "GITHUB";

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  count?: number;
}

export interface SkillFile {
  id?: string;
  path: string;
  content: string;
  mimeType?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillVersion {
  id: string;
  skillId: string;
  version: string;
  changelog?: string | null;
  sourceBranch?: string | null;
  files?: SkillFile[];
  createdAt?: string;
  publishedAt?: string | null;
}

export interface SkillAuthor {
  id: string;
  username: string;
  avatar?: string | null;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: SkillStatus;
  sourceType: SkillSourceType;
  sourceUrl?: string | null;
  authorId: string;
  author?: SkillAuthor;
  categoryId?: string | null;
  category?: Category | null;
  tags?: Tag[];
  versions?: SkillVersion[];
  downloadCount?: number;
  upvoteCount?: number;
  reviewCount?: number;
  _count?: {
    downloads: number;
    upvotes: number;
    reviews: number;
    savedBy?: number;
  };
  hasUpvoted?: boolean;
  hasSaved?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}

export interface MarketplaceSkillsResponse {
  skills: Skill[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
