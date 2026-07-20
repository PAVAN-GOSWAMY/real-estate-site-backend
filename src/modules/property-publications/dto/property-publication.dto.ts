import { z } from "zod";
import {
  changePublicationStatusSchema,
  schedulePublicationSchema,
  bulkChangePublicationStatusSchema,
  publicationHistoryFilterSchema,
  publicationStatusQuerySchema
} from "../validators/property-publication.validator";
import { PropertyPublicationEntity, PublicationStatus } from "@/types/property-publication.types";

export type ChangePublicationStatusDto = z.infer<typeof changePublicationStatusSchema>;
export type SchedulePublicationDto = z.infer<typeof schedulePublicationSchema>;
export type BulkChangePublicationStatusDto = z.infer<typeof bulkChangePublicationStatusSchema>;
export type PublicationHistoryFilterDto = z.infer<typeof publicationHistoryFilterSchema>;
export type PublicationStatusQueryDto = z.infer<typeof publicationStatusQuerySchema>;

export interface PropertyPublicationResponseDto extends Omit<PropertyPublicationEntity, 'deleted_at' | 'created_by'> {}

export interface PropertyPublicationHistoryDto {
  history: PropertyPublicationResponseDto[];
  current_status: PublicationStatus;
}
