import { z } from "zod";
import { paginationSchema } from "@/lib/validators/common.validator";

export const recommendationCategorySchema = z.enum([
  'FEATURED', 'TRENDING', 'RECOMMENDED', 'EDITORS_CHOICE', 
  'LUXURY_COLLECTION', 'INVESTMENT_OPPORTUNITY', 'NEW_LAUNCH', 
  'READY_TO_MOVE', 'HOT_DEAL', 'PREMIUM_LISTING', 'VERIFIED_PICK', 'STAFF_PICK'
]);

export const featurePropertySchema = z.object({
  recommendation_score: z.number().min(0).max(100).optional().default(50),
}).strict();

export const recommendPropertySchema = z.object({
  category: recommendationCategorySchema,
  collection_name: z.string().max(150).optional().nullable(),
  recommendation_score: z.number().min(0).max(100).optional().default(50),
}).strict();

export const unrecommendPropertySchema = z.object({
  category: recommendationCategorySchema,
  collection_name: z.string().max(150).optional().nullable(),
}).strict();

export const updateScoreSchema = z.object({
  category: recommendationCategorySchema,
  collection_name: z.string().max(150).optional().nullable(),
  recommendation_score: z.number().min(0).max(100),
}).strict();

// Bulk Schemas
export const bulkFeatureSchema = z.object({
  property_ids: z.array(z.string().uuid()).min(1).max(100),
  recommendation_score: z.number().min(0).max(100).optional().default(50),
}).strict();

export const bulkRecommendSchema = z.object({
  property_ids: z.array(z.string().uuid()).min(1).max(100),
  category: recommendationCategorySchema,
  collection_name: z.string().max(150).optional().nullable(),
  recommendation_score: z.number().min(0).max(100).optional().default(50),
}).strict();

// Query Filters
export const recommendationQuerySchema = paginationSchema.extend({
  collection_name: z.string().optional(),
}).strict();

export const dashboardQuerySchema = paginationSchema.extend({
  category: recommendationCategorySchema.optional(),
  is_active: z.coerce.boolean().optional(),
}).strict();
