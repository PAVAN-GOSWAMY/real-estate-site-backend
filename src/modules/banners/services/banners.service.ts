import { BannersRepository } from '../repository/banners.repository';
import { CreateBannerDTO, UpdateBannerDTO } from '../types';

export class BannersService {
  
  static async getPublicBanners() {
    return BannersRepository.getPublicBanners();
  }

  static async getAllBanners() {
    return BannersRepository.getAllBanners();
  }

  static async createBanner(input: CreateBannerDTO) {
    if (!input.title || input.title.trim().length === 0) {
      throw new Error("Title is required.");
    }
    if (!input.imageUrl || input.imageUrl.trim().length === 0) {
      throw new Error("Image URL is required.");
    }

    const payload: CreateBannerDTO = {
      title: input.title.trim(),
      imageUrl: input.imageUrl.trim(),
      linkUrl: input.linkUrl ? input.linkUrl.trim() : null,
      isActive: input.isActive ?? true,
      displayOrder: input.displayOrder ?? 0,
    };

    return BannersRepository.createBanner(payload);
  }

  static async updateBanner(id: string, input: UpdateBannerDTO) {
    if (!id) {
      throw new Error("Banner ID is required.");
    }

    const payload: UpdateBannerDTO = {};
    
    if (input.title !== undefined) {
      if (input.title.trim().length === 0) throw new Error("Title cannot be empty.");
      payload.title = input.title.trim();
    }
    
    if (input.imageUrl !== undefined) {
      if (input.imageUrl.trim().length === 0) throw new Error("Image URL cannot be empty.");
      payload.imageUrl = input.imageUrl.trim();
    }
    
    if (input.linkUrl !== undefined) {
      payload.linkUrl = input.linkUrl ? input.linkUrl.trim() : null;
    }
    
    if (input.isActive !== undefined) {
      payload.isActive = input.isActive;
    }
    
    if (input.displayOrder !== undefined) {
      payload.displayOrder = input.displayOrder;
    }

    return BannersRepository.updateBanner(id, payload);
  }

  static async deleteBanner(id: string) {
    if (!id) {
      throw new Error("Banner ID is required.");
    }
    return BannersRepository.deleteBanner(id);
  }
}
