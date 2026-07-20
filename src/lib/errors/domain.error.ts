import { BaseApplicationError } from "./base.error";
import { HttpStatus } from "../constants/http-status";

export class ValidationError extends BaseApplicationError {
  constructor(message: string, details?: any) {
    super(message, HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", details);
  }
}

export class AuthenticationError extends BaseApplicationError {
  constructor(message: string = "Authentication required") {
    super(message, HttpStatus.UNAUTHORIZED, "UNAUTHORIZED");
  }
}

export class AuthorizationError extends BaseApplicationError {
  constructor(message: string = "You do not have permission to perform this action") {
    super(message, HttpStatus.FORBIDDEN, "FORBIDDEN");
  }
}

export class NotFoundError extends BaseApplicationError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, HttpStatus.NOT_FOUND, "NOT_FOUND");
  }
}

export class ConflictError extends BaseApplicationError {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT, "CONFLICT");
  }
}

export class BusinessRuleError extends BaseApplicationError {
  constructor(message: string, errorCode: string = "BUSINESS_RULE_ERROR") {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY, errorCode);
  }
}

export class StorageError extends BaseApplicationError {
  constructor(message: string) {
    super(message, HttpStatus.BAD_GATEWAY, "STORAGE_ERROR");
  }
}

export class InternalError extends BaseApplicationError {
  constructor(message: string = "An unexpected error occurred") {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", undefined, false);
  }
}
