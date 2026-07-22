import * as repository from '../repository/properties.repository';
import * as buildersRepository from '@/modules/builders/repository/builders.repository';
import { CreatePropertySchema, UpdatePropertySchema } from '../validation/property.schema';
import { Property, CreatePropertyInput, UpdatePropertyInput, PropertyFilters } from '../types/property';
import { PropertyStatus } from '../types/enums';
import { z } from 'zod';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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

function validate<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const messages = result.error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new Error(`Validation Error: ${messages}`);
  }
  return result.data;
}

async function checkDuplicateSlug(slug: string, excludeId?: string): Promise<void> {
  const existing = await repository.getPropertyBySlug(slug);
  if (existing && existing.id !== excludeId) {
    throw new Error(`Conflict Error: A property with the slug "${slug}" already exists.`);
  }
}

async function checkBuilderExists(builderId: string): Promise<void> {
  const builder = await buildersRepository.getBuilderById(builderId);
  if (!builder) {
    throw new Error(`Validation Error: Builder with ID "${builderId}" does not exist.`);
  }
}

export async function createProperty(input: Partial<CreatePropertyInput>): Promise<Property> {
  try {
    const normalized = normalizeInput(input as Record<string, unknown>);

    if (normalized.title && typeof normalized.title === 'string' && !normalized.slug) {
      normalized.slug = generateSlug(normalized.title);
    }

    const validatedData = validate<CreatePropertyInput>(CreatePropertySchema, normalized);

    await checkBuilderExists(validatedData.builderId);
    await checkDuplicateSlug(validatedData.slug!);

    return await repository.createProperty(validatedData);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    
    if (msg.startsWith('Validation Error') || msg.startsWith('Conflict Error')) {
      throw error;
    }
    
    if (msg.includes('properties_slug_unique')) {
      throw new Error(`Conflict Error: A property with this slug already exists.`);
    }
    if (msg.includes('properties_code_unique')) {
      throw new Error(`Conflict Error: A property with this code already exists.`);
    }

    throw new Error(`Service Error: Failed to create property. ${msg}`);
  }
}

export async function updateProperty(id: string, input: UpdatePropertyInput): Promise<Property> {
  try {
    const existing = await repository.getPropertyById(id);
    if (!existing) {
      throw new Error(`Not Found: Property with ID ${id} does not exist.`);
    }

    const normalized = normalizeInput(input as Record<string, unknown>);

    if (
      normalized.title &&
      typeof normalized.title === 'string' &&
      normalized.title.toLowerCase() !== existing.title.toLowerCase() &&
      !normalized.slug
    ) {
      normalized.slug = generateSlug(normalized.title);
    }

    const validatedData = validate<UpdatePropertyInput>(UpdatePropertySchema, normalized);

    if (validatedData.builderId && validatedData.builderId !== existing.builderId) {
      await checkBuilderExists(validatedData.builderId);
    }

    if (validatedData.slug && validatedData.slug !== existing.slug) {
      await checkDuplicateSlug(validatedData.slug, id);
    }

    return await repository.updateProperty(id, validatedData);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    
    if (msg.startsWith('Validation Error') || msg.startsWith('Conflict Error') || msg.startsWith('Not Found')) {
      throw error;
    }
    
    if (msg.includes('properties_slug_unique')) {
      throw new Error(`Conflict Error: A property with this slug already exists.`);
    }
    if (msg.includes('properties_code_unique')) {
      throw new Error(`Conflict Error: A property with this code already exists.`);
    }

    throw new Error(`Service Error: Failed to update property. ${msg}`);
  }
}

export async function getProperty(id: string): Promise<Property | null> {
  try {
    return await repository.getPropertyById(id);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Service Error: Failed to fetch property. ${msg}`);
  }
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    return await repository.getPropertyBySlug(slug);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Service Error: Failed to fetch property by slug. ${msg}`);
  }
}

export async function listProperties(filters: PropertyFilters) {
  try {
    return await repository.listProperties(filters);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Service Error: Failed to list properties. ${msg}`);
  }
}

export async function togglePropertyStatus(id: string, status: PropertyStatus): Promise<Property> {
  try {
    const existing = await repository.getPropertyById(id);
    if (!existing) {
      throw new Error(`Not Found: Property with ID ${id} does not exist.`);
    }
    return await repository.togglePropertyStatus(id, status);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.startsWith('Not Found')) {
      throw error;
    }
    throw new Error(`Service Error: Failed to toggle property status. ${msg}`);
  }
}

export async function deleteProperty(id: string): Promise<void> {
  try {
    const existing = await repository.getPropertyById(id);
    if (!existing) {
      throw new Error(`Not Found: Property with ID ${id} does not exist.`);
    }
    await repository.deleteProperty(id);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.startsWith('Not Found')) {
      throw error;
    }
    throw new Error(`Service Error: Failed to delete property. ${msg}`);
  }
}

export async function generateNextPropertyCode(): Promise<string> {
  try {
    return await repository.getNextPropertyCode();
  } catch (error: unknown) {
    // Fallback if database lookup fails
    return `PROP-${Date.now().toString().slice(-6)}`;
  }
}
