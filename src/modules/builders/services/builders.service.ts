import * as repository from '../repository/builders.repository';
import * as storageService from '@/lib/storage/storage.service';
import { CreateBuilderSchema, UpdateBuilderSchema } from '../validation/builder.schema';
import { Builder, CreateBuilderInput, UpdateBuilderInput, BuilderFilters } from '../types/builder';
import { z } from 'zod';

const BUILDER_LOGO_BUCKET = 'builder-logos';

/**
 * Generates a URL-friendly slug from a given string.
 * Converts to lowercase, removes special characters, and replaces spaces with hyphens.
 * 
 * @param text The text to sluggify.
 * @returns The generated slug.
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')    // Remove special characters
    .replace(/[\s_-]+/g, '-')    // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '');    // Remove leading and trailing hyphens
}

/**
 * Normalizes string values in an object by trimming whitespace and converting empty strings to undefined.
 * 
 * @param input The input object to normalize.
 * @returns A new normalized object.
 */
function normalizeInput(input: Record<string, unknown>): Record<string, unknown> {
  const normalized = { ...input };
  for (const key in normalized) {
    if (typeof normalized[key] === 'string') {
      const trimmed = (normalized[key] as string).trim();
      normalized[key] = trimmed === '' ? undefined : trimmed;
    }
  }
  return normalized;
}

/**
 * Validates input against a Zod schema and returns domain-friendly errors.
 * 
 * @param schema The Zod schema to validate against.
 * @param data The data to validate.
 * @returns The strictly typed, validated data.
 */
function validate<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const messages = result.error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new Error(`Validation Error: ${messages}`);
  }
  return result.data;
}

/**
 * Checks if a builder with the given name already exists.
 * Throws a domain-friendly error if a duplicate is found.
 */
async function checkDuplicateName(name: string, excludeId?: string): Promise<void> {
  // Using listBuilders as a basic check.
  const { items } = await repository.listBuilders({ search: name, limit: 100 });
  const duplicate = items.find(
    (b) => b.name.toLowerCase() === name.toLowerCase() && b.id !== excludeId
  );
  if (duplicate) {
    throw new Error(`Conflict Error: A builder with the name "${name}" already exists.`);
  }
}

/**
 * Checks if a builder with the given slug already exists.
 * Throws a domain-friendly error if a duplicate is found.
 */
async function checkDuplicateSlug(slug: string, excludeId?: string): Promise<void> {
  const existing = await repository.getBuilderBySlug(slug);
  if (existing && existing.id !== excludeId) {
    throw new Error(`Conflict Error: A builder with the slug "${slug}" already exists.`);
  }
}

/**
 * Creates a new builder.
 * Handles validation, normalization, slug generation, and conflict checks.
 * 
 * @param input The raw input payload (can omit slug if relying on auto-generation).
 * @returns The created builder.
 */
export async function createBuilder(input: Partial<CreateBuilderInput>, logoFile?: File): Promise<Builder> {
  try {
    // 1. Normalize input
    const normalized = normalizeInput(input as Record<string, unknown>);

    // 2. Auto-generate slug if not supplied
    if (normalized.name && typeof normalized.name === 'string' && !normalized.slug) {
      normalized.slug = generateSlug(normalized.name);
    }

    // 3. Validate against schema
    const validatedData = validate<CreateBuilderInput>(CreateBuilderSchema, normalized);

    // 4. Check duplicates
    await checkDuplicateName(validatedData.name);
    await checkDuplicateSlug(validatedData.slug);

    // 5. Call repository
    let builder = await repository.createBuilder(validatedData);

    // 6. Handle logo upload
    if (logoFile && logoFile.size > 0) {
      try {
        const uploadResult = await storageService.uploadFile({
          bucket: BUILDER_LOGO_BUCKET,
          folder: builder.id,
          file: logoFile,
          fileName: 'logo.webp',
          upsert: true
        });
        builder = await repository.updateBuilder(builder.id, { logoUrl: uploadResult.publicUrl });
      } catch (uploadError) {
        console.error("Logo upload failed after builder creation:", uploadError);
      }
    }

    return builder;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    
    // Bubble up expected domain errors
    if (msg.startsWith('Validation Error') || msg.startsWith('Conflict Error')) {
      throw error;
    }
    
    // Map unexpected database unique constraints
    if (msg.includes('builders_name_unique')) {
      throw new Error(`Conflict Error: A builder with this name already exists.`);
    }
    if (msg.includes('builders_slug_unique')) {
      throw new Error(`Conflict Error: A builder with this slug already exists.`);
    }

    // Wrap unhandled repository/database errors
    throw new Error(`Service Error: Failed to create builder. ${msg}`);
  }
}

/**
 * Updates an existing builder.
 * Handles validation, normalization, and auto-regenerating the slug if the name changes.
 * 
 * @param id The ID of the builder to update.
 * @param input The raw update payload.
 * @returns The updated builder.
 */
export async function updateBuilder(
  id: string, 
  input: UpdateBuilderInput,
  logoFile?: File,
  removeLogo?: boolean
): Promise<Builder> {
  try {
    // 1. Check if the builder exists
    const existing = await repository.getBuilderById(id);
    if (!existing) {
      throw new Error(`Not Found: Builder with ID ${id} does not exist.`);
    }

    // 2. Normalize input
    const normalized = normalizeInput(input as Record<string, unknown>);

    // 3. Regenerate slug if name changed and slug not explicitly provided
    if (
      normalized.name &&
      typeof normalized.name === 'string' &&
      normalized.name.toLowerCase() !== existing.name.toLowerCase() &&
      !normalized.slug
    ) {
      normalized.slug = generateSlug(normalized.name);
    }

    // 4. Validate against schema
    const validatedData = validate<UpdateBuilderInput>(UpdateBuilderSchema, normalized);

    // 5. Check duplicates if unique fields changed
    if (validatedData.name && validatedData.name.toLowerCase() !== existing.name.toLowerCase()) {
      await checkDuplicateName(validatedData.name, id);
    }
    if (validatedData.slug && validatedData.slug !== existing.slug) {
      await checkDuplicateSlug(validatedData.slug, id);
    }

    // 6. Handle Logo update/remove
    let updatedLogoUrl = validatedData.logoUrl !== undefined ? validatedData.logoUrl : existing.logoUrl;
    
    if (removeLogo) {
      if (existing.logoUrl) {
        try {
          await storageService.deleteFile(`${id}/logo.webp`, BUILDER_LOGO_BUCKET);
        } catch (e) {
          console.error("Failed to delete existing logo:", e);
        }
      }
      updatedLogoUrl = null as any; // Force null to wipe it in db
    } else if (logoFile && logoFile.size > 0) {
      const uploadResult = await storageService.uploadFile({
        bucket: BUILDER_LOGO_BUCKET,
        folder: id,
        file: logoFile,
        fileName: 'logo.webp',
        upsert: true
      });
      updatedLogoUrl = uploadResult.publicUrl;
    }

    if (updatedLogoUrl !== existing.logoUrl || removeLogo) {
      validatedData.logoUrl = updatedLogoUrl;
    }

    // 7. Call repository
    return await repository.updateBuilder(id, validatedData);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    
    // Bubble up expected domain errors
    if (msg.startsWith('Validation Error') || msg.startsWith('Conflict Error') || msg.startsWith('Not Found')) {
      throw error;
    }
    
    // Map unexpected database unique constraints
    if (msg.includes('builders_name_unique')) {
      throw new Error(`Conflict Error: A builder with this name already exists.`);
    }
    if (msg.includes('builders_slug_unique')) {
      throw new Error(`Conflict Error: A builder with this slug already exists.`);
    }

    // Wrap unhandled repository/database errors
    throw new Error(`Service Error: Failed to update builder. ${msg}`);
  }
}

/**
 * Retrieves a single builder by their unique ID.
 * 
 * @param id The UUID of the builder.
 * @returns The builder, or null if not found.
 */
export async function getBuilder(id: string): Promise<Builder | null> {
  try {
    return await repository.getBuilderById(id);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Service Error: Failed to fetch builder. ${msg}`);
  }
}

/**
 * Retrieves a single builder by their unique slug.
 * 
 * @param slug The URL-friendly slug.
 * @returns The builder, or null if not found.
 */
export async function getBuilderBySlug(slug: string): Promise<Builder | null> {
  try {
    return await repository.getBuilderBySlug(slug);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Service Error: Failed to fetch builder by slug. ${msg}`);
  }
}

/**
 * Lists builders based on provided filters and pagination parameters.
 * 
 * @param filters Filtering parameters (search, featured, active, page, limit).
 * @returns Paginated list of builders and total count.
 */
export async function listBuilders(filters: BuilderFilters) {
  try {
    return await repository.listBuilders(filters);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Service Error: Failed to list builders. ${msg}`);
  }
}

/**
 * Soft deletes a builder by ID (sets is_active to false).
 * 
 * @param id The UUID of the builder to deactivate.
 * @returns The deactivated builder.
 */
export async function deactivateBuilder(id: string): Promise<Builder> {
  try {
    const existing = await repository.getBuilderById(id);
    if (!existing) {
      throw new Error(`Not Found: Builder with ID ${id} does not exist.`);
    }
    return await repository.deactivateBuilder(id);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.startsWith('Not Found')) {
      throw error;
    }
    throw new Error(`Service Error: Failed to deactivate builder. ${msg}`);
  }
}

/**
 * Activates a builder by ID (sets is_active to true).
 * 
 * @param id The UUID of the builder to activate.
 * @returns The activated builder.
 */
export async function activateBuilder(id: string): Promise<Builder> {
  try {
    const existing = await repository.getBuilderById(id);
    if (!existing) {
      throw new Error(`Not Found: Builder with ID ${id} does not exist.`);
    }
    return await repository.activateBuilder(id);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.startsWith('Not Found')) {
      throw error;
    }
    throw new Error(`Service Error: Failed to activate builder. ${msg}`);
  }
}
