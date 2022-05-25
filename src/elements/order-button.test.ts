import Rupa from "../rupa";
import { getPublishableKey, minimalOrderIntentPayload } from "../test-utils";

test("it mounts the button", async () => {
  const rupa = new Rupa(getPublishableKey);
  const { status, orderIntent } = await rupa.orderIntents.create(
    minimalOrderIntentPayload
  );

  // TS doesn't type guard on expect()
  if (status !== "success") {
    throw new Error("Assertion failed: expected status === success");
  }

  // Setup the dom
  document.body.innerHTML = `
    <div id="shadow" />
  `;

  const orderWithRupa = rupa.elements.create("orderButton", {
    orderIntent,
  });
  orderWithRupa.mount("#shadow");

  const shadow = document.querySelector("#shadow");
  const anchor = shadow.shadowRoot.children[1];
  expect(anchor.tagName).toBe("A");
  expect(anchor).toHaveTextContent("Order with Rupa");
  expect(anchor).toHaveAttribute("href", "https://example.com");

  // Check default style
  const style = shadow.shadowRoot.children[0];
  expect(style).toHaveTextContent("background: #0075cd");
  expect(style).toHaveTextContent("color: #fff");
});

test("it supports configuration", async () => {
  const rupa = new Rupa(getPublishableKey);
  const { status, orderIntent } = await rupa.orderIntents.create(
    minimalOrderIntentPayload
  );

  // TS doesn't type guard on expect()
  if (status !== "success") {
    throw new Error("Assertion failed: expected status === success");
  }

  // Setup the dom
  document.body.innerHTML = `
    <div id="shadow" />
  `;

  const orderWithRupa = rupa.elements.create("orderButton", {
    orderIntent,
    background: "red",
    color: "blue",
    text: "Halt and Catch Fire",
  });
  orderWithRupa.mount("#shadow");

  const shadow = document.querySelector("#shadow");
  const anchor = shadow.shadowRoot.children[1];
  expect(anchor).toHaveTextContent("Halt and Catch Fire");

  const style = shadow.shadowRoot.children[0];
  expect(style).toHaveTextContent("background: red");
  expect(style).toHaveTextContent("color: blue");
});
