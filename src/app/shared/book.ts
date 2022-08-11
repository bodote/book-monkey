export interface Book {
  title: string;
  subtitle?: string;
  authors: string[];
  published: Date;
  isbn: string;
  thumbnails?: Thumbnail[];
  rating?: number | null;
  description?: string;
}
export interface Thumbnail {
  url: string;
  title?: string;
}
