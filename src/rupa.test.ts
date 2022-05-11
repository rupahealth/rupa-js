import Rupa from "../src/rupa";

const getPublishableKey = async () => ({
  publishableKey: "fake",
  expiresIn: 36000,
});

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
    const { status, orderIntent, error } = await rupa.orderIntents.create({
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
    });

    if (status !== "success") {
      throw new Error("Assertion failed: expected status === success");
    }

    expect(orderIntent.id).toBe("ordin_123abc");
    expect(orderIntent.redirect_url).toBe("https://example.com");
  });

  test("handles refreshing an expired key", () => {});

  test("throws when OrderIntent API errors", () => {});

  test("throws when an unknown status code occurs", () => {});

  test("throws when a network error occurs", () => {});

  test("throws when can't refresh token", () => {});
});
