import Rupa from "./rupa";
import { getPublishableKey } from "./test-utils";
import { ErrorCodes } from "./types";

import { version } from "../package.json";

const successfulPayload = {
  return_url: "https://example.com",
  patient: {
    first_name: "Ada",
    last_name: "Lovelace",
    email: "ada@rupahealth.com",
  },
  metadata: { test: "data" },
};

describe("Successful requests", () => {
  test("Calls the production resource", async () => {
    const rupa = new Rupa(getPublishableKey);
    const { status, orderIntent } = await rupa.orderIntents.create(
      successfulPayload
    );

    // TS doesn't type guard on expect()
    if (status !== "success") {
      throw new Error("Assertion failed: expected status === success");
    }

    // @ts-ignore
    expect(window.fetch.mock.calls[0][0]).toEqual(
      "https://api.rupahealth.com/order-intents/"
    );

    // Check we send version and agent headers
    // @ts-ignore
    expect(window.fetch.mock.calls[0][1].headers["X-Rupa-User-Agent"]).toEqual(
      `RupaJS/${version}`
    );

    expect(orderIntent).toEqual({
      id: "ordin_123abc",
      redirect_url: "https://example.com",
    });
  });

  test("Calls the sandbox resource", async () => {
    const rupa = new Rupa(getPublishableKey, { sandbox: true });
    const { status, orderIntent } = await rupa.orderIntents.create(
      successfulPayload
    );

    // TS doesn't type guard on expect()
    if (status !== "success") {
      throw new Error("Assertion failed: expected status === success");
    }

    // @ts-ignore
    expect(window.fetch.mock.calls[0][0]).toEqual(
      "https://api-sandbox.rupahealth.com/order-intents/"
    );

    expect(orderIntent).toEqual({
      id: "ordin_123abc",
      redirect_url: "https://example.com",
    });
  });

  test("Handles refreshing an expired key", async () => {
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

    expect(count).toBe(2);
  });
});

describe("Error handling", () => {
  test("Returns an error when a resource endpoint errors", async () => {
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

  test("Returns an error when an unknown status code occurs", async () => {
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

  test("Returns an error when a network error occurs", async () => {
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

  test("Returns an error when refresh token repeatedly fails due to expiration", async () => {
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

  test("Returns an error when refresh token repeatedly fails due to being invalid", async () => {
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
