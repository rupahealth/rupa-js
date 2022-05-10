import { OrderIntent } from "../types";
import { Resource } from "./base";

export default class OrderIntents extends Resource {
  async create(payload: {
    returnUrl: string;
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
  }) {
    const data = this.request<OrderIntent>("/order-intents", {
      method: "post",
      payload,
    });
    return data;
  }
}
