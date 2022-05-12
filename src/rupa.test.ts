import Rupa from "../src/rupa";
import { ErrorCodes } from "./types";

const getPublishableKey = async (key = "valid") => ({
  // in setupJest.ts our fetch mock considers the key's value
  // to determine which response to give.
  publishableKey: key,
  expiresIn: 36000,
});

const successfulPayload = {
  return_url: "https://example.com",
  patient: {
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

describe("Client instantiation", () => {
  test("instantiates with getPublishableKey", () => {
    // Just instantiate it to make sure it works
    new Rupa(getPublishableKey);
  });

  test("requires getPublishableKey", () => {
    /* eslint-disable */
    // @ts-ignore
    expect(() => new Rupa()).toThrow();
  });
});

describe("Create an order link", () => {
  test("Creates with a valid key", async () => {
    const rupa = new Rupa(getPublishableKey);
    const { status, orderIntent } = await rupa.orderIntents.create(
      successfulPayload
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

  test("handles refreshing an expired key", async () => {
    let count = 0;

    const rupa = new Rupa(async () => {
      count += 1;
      return await getPublishableKey(count === 2 ? "valid" : "expired");
    });
    const { status, orderIntent } = await rupa.orderIntents.create(
      successfulPayload
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

  test("throws when OrderIntent API errors", async () => {
    const rupa = new Rupa(getPublishableKey);

    // Send an invalid payload
    // @ts-ignore
    const { status, error } = await rupa.orderIntents.create({});

    // TS doesn't type guard on expect()
    if (status !== "error") {
      throw new Error("Assertion failed: expected status === success");
    }

    expect(error).toEqual({
      code: ErrorCodes.ValidationError,
      message:
        "Invalid request, please check the `fields` for more information.",
      fields: {
        patient: {
          email: ["Enter a valid email address."],
        },
      },
    });
  });

  test("throws when an unknown status code occurs", async () => {
    // @ts-ignore
    window.fetch.mockImplementation(() => {
      return {
        ok: false,
        status: 500,
      };
    });

    const rupa = new Rupa(getPublishableKey);
    const { status, error } = await rupa.orderIntents.create(successfulPayload);

    // TS doesn't type guard on expect()
    if (status !== "error") {
      throw new Error("Assertion failed: expected status === success");
    }

    expect(error).toEqual({
      code: ErrorCodes.UnknownError,
      message: "An unknown error occurred.",
    });
  });

  test("throws when a network error occurs", async () => {
    // @ts-ignore
    window.fetch.mockImplementation(() => {
      // Fetch only throws if something like a network error occurs. This simulates that.
      throw Error("TypeError");
    });

    const rupa = new Rupa(getPublishableKey);
    const { status, error } = await rupa.orderIntents.create(successfulPayload);

    // TS doesn't type guard on expect()
    if (status !== "error") {
      throw new Error("Assertion failed: expected status === success");
    }

    expect(error).toEqual({
      code: ErrorCodes.UnknownError,
      message: "An unknown error occurred.",
      nativeError: Error("TypeError"),
    });
  });

  test("throws when refresh token repeatedly fails due to expiration", async () => {
    let count = 0;
    const rupa = new Rupa(async () => {
      count += 1;
      // Always fail
      return await getPublishableKey("expired");
    });

    const { status, error } = await rupa.orderIntents.create(successfulPayload);

    // TS doesn't type guard on expect()
    if (status !== "error") {
      throw new Error("Assertion failed: expected status === error");
    }

    expect(count).toBe(2);

    expect(error).toEqual({
      code: ErrorCodes.PermissionDeniedError,
      message: "Permission denied.",
    });
  });

  test("throws when refresh token repeatedly fails due to being invalid", async () => {
    let count = 0;
    const rupa = new Rupa(async () => {
      count += 1;
      // Always fail
      return await getPublishableKey("unauthorized");
    });

    const { status, error } = await rupa.orderIntents.create(successfulPayload);

    // TS doesn't type guard on expect()
    if (status !== "error") {
      throw new Error("Assertion failed: expected status === error");
    }

    expect(count).toBe(2);

    expect(error).toEqual({
      code: ErrorCodes.NotAuthenticatedError,
      message: "Not authenticated.",
    });
  });
});
