import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { FavoriteRepository } from "../repository/favorite.repository";
import { PropertyRepository } from "../../properties/repository/property.repository";
import { FavoriteQueryDto, AddFavoriteDto } from "../dto/favorites.dto";
import { ValidationError, ConflictError, NotFoundError } from "@/lib/errors/domain.error";

export class FavoriteService extends BaseService {
  private repository: FavoriteRepository;
  private propertyRepository: PropertyRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new FavoriteRepository(supabase);
    this.propertyRepository = new PropertyRepository(supabase);
  }

  async addFavorite(userId: string, dto: AddFavoriteDto) {
    return this.executeSafe(async () => {
      const property = await this.propertyRepository.findById(dto.property_id);
      if (!property) throw new NotFoundError("Property");

      if (!property.is_active) {
        throw new ValidationError("Cannot favorite an unpublished property.");
      }

      try {
        await this.repository.addFavorite(userId, dto.property_id);
      } catch (err: any) {
        if (err.message && err.message.includes('unique constraint')) {
          throw new ConflictError("Property is already in favorites.");
        }
        throw err;
      }
    });
  }

  async removeFavorite(userId: string, propertyId: string) {
    return this.executeSafe(async () => {
      await this.repository.removeFavorite(userId, propertyId);
    });
  }

  async getFavorites(query: FavoriteQueryDto) {
    return this.executeSafe(async () => {
      return await this.repository.getFavorites(query);
    });
  }

  async getRecentFavorites() {
    return this.executeSafe(async () => {
      return await this.repository.getRecentFavorites();
    });
  }
}
