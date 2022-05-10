import OrderIntents from "./resources/order-intent";
import { ErrorCodes, ErrorResponse, GetPublishableKey } from "./types";

class Rupa {
  private publishableKey?: string;
  private expiresAt?: Date;
  private getPublishableKey: GetPublishableKey;

  orderIntents: OrderIntents;

  constructor(getPublishableKey: GetPublishableKey) {
    this.getPublishableKey = getPublishableKey;

    // Resources
    this.orderIntents = new OrderIntents(this.request);
  }

  private async request<Response extends object = object>(
    relativeUrl: string,
    options:
      | { method: "post"; payload: object; retries?: number }
      | { method: "get"; payload?: undefined; retries?: number } = {
      method: "get",
    }
  ): Promise<
    | {
        data: Response;
      }
    | {
        error: ErrorResponse;
      }
  > {
    const { method, payload = {}, retries = 0 } = options;

    if (retries > 1) {
      return {
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

    if (response.status / 100 === 2) {
      const data: Response = await response.json();

      return { data };
    } else if (response.status === 401) {
      // If we get a 401, we retry the request after fetching a new key.
      this.refreshPublishableKey({ force: true });

      return this.request(relativeUrl, {
        ...options,
        retries: retries + 1,
      });
    }

    const error: ErrorResponse = await response.json();

    return { error };
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

export default Rupa;
