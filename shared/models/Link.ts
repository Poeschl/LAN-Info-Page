export interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  /** URL to fetch the link's image from, e.g. "/api/links/images/wiki.png" */
  imageUrl?: string;
  category?: string;
  adminOnly: boolean;
}

export interface LinksResponse {
  links: Link[];
  isAdmin: boolean;
}
