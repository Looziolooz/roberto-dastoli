// ============================================================
// Core domain types — strict, no implicit any
// typescript-pro: full type safety across all entities
// ============================================================

export interface Tag {
  id: string;
  name: string;
  icon: string;
  created_at: string;
}

export interface Memory {
  id: string;
  caption: string;
  author_name: string;
  image_url: string | null;
  is_approved: boolean;
  is_archived?: boolean;
  is_anonymous?: boolean;
  created_at: string;
}

// Represents the join row from memory_tags table
export interface MemoryTagJoin {
  tag_id: string;
  tags: Tag;
}

export interface MemoryWithTags extends Memory {
  memory_tags: MemoryTagJoin[];
}

export interface Story {
  id: string;
  title: string;
  body: string;
  author_name: string;
  is_anonymous: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface BiographyChapter {
  period: string;
  years: string;
  icon: string;
  text: string;
  color: string;
  photo?: string;
  photoPosition?: { x: number; y: number };
}

// ============================================================
// API payload types — explicit shapes for all fetch calls
// ============================================================

export interface CreateMemoryPayload {
  caption: string;
  author_name: string;
  is_anonymous?: boolean;
  image_url: string | null;
  tag_ids: string[];
}

export interface CreateStoryPayload {
  title: string;
  body: string;
  author_name: string;
  is_anonymous: boolean;
  tag_ids: string[];
}

export interface AdminActionPayload {
  id: string;
}

export interface AdminDeleteMemoryPayload extends AdminActionPayload {
  image_url?: string | null;
  action?: "archive" | "delete_permanent" | "hide";
}

// ============================================================
// UI state types
// ============================================================

export type AdminTab = "pending" | "archive";
export type UploadTab = "memory" | "story";
