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

    if (retries > 1) {
      return {
        status: "error",
        error: {
          code: ErrorCodes.ClientError,
          message:
            "Authentication failed, please check getPublishableKey returns a valid publishable key.",
        },
      };
    }

    // Ensure we have an up-to-date key
    const publishableKey = await this.refreshPublishableKey();

    const response = await fetch(relativeUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publishableKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (Math.floor(response.status / 100) === 2) {
      const data: Data = await response.json();

      return { data, status: "success" };
    } else if (response.status === 401) {
      // If we get a 401, we retry the request after fetching a new key.
      this.refreshPublishableKey({ force: true });

      return this.request(relativeUrl, {
        ...options,
        retries: retries + 1,
      });
    }

    const error: ErrorResponse = await response.json();

    return { error, status: "error" };
  }

  private async refreshPublishableKey({
    force = false,
  }: { force?: boolean } = {}) {
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
