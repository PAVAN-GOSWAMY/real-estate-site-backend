import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { UserFavoriteEntity } from "@/types/favorites.types";
import { FavoriteQueryDto } from "../dto/favorites.dto";
import { Modules } from "@/lib/constants/modules";

export class FavoriteRepository extends BaseRepository<UserFavoriteEntity, any, any> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.USER_FAVORITES);
  }

  async addFavorite(userId: string, propertyId: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .insert({ user_id: userId, property_id: propertyId });

    if (error) {
      this.handleError(error, 'addFavorite');
    }
  }

  async removeFavorite(userId: string, propertyId: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId);

    if (error) {
      this.handleError(error, 'removeFavorite');
    }
  }

  async getFavorites(query: FavoriteQueryDto): Promise<{ data: any[]; count: number }> {
    const { page, limit, user_id } = query;
    const offset = (page! - 1) * limit!;

    let q = this.supabase
      .from(this.tableName)
      .select('*, properties(*, builders(id, name), locations(id, city, neighborhood))', { count: 'exact' })
      .range(offset, offset + limit! - 1)
      .order('created_at', { ascending: false });

    if (user_id) q = q.eq('user_id', user_id);

    const { data, count, error } = await q;

    if (error) {
      this.handleError(error, 'getFavorites');
    }

    return { data: data || [], count: count || 0 };
  }

  async getRecentFavorites(limit: number = 5): Promise<any[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*, properties(id, unit_code, price, listing_title, is_active)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      this.handleError(error, 'getRecentFavorites');
    }

    return data || [];
  }
}
