import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/lib/repositories/base/base.repository";
import { 
  PropertyRecommendationEntity, 
  RecommendationCategory 
} from "@/types/property-recommendations.types";
import { RecommendationQueryDto, DashboardQueryDto } from "../dto/property-recommendations.dto";
import { Modules } from "@/lib/constants/modules";

export class PropertyRecommendationRepository extends BaseRepository<PropertyRecommendationEntity, any, any> {
  constructor(supabase: SupabaseClient) {
    super(supabase, Modules.PROPERTY_RECOMMENDATIONS);
  }

  private async getByCategory(category: RecommendationCategory, query: RecommendationQueryDto): Promise<{ data: any[]; count: number }> {
    const { page, limit, collection_name } = query;
    const offset = (page! - 1) * limit!;

    // Join with properties and property_inventory_states to ensure they are still published and available/limited
    let q = this.supabase
      .from(this.tableName)
      .select('*, properties!inner(id, unit_code, price, is_active, is_featured, property_inventory_states(status))', { count: 'exact' })
      .eq('category', category)
      .eq('is_active', true)
      .eq('properties.is_active', true) // Must be published
      .range(offset, offset + limit! - 1)
      .order('recommendation_score', { ascending: false });

    if (collection_name) {
      q = q.eq('collection_name', collection_name);
    }

    const { data, count, error } = await q;

    if (error) {
      this.handleError(error, `getByCategory_${category}`);
    }

    // Filter out SOLD units implicitly by analyzing the nested state if needed, but for now we return them and let frontend/service decide
    return { data: data || [], count: count || 0 };
  }

  async findFeatured(query: RecommendationQueryDto) {
    return this.getByCategory('FEATURED', query);
  }

  async findTrending(query: RecommendationQueryDto) {
    return this.getByCategory('TRENDING', query);
  }

  async findRecommended(query: RecommendationQueryDto) {
    return this.getByCategory('RECOMMENDED', query);
  }

  async findCollections(collectionName: string, query: RecommendationQueryDto) {
    return this.getByCategory('LUXURY_COLLECTION', { ...query, collection_name: collectionName }); // Or we can allow any category with a collection
  }

  async upsertRecommendation(
    propertyId: string, 
    category: RecommendationCategory, 
    score: number, 
    collectionName: string | null = null
  ): Promise<PropertyRecommendationEntity> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .upsert({
        property_id: propertyId,
        category,
        collection_name: collectionName,
        recommendation_score: score,
        is_active: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'property_id, category, collection_name'
      })
      .select()
      .single();

    if (error) {
      this.handleError(error, 'upsertRecommendation');
    }

    return data;
  }

  async removeRecommendation(propertyId: string, category: RecommendationCategory, collectionName: string | null = null): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('property_id', propertyId)
      .eq('category', category)
      .eq('collection_name', collectionName || null); // Note: eq on null in supabase translates to IS NULL

    if (error) {
      this.handleError(error, 'removeRecommendation');
    }
  }

  async getDashboard(query: DashboardQueryDto): Promise<{ data: any[]; count: number }> {
    const { page, limit, category, is_active } = query;
    const offset = (page! - 1) * limit!;

    let q = this.supabase
      .from(this.tableName)
      .select('*, properties(id, unit_code)', { count: 'exact' })
      .range(offset, offset + limit! - 1)
      .order('updated_at', { ascending: false });

    if (category) q = q.eq('category', category);
    if (is_active !== undefined) q = q.eq('is_active', is_active);

    const { data, count, error } = await q;

    if (error) {
      this.handleError(error, 'getDashboard');
    }

    return { data: data || [], count: count || 0 };
  }
}
