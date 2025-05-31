export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  content: { title: string; content: string; image_url?: string; image_caption?: string }[];
  banner_url?: string;
  category: string;
  created_at?: string;
};

export type Comment = {
  id: number;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
};