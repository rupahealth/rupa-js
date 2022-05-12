import { ErrorCodes, ErrorResponse, GetPublishableKey } from "./types";

interface ResponseSuccess<Data> {
  status: "success";
  data: Data;
}

interface ResponseError {
  status: "error";
  error: ErrorResponse;
}

type Response<Data> = ResponseSuccess<Data> | ResponseError;

class APIClient {
  private publishableKey?: string;
  private expiresAt?: Date;
  private getPublishableKey: GetPublishableKey;

  constructor(getPublishableKey: GetPublishableKey) {
    if (!getPublishableKey) {
      throw Error("Missing required arg: getPublishableKey");
    }

    this.getPublishableKey = getPublishableKey;
  }

  async request<Data extends object>(
    relativeUrl: string,
    options:
      | { method: "post"; payload: object; retries?: number }
      | { method: "get"; payload?: undefined; retries?: number } = {
      method: "get",
    }
  ): Promise<Response<Data>> {
    const { method, payload = {}, retries = 0 } = options;

    // If this is not the first try at this request, we force a refresh
    // of the key.
    const forceRefresh = retries > 0;
    const publishableKey = await this.refreshPublishableKey({
      force: forceRefresh,
    });

    let response: globalThis.Response;

    try {
      response = await fetch(relativeUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publishableKey}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      return {
        status: "error",
        error: {
          code: ErrorCodes.UnknownError,
          message: "An unknown error occurred.",
          nativeError: error,
        },
      };
    }

    if ([200, 201].includes(response.status)) {
      const data: Data = await response.json();
      return { data, status: "success" };
    } else if ([401, 403].includes(response.status)) {
      // Give up if it fails more than once
      if (retries > 0) {
        const error = await response.json();

        return {
          status: "error",
          error,
        };
      }

      // Otherwise we try again
      return this.request(relativeUrl, {
        ...options,
        retries: retries + 1,
      });
    }

    let error: ErrorResponse;

    try {
      error = await response.json();
      return { error, status: "error" };
    } catch (e) {
      error = null;
    }

    if (!error) {
      // If there's no JSON response, then something went wrong with our API (e.g we're down), in which case the best we can do is return a generic error.
      return {
        status: "error",
        error: {
          code: ErrorCodes.UnknownError,
          message: "An unknown error occurred.",
        },
      };
    }

    return { error, status: "error" };
  }

  private async refreshPublishableKey({
    force = false,
  }: { force?: boolean } = {}) {
    // Use an existing key if we don't believe it's expired
    if (
      !force &&
      this.publishableKey &&
      this.expiresAt &&
      this.expiresAt > new Date()
    ) {
      return this.publishableKey;
    }

    const { expiresIn, publishableKey } = await this.getPublishableKey();

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

    this.publishableKey = publishableKey;
    this.expiresAt = expiresAt;

    return publishableKey;
  }
}

export default APIClient;
