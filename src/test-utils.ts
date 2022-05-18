// in setupJest.ts our fetch mock considers the key's value
// to determine which response to give.
export const getPublishableKey = async (key = "valid") => key;
