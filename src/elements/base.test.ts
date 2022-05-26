import { ClientError } from "../errors";
import Rupa from "../rupa";
import { getPublishableKey } from "../test-utils";

test("it throws if unsupported", async () => {
  const rupa = new Rupa(getPublishableKey);

  // @ts-ignore
  expect(() => rupa.elements.create("nonExistent", {})).toThrow(ClientError);
});
