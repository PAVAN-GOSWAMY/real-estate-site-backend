import { z } from "zod";
import {
  addFavoriteSchema,
  favoriteQuerySchema,
  createShortlistSchema,
  updateShortlistSchema,
  shareShortlistSchema,
  shortlistQuerySchema,
  addShortlistItemSchema,
  updateShortlistItemSchema
} from "../validators/favorites.validator";
import { UserFavoriteEntity, PropertyShortlistEntity, PropertyShortlistItemEntity } from "@/types/favorites.types";

export type AddFavoriteDto = z.infer<typeof addFavoriteSchema>;
export type FavoriteQueryDto = z.infer<typeof favoriteQuerySchema>;

export type CreateShortlistDto = z.infer<typeof createShortlistSchema>;
export type UpdateShortlistDto = z.infer<typeof updateShortlistSchema>;
export type ShareShortlistDto = z.infer<typeof shareShortlistSchema>;
export type ShortlistQueryDto = z.infer<typeof shortlistQuerySchema>;

export type AddShortlistItemDto = z.infer<typeof addShortlistItemSchema>;
export type UpdateShortlistItemDto = z.infer<typeof updateShortlistItemSchema>;

export interface FavoriteResponseDto extends Omit<UserFavoriteEntity, 'created_at'> {
  property?: any;
}

export interface ShortlistResponseDto extends Omit<PropertyShortlistEntity, 'created_at' | 'updated_at'> {
  items?: any[];
}
