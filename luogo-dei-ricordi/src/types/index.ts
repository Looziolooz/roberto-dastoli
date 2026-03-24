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
  created_at: string;
  tags?: Tag[];
}

export interface MemoryWithTags extends Memory {
  memory_tags: { tag_id: string; tags: Tag }[];
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
}