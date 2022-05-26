import Rupa from "../rupa";
import { getPublishableKey, minimalOrderIntentPayload } from "../test-utils";

const fullPayload = {
  return_url: "https://example.com",
  patient_data: {
    first_name: "Ada",
    last_name: "Lovelace",
    email: "ada@rupahealth.com",
    phone_number: "+112025550101",
    birthday: "1990-12-20",
    gender: "F",
    shipping_address: {
      street: "100 Test Street",
      city: "San Francisco",
      state: "CA",
      zipcode: "94100",
    },
  },
  metadata: { test: "data" },
};

describe("OrderIntent resource", () => {
  test("Creates with full payload", async () => {
    const rupa = new Rupa(getPublishableKey);
    const { status, orderIntent } = await rupa.orderIntents.create(fullPayload);

    // TS doesn't type guard on expect()
    if (status !== "success") {
      throw new Error("Assertion failed: expected status === success");
    }

    expect(orderIntent).toEqual({
      id: "ordin_123abc",
      redirect_url: "https://example.com",
    });
  });

  test("Creates with minimal payload", async () => {
    const rupa = new Rupa(getPublishableKey);

    // We're really just checking the types here as the mocking doesn't
    // differentiate between the full and minimal payload.
    const { status, orderIntent } = await rupa.orderIntents.create(
      minimalOrderIntentPayload
    );

    // TS doesn't type guard on expect()
    if (status !== "success") {
      throw new Error("Assertion failed: expected status === success");
    }

    expect(orderIntent).toEqual({
      id: "ordin_123abc",
      redirect_url: "https://example.com",
    });
  });

  test("Creates with existing patient", async () => {
    const rupa = new Rupa(getPublishableKey);

    // We're really just checking the types here as the mocking doesn't
    // differentiate between the full and minimal payload.
    const { status, orderIntent } = await rupa.orderIntents.create({
      patient: "pat_123abc",
      return_url: "https://example.com",
    });

    // TS doesn't type guard on expect()
    if (status !== "success") {
      throw new Error("Assertion failed: expected status === success");
    }

    expect(orderIntent).toEqual({
      id: "ordin_123abc",
      redirect_url: "https://example.com",
    });
  });
});
