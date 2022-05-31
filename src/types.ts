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

interface BaseOrderIntentRequestData {
  return_url: string;
  metadata?: {
    [index: string]: JSONSerializable;
  };
}

interface OrderIntentRequestDataWithPatientData
  extends BaseOrderIntentRequestData {
  patient_data: {
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
}

interface OrderIntentRequestDataWithPatientId
  extends BaseOrderIntentRequestData {
  patient: string;
}

export type OrderIntentRequestData =
  | OrderIntentRequestDataWithPatientData
  | OrderIntentRequestDataWithPatientId;

export interface OrderIntent {
  id: string;
  /*
   * A URL to redirect the practitioner to where the Order will be created.
   */
  redirect_url: string;
}
