# @rupa-health/rupa-js
The official browser-side library for Rupa. You can use this library to allow your practitioners to quickly start new orders from your site.

## Overview
```typescript
import Rupa from "@rupa-health/rupa-js";

// An async function that returns the publishable key for a connected practitioner.
async function getPublishableKey() {
  const response = await fetch("https://your-api.com");
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

## Installation
```
npm install @rupa-health/rupa-js
```

## Usage

### `Rupa(getPublishableKey, options?: { sandbox: boolean })`
To initialize the library, you need to pass an async function that returns a publishable key for a connected practitioner. Learn more about how to get this key in [our authentication docs](https://docs.rupahealth.com/docs/api/ZG9jOjM4ODAzMDU4-authentication-setup).

This function will be called when you make your first request (e.g. by calling `rupa.orderIntents.create()`). If the key has expired, your function will be called again. If the key still isn't valid, an error will be returned.

```typescript
import Rupa from "@rupa-health/rupa-js";

// An async function that returns the publishable key for a connected practitioner.
async function getPublishableKey() {
  const response = await fetch("https://your-api.com");
  const { publishableKey } = await response.json();

  return publishableKey;
}

// Create an instance of the library using your getPublishableKey function
const rupa = new Rupa(getPublishableKey);
```

During development, you can use Rupa's sandbox environment by passing `sandbox: true` in the options argument:

```typescript
const rupa = new Rupa(getPublishableKey, { sandbox: true });
```

### `.orderIntents.create`
To allow your practitioners to quickly start an order in Rupa from your site, create an `OrderIntent` object. This object takes the patient information for the order and returns a `redirect_url` that you can direct practitioners to. When they visit this URL, the order will created and they'll be redirected to their new order within Rupa. When they submit their order, they'll be shown a button they can click to return to your site (determined by the `return_url` you provide when creating the `OrderIntent`).

You can choose to either create the `OrderIntent` when the page in your app loads or when the practitioners clicks the order button.

```typescript
// Create an OrderIntent for a given patient
const { error, status, orderIntent } = await rupa.orderIntents.create({
  return_url: "https://example.com",
  patient: {
    first_name: "Ada",
    last_name: "Lovelace",
    email: "ada@rupahealth.com",
  },
  metadata: {"some": "data"}
});

// Check the status (either "error" or "success")
if (status === "error") {
  window.alert(`Error: ${error.message}`);
  return;
}

const element = document.querySelector("#order-with-rupa");
element.setAttribute("href", orderIntent.redirect_url);
```

#### Parameters
```typescript
{
  // The URL we'll direct practitioners to when they submit their order.
  return_url: string

  // The patient information for the order. If a patient with the given
  // email already exists within the practitioner's clinic, it'll be
  // used. Otherwise a new patient will be created.
  patient: {
    // These fields are required
    first_name: string,
    last_name: string,
    email: string (must be a valid email),

    // These are optional - the patient can provide them later
    phone_number: string (an E164-formatted phone number),
    birthday: string (YYYY-MM-DD),
    gender: string,
    shipping_address: {
      street: string,
      city: string,
      state: string,
      zipcode: string,
    },
  },

  // Optional metadata to attach to the order. This will be sent in any
  // order events sent to your app's webhook.
  metadata: {
    [key: string]: any
  }
}
```

#### Return
```typescript
Promise<{
  status: "success" | "error",

  // If status === "success"
  orderIntent: {
    id: string,

    // A URL you can redirect your practitioner to when they want to create
    // a new order in Rupa.
    redirect_url: string,
  },

  // If status === "error"
  error: {
    code:
      | "RupaValidationError"
      | "RupaPermissionDeniedError"
      | "RupaAuthenticatedError"
      | "RupaUnknownError"
      | "RupaClientError",

    // A human-readable error message.
    message: string,

    // If code === "RupaValidationError"
    fields: {
      // A map from field name to an array of validation messages.
      [field: string]: string[]
    },
  },
}>
```
