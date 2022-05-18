# @rupa-health/rupa-js
The official browser-side library for Rupa. You can use this library to allow your practitioners to quickly start new orders using an `OrderIntent` object.

## Usage
```
npm install @rupa-health/rupa-js
```
```typescript
import Rupa from "@rupa-health/rupa-js";

// An async function that returns the publishable key for a connected practitioner.
async function getPublishableKey() {
  const response = await fetch(this.buildAbsoluteUrl(resource), {
    method,
    headers,
    body: JSON.stringify(payload),
  });
  const { publishableKey } = await response.json();

  return publishableKey;
}

// Create an instance of the library using your getPublishableKey function
const rupa = new Rupa(getPublishableKey);

// Create an OrderIntent for a given patient
const { error, status, orderIntent } = await rupa.orderIntents.create({
  return_url: "https://example.com",
  patient: {
    first_name: "Ada",
    last_name: "Lovelace",
    email: "ada@rupahealth.com",
  },
});

if (status === "error") {
  window.alert(`Error: ${error.message}`);
  return;
}

const element = document.querySelector("#order-with-rupa");
element.setAttribute("href", orderIntent.redirect_url);
```
