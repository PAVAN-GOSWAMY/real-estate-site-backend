"use server";

import { revalidatePath } from 'next/cache';
import { BannersService } from '../services/banners.service';
import { CreateBannerDTO, UpdateBannerDTO } from '../types';
import { ensureAdminAuth } from "@/lib/auth/utils";

export async function getPublicBannersAction() {
  try {
    const banners = await BannersService.getPublicBanners();
    return { success: true, data: banners };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllBannersAction() {
  try {
    await ensureAdminAuth();
    const banners = await BannersService.getAllBanners();
    return { success: true, data: banners };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createBannerAction(input: CreateBannerDTO) {
  try {
    await ensureAdminAuth();
    const banner = await BannersService.createBanner(input);
    revalidatePath('/admin/banners');
    revalidatePath('/'); // Revalidate home page deals & offers section
    return { success: true, data: banner };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateBannerAction(id: string, input: UpdateBannerDTO) {
  try {
    await ensureAdminAuth();
    const banner = await BannersService.updateBanner(id, input);
    revalidatePath('/admin/banners');
    revalidatePath('/'); // Revalidate home page deals & offers section
    return { success: true, data: banner };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteBannerAction(id: string) {
  try {
    await ensureAdminAuth();
    await BannersService.deleteBanner(id);
    revalidatePath('/admin/banners');
    revalidatePath('/'); // Revalidate home page deals & offers section
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
