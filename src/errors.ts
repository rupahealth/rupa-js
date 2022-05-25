import { ErrorCodes } from "./types";

class ClientError extends Error {
  code: ErrorCodes.ClientError;
  message: string;

  constructor(message: string) {
    super();

    this.code = ErrorCodes.ClientError;
    this.message = message;
  }
}

export { ClientError };
