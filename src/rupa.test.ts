import Rupa from "./rupa";

const getPublishableKey = async (key = "valid") => ({
  // in setupJest.ts our fetch mock considers the key's value
  // to determine which response to give.
  publishableKey: key,
  expiresIn: 36000,
});

describe("Client instantiation", () => {
  test("instantiates with getPublishableKey", () => {
    // Just instantiate it to make sure it works
    new Rupa(getPublishableKey);
  });

  test("requires getPublishableKey", () => {
    // @ts-ignore
    expect(() => new Rupa()).toThrow();
  });
});
