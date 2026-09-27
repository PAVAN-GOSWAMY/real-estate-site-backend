import { createClient } from '@/lib/supabase/server';
import { Banner, CreateBannerDTO, UpdateBannerDTO } from '../types';

function mapToBanner(row: any): Banner {
  return {
    id: row.id,
    title: row.title,
    imageUrl: row.image_url,
    linkUrl: row.link_url,
    isActive: row.is_active,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class BannersRepository {
  
  static async getPublicBanners(): Promise<Banner[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch public banners: ${error.message}`);
    return (data || []).map(mapToBanner);
  }

  static async getAllBanners(): Promise<Banner[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch all banners: ${error.message}`);
    return (data || []).map(mapToBanner);
  }

  static async createBanner(input: CreateBannerDTO): Promise<Banner> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('banners')
      .insert({
        title: input.title,
        image_url: input.imageUrl,
        link_url: input.linkUrl,
        is_active: input.isActive ?? true,
        display_order: input.displayOrder ?? 0,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create banner: ${error.message}`);
    return mapToBanner(data);
  }

  static async updateBanner(id: string, input: UpdateBannerDTO): Promise<Banner> {
    const supabase = await createClient();
    
    const updates: any = {};
    if (input.title !== undefined) updates.title = input.title;
    if (input.imageUrl !== undefined) updates.image_url = input.imageUrl;
    if (input.linkUrl !== undefined) updates.link_url = input.linkUrl;
    if (input.isActive !== undefined) updates.is_active = input.isActive;
    if (input.displayOrder !== undefined) updates.display_order = input.displayOrder;
    
    // updated_at is handled by DB trigger

    const { data, error } = await supabase
      .from('banners')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update banner: ${error.message}`);
    return mapToBanner(data);
  }

  static async deleteBanner(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete banner: ${error.message}`);
  }
}
