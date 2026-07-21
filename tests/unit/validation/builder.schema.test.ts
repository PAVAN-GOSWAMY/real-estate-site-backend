import { describe, it, expect } from 'vitest';
import { 
  CreateBuilderSchema, 
  UpdateBuilderSchema, 
  BuilderFilterSchema 
} from '@/modules/builders/validation/builder.schema';

describe('Builder Validation Schemas', () => {
  
  describe('CreateBuilderSchema', () => {
    it('should successfully validate a complete valid payload', () => {
      const validPayload = {
        name: 'Prestige Group',
        slug: 'prestige-group',
        description: 'Leading real estate developer.',
        logoUrl: 'https://example.com/logo.png',
        establishedYear: 1986,
        headquarters: 'Bangalore, India',
        website: 'https://prestige.com',
        email: 'info@prestige.com',
        phone: '1234567890',
        isFeatured: true,
        isActive: true,
      };

      const result = CreateBuilderSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should fail when missing required fields', () => {
      const payload = {
        description: 'Missing name and slug',
      };
      
      const result = CreateBuilderSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.format();
        expect(errors.name?._errors).toBeDefined();
        expect(errors.slug?._errors).toBeDefined();
      }
    });

    it('should fail when required strings are empty', () => {
      const payload = {
        name: '',
        slug: '',
      };
      
      const result = CreateBuilderSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should enforce name boundaries', () => {
      const tooShort = { name: 'A', slug: 'a' };
      const tooLong = { 
        name: 'A'.repeat(121), 
        slug: 'a-long-slug' 
      };

      expect(CreateBuilderSchema.safeParse(tooShort).success).toBe(false);
      expect(CreateBuilderSchema.safeParse(tooLong).success).toBe(false);
    });

    it('should auto-lowercase slugs', () => {
      const payload = { name: 'Valid Name', slug: 'Uppercase' };
      const result = CreateBuilderSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.slug).toBe('uppercase');
      }
    });

    it('should reject invalid slug characters', () => {
      const invalidSlugs = ['spaces included', 'special@chars', 'trailing-dash-'];
      
      invalidSlugs.forEach(slug => {
        const payload = { name: 'Valid Name', slug };
        const result = CreateBuilderSchema.safeParse(payload);
        expect(result.success).toBe(false);
      });
    });

    it('should reject invalid emails', () => {
      const payload = { name: 'Name', slug: 'slug', email: 'not-an-email' };
      expect(CreateBuilderSchema.safeParse(payload).success).toBe(false);
    });

    it('should allow empty string for email and website', () => {
      const payload = { name: 'Name', slug: 'slug', email: '', website: '' };
      expect(CreateBuilderSchema.safeParse(payload).success).toBe(true);
    });

    it('should reject invalid websites', () => {
      const payload = { name: 'Name', slug: 'slug', website: 'not-a-url' };
      expect(CreateBuilderSchema.safeParse(payload).success).toBe(false);
    });

    it('should enforce phone boundaries', () => {
      expect(CreateBuilderSchema.safeParse({ name: 'N', slug: 's', phone: '123' }).success).toBe(false);
      expect(CreateBuilderSchema.safeParse({ name: 'N', slug: 's', phone: '123456789012345678901' }).success).toBe(false);
    });

    it('should enforce established year boundaries', () => {
      const past = { name: 'N', slug: 's', establishedYear: 1799 };
      const future = { name: 'N', slug: 's', establishedYear: new Date().getFullYear() + 1 };
      
      expect(CreateBuilderSchema.safeParse(past).success).toBe(false);
      expect(CreateBuilderSchema.safeParse(future).success).toBe(false);
    });

    it('should successfully validate with only required fields and apply defaults', () => {
      const payload = {
        name: 'Minimal Builder',
        slug: 'minimal-builder'
      };

      const result = CreateBuilderSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isFeatured).toBe(false);
        expect(result.data.isActive).toBe(true);
      }
    });
  });

  describe('UpdateBuilderSchema', () => {
    it('should successfully validate partial updates', () => {
      const partialUpdate = {
        name: 'New Name',
      };
      
      const result = UpdateBuilderSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('should reject invalid partial updates', () => {
      const partialUpdate = {
        name: 'A', // Too short
      };
      
      const result = UpdateBuilderSchema.safeParse(partialUpdate);
      expect(result.success).toBe(false);
    });

    it('should not allow explicit null values for optional string fields', () => {
      // Zod .optional() means string | undefined, NOT string | null
      const partialUpdate = {
        description: null,
      };
      
      const result = UpdateBuilderSchema.safeParse(partialUpdate);
      expect(result.success).toBe(false);
    });
  });

  describe('BuilderFilterSchema', () => {
    it('should validate default pagination values', () => {
      const result = BuilderFilterSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
      }
    });

    it('should reject invalid pagination values', () => {
      expect(BuilderFilterSchema.safeParse({ page: 0 }).success).toBe(false);
      expect(BuilderFilterSchema.safeParse({ limit: 0 }).success).toBe(false);
      expect(BuilderFilterSchema.safeParse({ limit: 101 }).success).toBe(false); // Max is 100
    });

    it('should validate boolean filters', () => {
      const payload = {
        featured: true,
        active: false,
      };
      
      const result = BuilderFilterSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should accept valid search strings', () => {
      const result = BuilderFilterSchema.safeParse({ search: '  padded search  ' });
      expect(result.success).toBe(true);
      if (result.success) {
        // Schema doesn't trim by default
        expect(result.data.search).toBe('  padded search  ');
      }
    });
  });
});
