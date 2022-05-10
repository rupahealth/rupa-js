export type GetPublishableKey = () => Promise<{
  publishableKey: string;
  expiresIn: number;
}>;

export interface OrderIntent {
  id: string;
  redirectUrl: string;
}

export enum ErrorCodes {
  ValidationError = "RupaValidationError",
  ClientError = "RupaClientError",
  UnknownError = "RupaUnknownError",
}

export interface UnknownError {
  code: ErrorCodes.UnknownError;
  message: string;
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

export type ErrorResponse = UnknownError | ValidationError | ClientError;
