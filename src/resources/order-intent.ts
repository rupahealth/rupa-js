import { OrderIntent, OrderIntentRequestData } from "../types";
import { Resource } from "./base";

export default class OrderIntents extends Resource {
  async create(payload: OrderIntentRequestData) {
    const response = await this.apiClient.request<OrderIntent>(
      "order-intents",
      {
        method: "post",
        payload,
      }
    );

    if (response.status === "success") {
      return {
        orderIntent: response.data,
        status: response.status,
      };
    }

    return {
      orderIntent: undefined,
      error: response.error,
      status: response.status,
    };
  }
}
