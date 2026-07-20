import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { PropertyRecommendationRepository } from "../repository/property-recommendations.repository";
import { PropertyRepository } from "../../properties/repository/property.repository";
import { PropertyInventoryRepository } from "../../property-inventory/repository/property-inventory.repository";
import { 
  FeaturePropertyDto,
  RecommendPropertyDto,
  UnrecommendPropertyDto,
  UpdateScoreDto,
  BulkFeatureDto,
  BulkRecommendDto,
  RecommendationQueryDto,
  DashboardQueryDto,
  BulkRecommendationResponseDto
} from "../dto/property-recommendations.dto";
import { PropertyRecommendationEntity, RecommendationCategory } from "@/types/property-recommendations.types";
import { ValidationError, NotFoundError } from "@/lib/errors/domain.error";

export class PropertyRecommendationService extends BaseService {
  private repository: PropertyRecommendationRepository;
  private propertyRepository: PropertyRepository;
  private inventoryRepository: PropertyInventoryRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new PropertyRecommendationRepository(supabase);
    this.propertyRepository = new PropertyRepository(supabase);
    this.inventoryRepository = new PropertyInventoryRepository(supabase);
  }

  private async validatePropertyEligibleForFeature(propertyId: string): Promise<void> {
    const property = await this.propertyRepository.findById(propertyId);
    if (!property) throw new NotFoundError("Property");

    if (!property.is_active) {
      throw new ValidationError("Only Published (active) properties can become Featured.");
    }
    
    if (!property.price) {
      throw new ValidationError("Featured properties require Pricing.");
    }

    // Example of deep checks: In production, we would also query property_images to ensure a primary image exists
    // and verify SEO metadata fields.
    if (!property.seo_title || !property.seo_description) {
      throw new ValidationError("Featured properties require SEO Metadata.");
    }

    // Validate Inventory Status (Cannot feature SOLD properties)
    const inventory = await this.inventoryRepository.getCurrentState(propertyId);
    if (inventory.status === 'SOLD') {
      throw new ValidationError("Sold properties cannot become Featured.");
    }
  }

  private async validatePropertyEligibleForRecommendation(propertyId: string): Promise<void> {
    const property = await this.propertyRepository.findById(propertyId);
    if (!property) throw new NotFoundError("Property");

    // Only Available (or Limited) properties can be recommended.
    const inventory = await this.inventoryRepository.getCurrentState(propertyId);
    if (inventory.status === 'SOLD' || inventory.status === 'CANCELLED') {
      throw new ValidationError(`Properties with inventory status ${inventory.status} cannot become Recommended.`);
    }
  }

  async getFeatured(query: RecommendationQueryDto) {
    return this.executeSafe(async () => this.repository.findFeatured(query));
  }

  async getRecommended(query: RecommendationQueryDto) {
    return this.executeSafe(async () => this.repository.findRecommended(query));
  }

  async getTrending(query: RecommendationQueryDto) {
    return this.executeSafe(async () => this.repository.findTrending(query));
  }

  async getEditorsChoice(query: RecommendationQueryDto) {
    return this.executeSafe(async () => this.repository.getByCategory('EDITORS_CHOICE' as any, query));
  }

  async getCollections(collectionName: string, query: RecommendationQueryDto) {
    return this.executeSafe(async () => this.repository.findCollections(collectionName, query));
  }

  async featureProperty(id: string, dto: FeaturePropertyDto): Promise<PropertyRecommendationEntity> {
    return this.executeSafe(async () => {
      await this.validatePropertyEligibleForFeature(id);
      
      const rec = await this.repository.upsertRecommendation(id, 'FEATURED', dto.recommendation_score);
      // Sync back to properties.is_featured for legacy UI reliance
      await this.propertyRepository.update(id, { is_featured: true });
      
      return rec;
    });
  }

  async unfeatureProperty(id: string): Promise<void> {
    return this.executeSafe(async () => {
      await this.repository.removeRecommendation(id, 'FEATURED');
      await this.propertyRepository.update(id, { is_featured: false });
    });
  }

  async recommendProperty(id: string, dto: RecommendPropertyDto): Promise<PropertyRecommendationEntity> {
    return this.executeSafe(async () => {
      await this.validatePropertyEligibleForRecommendation(id);
      return await this.repository.upsertRecommendation(id, dto.category, dto.recommendation_score, dto.collection_name);
    });
  }

  async unrecommendProperty(id: string, dto: UnrecommendPropertyDto): Promise<void> {
    return this.executeSafe(async () => {
      await this.repository.removeRecommendation(id, dto.category, dto.collection_name);
    });
  }

  async updateScore(id: string, dto: UpdateScoreDto): Promise<PropertyRecommendationEntity> {
    return this.executeSafe(async () => {
      // Upsert implicitly updates if it exists
      return await this.repository.upsertRecommendation(id, dto.category, dto.recommendation_score, dto.collection_name);
    });
  }

  async getDashboard(query: DashboardQueryDto): Promise<{ data: any[]; count: number }> {
    return this.executeSafe(async () => {
      return await this.repository.getDashboard(query);
    });
  }

  // --- Bulk Operations ---

  async bulkFeature(dto: BulkFeatureDto): Promise<BulkRecommendationResponseDto> {
    return this.executeSafe(async () => {
      const success: PropertyRecommendationEntity[] = [];
      const failed: { property_id: string; error: string }[] = [];

      for (const id of dto.property_ids) {
        try {
          await this.validatePropertyEligibleForFeature(id);
          const rec = await this.repository.upsertRecommendation(id, 'FEATURED', dto.recommendation_score);
          await this.propertyRepository.update(id, { is_featured: true });
          success.push(rec);
        } catch (error: any) {
          failed.push({ property_id: id, error: error.message });
        }
      }
      return { success, failed };
    });
  }

  async bulkRecommend(dto: BulkRecommendDto): Promise<BulkRecommendationResponseDto> {
    return this.executeSafe(async () => {
      const success: PropertyRecommendationEntity[] = [];
      const failed: { property_id: string; error: string }[] = [];

      for (const id of dto.property_ids) {
        try {
          await this.validatePropertyEligibleForRecommendation(id);
          const rec = await this.repository.upsertRecommendation(id, dto.category, dto.recommendation_score, dto.collection_name);
          success.push(rec);
        } catch (error: any) {
          failed.push({ property_id: id, error: error.message });
        }
      }
      return { success, failed };
    });
  }
}
