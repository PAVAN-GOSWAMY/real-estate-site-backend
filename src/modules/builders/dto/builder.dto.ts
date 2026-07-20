import { z } from "zod";
import { 
  createBuilderSchema, 
  updateBuilderSchema, 
  builderFilterSchema 
} from "../validators/builder.validator";
import { BuilderEntity } from "@/types/builder.types";

export type CreateBuilderDto = z.infer<typeof createBuilderSchema>;
export type UpdateBuilderDto = z.infer<typeof updateBuilderSchema>;
export type BuilderFilterDto = z.infer<typeof builderFilterSchema>;

export interface BuilderResponseDto extends Omit<BuilderEntity, 'deleted_at' | 'created_by' | 'updated_by'> {
  // Can be extended if we join relations like Builder Media in the future
}
