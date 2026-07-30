export interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  category?: string;
  adminOnly: boolean;
}

export interface LinksResponse {
  links: Link[];
  isAdmin: boolean;
}
