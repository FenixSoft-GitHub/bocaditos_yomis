// src/types/Post.ts
export interface Post {
  title: string;
  date: string;
  slug: string;
  content: string;
}

export interface ContentPageLayoutProps {
  title: string;
  imageSrc: string;
  imageAlt: string;
  markdownContent: string;
  backTo?: string;
}

export interface BlogPostMetadata {
  title: string;
  date: string;
  author: string;
  slug: string;
  tags?: string[];
  featuredImage?: string;
  excerpt?: string;
  classCol: string;
  classMax: string;
}

