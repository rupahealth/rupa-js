export const getPublishableKey = async (key = "valid") => ({
  // in setupJest.ts our fetch mock considers the key's value
  // to determine which response to give.
  publishableKey: key,
  expiresIn: 36000,
});
