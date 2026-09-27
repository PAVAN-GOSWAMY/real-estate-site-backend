export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBannerDTO {
  title: string;
  imageUrl: string;
  linkUrl?: string | null;
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdateBannerDTO {
  title?: string;
  imageUrl?: string;
  linkUrl?: string | null;
  isActive?: boolean;
  displayOrder?: number;
}
