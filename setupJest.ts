import "whatwg-fetch";

import { ErrorCodes } from "./src/types";

type FetchParams = Parameters<typeof window.fetch>;

async function mockFetch(url: FetchParams[0], config: FetchParams[1]) {
  switch (url) {
    case "/order-intents/": {
      // @ts-ignore
      const authorization = config.headers.Authorization || "";
      if (authorization === "Bearer unauthorized") {
        return {
          ok: false,
          status: 401,
          json: async () => ({
            code: ErrorCodes.NotAuthenticatedError,
            message: "Not authenticated.",
          }),
        };
      } else if (authorization === "Bearer expired") {
        return {
          ok: false,
          status: 403,
          json: async () => ({
            code: ErrorCodes.PermissionDeniedError,
            message: "Permission denied.",
          }),
        };
      }

      // Only check patient email exists. That's enough to check the library handles errors properly.
      // Cast to a String to make TS happy
      const payload = JSON.parse(String(config.body));
      if (!payload.patient) {
        return {
          ok: false,
          status: 403,
          json: async () => ({
            code: ErrorCodes.ValidationError,
            message:
              "Invalid request, please check the `fields` for more information.",
            fields: {
              patient: {
                email: ["Enter a valid email address."],
              },
            },
          }),
        };
      }

      return {
        ok: true,
        status: 201,
        json: async () => ({
          id: "ordin_123abc",
          redirect_url: "https://example.com",
        }),
      };
    }

    default: {
      throw new Error(`Unhandled request: ${url}`);
    }
  }
}

beforeAll(() => jest.spyOn(window, "fetch"));
beforeEach(() => {
  /* eslint-disable */
  // @ts-ignore
  window.fetch.mockImplementation(mockFetch);
});
