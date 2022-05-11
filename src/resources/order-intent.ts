import { JSONSerializable } from "../types";
import { Resource } from "./base";


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
    metadata: {
      [index: string]: JSONSerializable
    }
}

export interface OrderIntentResponseData {
  id: string;
  /*
   * A URL to redirect the practitioner to where the Order will be created.
   */
  redirect_url: string;
}

export default class OrderIntents extends Resource {
  async create(payload: OrderIntentRequestData) {
    const response = await this.apiClient.request<OrderIntentResponseData>("/order-intents/", {
      method: "post",
      payload,
    });

    if (response.status === "success") {
      return {
        orderIntent: response.data,
        status: response.status,
      }
    }

    return {
      orderIntent: undefined,
      error: response.error,
      status: response.status,
    }
  }
}
