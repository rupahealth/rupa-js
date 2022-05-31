// in setupJest.ts our fetch mock considers the key's value
// to determine which response to give.
export const getPublishableKey = async (key = "valid") => key;

export const minimalOrderIntentPayload = {
  return_url: "https://example.com",
  patient_data: {
    first_name: "Ada",
    last_name: "Lovelace",
    email: "ada@rupahealth.com",
  },
};
