import { ClientError } from "../errors";
import OrderButton from "./order-button";

class Elements {
  // Method overloads.
  create(
    type: "orderButton",
    options: ConstructorParameters<typeof OrderButton>[0]
  ): OrderButton;

  // Implementation
  create(type, options) {
    if (type === "orderButton") {
      return new OrderButton(options);
    }

    throw new ClientError(`Invalid element type: ${type}`);
  }
}

export default Elements;
