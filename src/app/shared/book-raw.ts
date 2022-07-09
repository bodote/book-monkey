export interface BookRaw {
  title: string;
  subtitle?: string;
  authors: string[];
  published: string;
  isbn: string;
  thumbnails?: ThumbnailRaw[];
  rating?: number;
  description?: string;
}
export interface ThumbnailRaw {
  url: string;
  title?: string;
}
