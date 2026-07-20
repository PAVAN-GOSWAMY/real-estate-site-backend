import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";
import { AuthHelper } from "@/lib/auth/auth.helper";
import { PermissionHelper } from "@/lib/auth/permission.helper";
import { Permissions } from "@/lib/constants/permissions";
import { PropertyBrochureService } from "@/modules/property-brochures/service/property-brochure.service";
import { createClient } from "@/lib/supabase/server";
import { 
  bulkUploadPropertyBrochuresSchema,
  bulkUpdatePropertyBrochuresSchema,
  bulkDeletePropertyBrochuresSchema
} from "@/modules/property-brochures/validators/property-brochure.validator";
import { PropertyBrochureMapper } from "@/modules/property-brochures/mapper/property-brochure.mapper";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_BROCHURES.UPLOAD);

    const body = await req.json();
    const dto = bulkUploadPropertyBrochuresSchema.parse({
      ...body,
      property_id: propertyId
    });

    const service = new PropertyBrochureService(supabase);
    const results = await service.bulkUpload(dto);

    const mappedData = PropertyBrochureMapper.toResponseList(results);
    return ApiResponse.success(mappedData, "Brochures bulk uploaded successfully", 201);
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_BROCHURES.UPDATE);

    const body = await req.json();
    const dto = bulkUpdatePropertyBrochuresSchema.parse({
      ...body,
      property_id: propertyId
    });

    const service = new PropertyBrochureService(supabase);
    const results = await service.bulkUpdate(dto);

    const mappedData = PropertyBrochureMapper.toResponseList(results);
    return ApiResponse.success(mappedData, "Brochures bulk updated successfully");
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const supabase = await createClient();
    
    const authHelper = new AuthHelper(supabase);
    const session = await authHelper.getSession();
    PermissionHelper.requirePermission(session, Permissions.PROPERTY_BROCHURES.DELETE);

    const body = await req.json();
    const dto = bulkDeletePropertyBrochuresSchema.parse({
      ...body,
      property_id: propertyId
    });

    const service = new PropertyBrochureService(supabase);
    await service.bulkDelete(dto);

    return ApiResponse.noContent();
  } catch (error: any) {
    return ApiResponse.error(error);
  }
}
