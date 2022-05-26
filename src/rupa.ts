import APIClient from "./api-client";
import Elements from "./elements/elements";
import OrderIntents from "./resources/order-intent";
import { GetPublishableKey } from "./types";

class Rupa {
  private apiClient: APIClient;

  orderIntents: OrderIntents;

  elements: Elements;

  constructor(
    getPublishableKey: GetPublishableKey,
    {
      sandbox = false,
    }: {
      sandbox?: boolean;
    } = {}
  ) {
    if (!getPublishableKey) {
      throw Error("Missing required arg: getPublishableKey");
    }

    this.apiClient = new APIClient(getPublishableKey, sandbox);

    // Resources
    this.orderIntents = new OrderIntents(this.apiClient);

    // Elements
    this.elements = new Elements();
  }
}

export default Rupa;
