import { version } from "../package.json";
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

const API_BASE = "https://api.rupahealth.com";
const API_SANDBOX_BASE = "https://api-sandbox.rupahealth.com";

class APIClient {
  private publishableKey?: string;
  private expiresAt?: Date;
  private getPublishableKey: GetPublishableKey;
  private sandbox: boolean;

  constructor(getPublishableKey: GetPublishableKey, sandbox: boolean) {
    if (!getPublishableKey) {
      throw Error("Missing required arg: getPublishableKey");
    }

    this.getPublishableKey = getPublishableKey;
    this.sandbox = sandbox;
  }

  async request<Data extends object>(
    resource: string,
    options:
      | { method: "post"; payload: object; retries?: number }
      | { method: "get"; payload?: undefined; retries?: number } = {
      method: "get",
    }
  ): Promise<Response<Data>> {
    const { method, payload = {}, retries = 0 } = options;

    // If this is not the first try at this request, we force a key refresh.
    const forceRefresh = retries > 0;
    const publishableKey = await this.refreshPublishableKey({
      force: forceRefresh,
    });
    const headers = this.getHeaders(publishableKey);

    let response: globalThis.Response;

    try {
      response = await fetch(this.buildAbsoluteUrl(resource), {
        method,
        headers,
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

    const result = await this.buildResult<Data>(response);
    if (result.status === "error") {
      const isAuthError = [
        ErrorCodes.NotAuthenticatedError,
        ErrorCodes.PermissionDeniedError,
      ].includes(result.error.code);
      const shouldRetry = isAuthError && retries === 0;

      if (shouldRetry) {
        return this.request(resource, {
          ...options,
          retries: retries + 1,
        });
      }
    }

    return result;
  }

  private getHeaders(publishableKey: string) {
    const rupaUserAgent = `RupaJS/${version}`;

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${publishableKey}`,
      "X-Rupa-User-Agent": rupaUserAgent,
    };
  }

  private async buildResult<Data>(
    response: globalThis.Response
  ): Promise<Response<Data>> {
    if ([200, 201].includes(response.status)) {
      const data: Data = await response.json();
      return { data, status: "success" };
    }

    let error: ErrorResponse | null;

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

  private buildAbsoluteUrl(resource: string) {
    const base = this.sandbox ? API_SANDBOX_BASE : API_BASE;

    return `${base}/${resource}/`;
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
