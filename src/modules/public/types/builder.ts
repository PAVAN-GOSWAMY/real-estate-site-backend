export interface PublicFeaturedBuilder {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  description: string | null;
  establishedYear: number | null;
  activePropertyCount: number;
}
