import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { ShortlistRepository } from "../repository/shortlist.repository";
import { PropertyRepository } from "../../properties/repository/property.repository";
import { 
  ShortlistQueryDto, 
  CreateShortlistDto, 
  UpdateShortlistDto, 
  ShareShortlistDto,
  AddShortlistItemDto,
  UpdateShortlistItemDto
} from "../dto/favorites.dto";
import { ValidationError, ConflictError, NotFoundError, AuthorizationError } from "@/lib/errors/domain.error";

export class ShortlistService extends BaseService {
  private repository: ShortlistRepository;
  private propertyRepository: PropertyRepository;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new ShortlistRepository(supabase);
    this.propertyRepository = new PropertyRepository(supabase);
  }

  private async validateOwnership(shortlistId: string, userId: string): Promise<any> {
    const shortlist = await this.repository.findById(shortlistId);
    if (!shortlist) throw new NotFoundError("Shortlist");

    if (shortlist.user_id !== userId) {
      // NOTE: In a real system, we'd also check if the user is a CRM agent holding 'crm.shortlists.manage' over this lead_id.
      // For this simplified logic, we enforce strict ownership.
      throw new AuthorizationError("You do not own this shortlist.");
    }

    return shortlist;
  }

  async createShortlist(userId: string, dto: CreateShortlistDto) {
    return this.executeSafe(async () => {
      return await this.repository.create({
        user_id: userId,
        name: dto.name,
        description: dto.description || null,
        lead_id: dto.lead_id || null,
      });
    });
  }

  async updateShortlist(userId: string, shortlistId: string, dto: UpdateShortlistDto) {
    return this.executeSafe(async () => {
      await this.validateOwnership(shortlistId, userId);
      return await this.repository.update(shortlistId, dto);
    });
  }

  async deleteShortlist(userId: string, shortlistId: string) {
    return this.executeSafe(async () => {
      await this.validateOwnership(shortlistId, userId);
      return await this.repository.delete(shortlistId);
    });
  }

  async getShortlists(query: ShortlistQueryDto) {
    return this.executeSafe(async () => {
      return await this.repository.getShortlists(query);
    });
  }

  async getShortlist(userId: string, shortlistId: string) {
    return this.executeSafe(async () => {
      await this.validateOwnership(shortlistId, userId);
      return await this.repository.getShortlistWithProperties(shortlistId);
    });
  }

  async getSharedShortlist(token: string) {
    return this.executeSafe(async () => {
      const shortlist = await this.repository.getShortlistByShareToken(token);
      if (!shortlist) throw new NotFoundError("Shared Shortlist");

      if (shortlist.expires_at) {
        if (new Date() > new Date(shortlist.expires_at)) {
          throw new ValidationError("This shared shortlist link has expired."); // Technically 410 Gone, but ValidationError maps to 400
        }
      }

      return shortlist;
    });
  }

  async shareShortlist(userId: string, shortlistId: string, dto: ShareShortlistDto) {
    return this.executeSafe(async () => {
      await this.validateOwnership(shortlistId, userId);
      
      let expiresAt: string | null = null;
      if (dto.expires_in_days) {
        const d = new Date();
        d.setDate(d.getDate() + dto.expires_in_days);
        expiresAt = d.toISOString();
      }

      const updated = await this.repository.updateShareToken(shortlistId, expiresAt);
      return {
        share_token: updated.share_token,
        share_url: `/shortlists/shared/${updated.share_token}`,
        expires_at: updated.expires_at
      };
    });
  }

  // --- Items ---

  async addProperty(userId: string, shortlistId: string, dto: AddShortlistItemDto) {
    return this.executeSafe(async () => {
      await this.validateOwnership(shortlistId, userId);

      const property = await this.propertyRepository.findById(dto.property_id);
      if (!property) throw new NotFoundError("Property");

      try {
        await this.repository.addProperty(shortlistId, dto.property_id, dto.priority, dto.notes || null);
      } catch (err: any) {
        if (err.message && err.message.includes('unique constraint')) {
          throw new ConflictError("Property is already in this shortlist.");
        }
        throw err;
      }
    });
  }

  async updateProperty(userId: string, shortlistId: string, propertyId: string, dto: UpdateShortlistItemDto) {
    return this.executeSafe(async () => {
      await this.validateOwnership(shortlistId, userId);
      
      const payload: any = {};
      if (dto.notes !== undefined) payload.notes = dto.notes;
      if (dto.priority !== undefined) payload.priority = dto.priority;

      await this.repository.updateProperty(shortlistId, propertyId, payload);
    });
  }

  async removeProperty(userId: string, shortlistId: string, propertyId: string) {
    return this.executeSafe(async () => {
      await this.validateOwnership(shortlistId, userId);
      await this.repository.removeProperty(shortlistId, propertyId);
    });
  }
}
