export type GetPublishableKey = () => Promise<string>;

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

export interface OrderIntentRequestData {
  return_url: string;
  patient: {
    first_name: string;
    last_name: string;
    email: string;

    // These fields aren't required (that patient can fill out when paying)
    phone_number?: string; // An E164 number.
    birthday?: string; // YYYY-MM-DD,
    gender?: string;
    shipping_address?: {
      street: string;
      city: string;
      state: string;
      zipcode: string;
    };
  };
  metadata?: {
    [index: string]: JSONSerializable;
  };
}

export interface OrderIntent {
  id: string;
  /*
   * A URL to redirect the practitioner to where the Order will be created.
   */
  redirect_url: string;
}
