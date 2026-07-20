// Stub for specialized pipeline retrieval
import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/responses/api-response";

export async function GET(req: NextRequest) {
    return ApiResponse.success({ message: "Pipeline details endpoint (Stub)" });
}
