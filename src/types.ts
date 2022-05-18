export type GetPublishableKey = () => Promise<{
  publishableKey: string;
  expiresIn: number;
}>;

export enum ErrorCodes {
  ValidationError = "RupaValidationError",
  NotFoundError = "RupaNotFoundError",
  PermissionDeniedError = "RupaPermissionDeniedError",
  NotAuthenticatedError = "RupaNotAuthenticatedError",
  UnknownError = "RupaUnknownError",
  ClientError = "RupaClientError",
}

export interface UnknownError {
  code: ErrorCodes.UnknownError;
  message: string;
  nativeError?: Error;
}

export interface ValidationError {
  code: ErrorCodes.ValidationError;
  message: string;
  fields: {
    [field: string]: string[];
  };
}

export interface ClientError {
  code: ErrorCodes.ClientError;
  message: string;
}

export interface NotFoundError {
  code: ErrorCodes.NotFoundError;
  message: string;
}

export interface NotAuthenticatedError {
  code: ErrorCodes.NotAuthenticatedError;
  message: string;
}

export interface PermissionDeniedError {
  code: ErrorCodes.PermissionDeniedError;
  message: string;
}

export type APIError =
  | UnknownError
  | ValidationError
  | ClientError
  | NotFoundError
  | NotAuthenticatedError
  | PermissionDeniedError;

export type JSONSerializable =
  | string
  | number
  | boolean
  | null
  | JSONSerializable[]
  | { [key: string]: JSONSerializable };
