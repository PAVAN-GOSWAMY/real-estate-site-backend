import { z } from "zod";
import {
  timelineFilterSchema,
  timelineSearchSchema
} from "../validators/timeline.validator";
import { LeadTimelineEntity } from "@/types/timeline.types";

export type LeadTimelineFilterDto = z.infer<typeof timelineFilterSchema>;
export type LeadTimelineSearchDto = z.infer<typeof timelineSearchSchema>;

export interface LeadTimelineResponseDto extends LeadTimelineEntity {
  actor?: any;
}

export interface LatestTimelineDto {
  events: LeadTimelineResponseDto[];
}

export interface LeadTimelineStatisticsDto {
  total_events: number;
  events_by_category: Record<string, number>;
}
