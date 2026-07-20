import { NextResponse } from "next/server";
import { HttpStatus } from "../constants/http-status";
import { BaseApplicationError } from "../errors/base.error";
import { z } from "zod";

export interface PaginationMeta {
  current_page: number;
  page_size: number;
  total_records: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface ResponseMeta {
  request_id?: string;
  timestamp: string;
  api_version: string;
  pagination?: PaginationMeta;
}

export interface SuccessPayload<T> {
  success: true;
  message?: string;
  data: T;
  meta: ResponseMeta;
}

export interface ErrorPayload {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  meta: ResponseMeta;
}

export class ApiResponse {
  private static createMeta(pagination?: PaginationMeta): ResponseMeta {
    return {
      timestamp: new Date().toISOString(),
      api_version: "v1",
      // request_id would typically be extracted from request context/headers
      ...(pagination && { pagination })
    };
  }

  static success<T>(data: T, message?: string, status: number = HttpStatus.OK) {
    const payload: SuccessPayload<T> = {
      success: true,
      ...(message && { message }),
      data,
      meta: this.createMeta()
    };
    return NextResponse.json(payload, { status });
  }

  static paginated<T>(data: T, pagination: PaginationMeta, message?: string) {
    const payload: SuccessPayload<T> = {
      success: true,
      ...(message && { message }),
      data,
      meta: this.createMeta(pagination)
    };
    return NextResponse.json(payload, { status: HttpStatus.OK });
  }

  static noContent() {
    return new NextResponse(null, { status: HttpStatus.NO_CONTENT });
  }

  static error(error: Error | BaseApplicationError, req?: Request) {
    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = "INTERNAL_SERVER_ERROR";
    let message = "An unexpected error occurred";
    let details: any = undefined;

    if (error instanceof BaseApplicationError) {
      statusCode = error.statusCode;
      errorCode = error.errorCode;
      message = error.message;
      details = error.details;
    } else if (error instanceof z.ZodError) {
      statusCode = HttpStatus.BAD_REQUEST;
      errorCode = "VALIDATION_ERROR";
      message = "Validation failed";
      details = error.format();
    } else {
      // Log unhandled errors here
      console.error("[Unhandled Error]:", error);
    }

    const payload: ErrorPayload = {
      success: false,
      error: {
        code: errorCode,
        message,
        ...(details && { details })
      },
      meta: this.createMeta()
    };

    return NextResponse.json(payload, { status: statusCode });
  }
}
