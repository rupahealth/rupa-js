import APIClient from "./api-client";
import OrderIntents from "./resources/order-intent";
import { GetPublishableKey } from "./types";

class Rupa {
  private apiClient: APIClient

  orderIntents: OrderIntents;

  constructor(getPublishableKey: GetPublishableKey) {
    if (!getPublishableKey) {
      throw Error("Missing required arg: getPublishableKey");
    }

    this.apiClient = new APIClient(getPublishableKey)

    // Resources
    this.orderIntents = new OrderIntents(this.apiClient);
  }
}

export default Rupa;
