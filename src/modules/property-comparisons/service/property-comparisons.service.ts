import { SupabaseClient } from "@supabase/supabase-js";
import { BaseService } from "@/lib/services/base/base.service";
import { PropertyComparisonRepository } from "../repository/property-comparisons.repository";
import { PropertyRepository } from "../../properties/repository/property.repository";
import { PropertyInventoryRepository } from "../../property-inventory/repository/property-inventory.repository";
import { 
  CreateComparisonSessionDto,
  AddPropertyToComparisonDto,
  ReplaceComparisonPropertyDto,
  ShareComparisonDto,
  ComparisonHistoryQueryDto
} from "../dto/property-comparisons.dto";
import { ValidationError, NotFoundError, ConflictError } from "@/lib/errors/domain.error";

export class PropertyComparisonService extends BaseService {
  private repository: PropertyComparisonRepository;
  private propertyRepository: PropertyRepository;
  private inventoryRepository: PropertyInventoryRepository;

  // Hardcoded as part of Architectural Strategy for matrix UI consistency
  private readonly MAX_COMPARISON_LIMIT = 4;

  constructor(supabase: SupabaseClient) {
    super();
    this.repository = new PropertyComparisonRepository(supabase);
    this.propertyRepository = new PropertyRepository(supabase);
    this.inventoryRepository = new PropertyInventoryRepository(supabase);
  }

  private async validatePropertyEligibleForComparison(propertyId: string): Promise<void> {
    const property = await this.propertyRepository.findById(propertyId);
    if (!property) throw new NotFoundError("Property");

    if (!property.is_active) {
      throw new ValidationError("Only Published (active) properties can be compared.");
    }
  }

  private async ensureSessionExistsAndActive(sessionId: string) {
    const session = await this.repository.findById(sessionId);
    if (!session || !session.is_active) {
      throw new NotFoundError("Comparison Session");
    }
    return session;
  }

  async createSession(dto: CreateComparisonSessionDto) {
    return this.executeSafe(async () => {
      // 1. Create the session
      const session = await this.repository.createSession(dto.user_id, dto.title);
      
      // 2. Add initial properties if any
      if (dto.initial_property_ids && dto.initial_property_ids.length > 0) {
        let order = 1;
        for (const pid of dto.initial_property_ids) {
          await this.validatePropertyEligibleForComparison(pid);
          await this.repository.addPropertyToSession(session.id, pid, order++);
        }
      }

      // 3. Fetch hydrated session
      return await this.repository.getSessionWithProperties(session.id);
    });
  }

  async getSession(sessionId: string) {
    return this.executeSafe(async () => {
      const session = await this.repository.getSessionWithProperties(sessionId);
      if (!session) throw new NotFoundError("Comparison Session");
      return session;
    });
  }

  async getSessionByToken(token: string) {
    return this.executeSafe(async () => {
      const session = await this.repository.getSessionByShareToken(token);
      if (!session) throw new NotFoundError("Comparison Session (Token Invalid)");
      return session;
    });
  }

  async addProperty(sessionId: string, dto: AddPropertyToComparisonDto) {
    return this.executeSafe(async () => {
      await this.ensureSessionExistsAndActive(sessionId);

      // Check Limits
      const currentCount = await this.repository.getPropertyCountForSession(sessionId);
      if (currentCount >= this.MAX_COMPARISON_LIMIT) {
        throw new ValidationError(`Maximum comparison limit of ${this.MAX_COMPARISON_LIMIT} reached.`);
      }

      // Check Eligibility
      await this.validatePropertyEligibleForComparison(dto.property_id);

      // Attempt to add (Conflict will be thrown on duplicate due to PK constraint)
      try {
        await this.repository.addPropertyToSession(sessionId, dto.property_id, currentCount + 1);
      } catch (err: any) {
        if (err.message && err.message.includes('unique constraint')) {
          throw new ConflictError("Property is already in this comparison session.");
        }
        throw err;
      }

      return await this.repository.getSessionWithProperties(sessionId);
    });
  }

  async removeProperty(sessionId: string, propertyId: string) {
    return this.executeSafe(async () => {
      await this.ensureSessionExistsAndActive(sessionId);
      await this.repository.removePropertyFromSession(sessionId, propertyId);
      return await this.repository.getSessionWithProperties(sessionId);
    });
  }

  async replaceProperty(sessionId: string, oldPropertyId: string, dto: ReplaceComparisonPropertyDto) {
    return this.executeSafe(async () => {
      await this.ensureSessionExistsAndActive(sessionId);
      
      // Verify new property is eligible
      await this.validatePropertyEligibleForComparison(dto.new_property_id);

      // The simplest transaction is remove then add
      // (Order might shift slightly but we can just append, frontend sorts out the matrix)
      await this.repository.removePropertyFromSession(sessionId, oldPropertyId);
      
      const currentCount = await this.repository.getPropertyCountForSession(sessionId);
      
      try {
        await this.repository.addPropertyToSession(sessionId, dto.new_property_id, currentCount + 1);
      } catch (err: any) {
        if (err.message && err.message.includes('unique constraint')) {
           throw new ConflictError("New property is already in this comparison session.");
        }
        throw err;
      }

      return await this.repository.getSessionWithProperties(sessionId);
    });
  }

  async generateShareLink(sessionId: string, dto: ShareComparisonDto) {
    return this.executeSafe(async () => {
      const session = await this.ensureSessionExistsAndActive(sessionId);
      
      if (dto.title) {
        await this.repository.updateSessionTitle(sessionId, dto.title);
      }

      // Token is already generated at creation, we just return the link segment
      return {
        session_id: session.id,
        share_token: session.share_token,
        share_url: `/compare/shared/${session.share_token}` // frontend route structure
      };
    });
  }

  async deleteSession(sessionId: string) {
    return this.executeSafe(async () => {
      await this.ensureSessionExistsAndActive(sessionId);
      await this.repository.deleteSession(sessionId);
    });
  }

  async getHistory(query: ComparisonHistoryQueryDto): Promise<{ data: any[]; count: number }> {
    return this.executeSafe(async () => {
      return await this.repository.getHistory(query);
    });
  }
}
