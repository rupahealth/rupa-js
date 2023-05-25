# @rupa-health/rupa-js

The official browser-side library for Rupa. You can use this library to allow your practitioners to quickly start new orders from your site.

## Overview

```typescript
import Rupa from '@rupa-health/rupa-js'

// An async function that returns the publishable key for a connected practitioner.
async function getPublishableKey() {
  const response = await fetch('https://your-api.com')
  const { publishableKey } = await response.json()

  return publishableKey
}

// Create an instance of the library using your getPublishableKey function
const rupa = new Rupa(getPublishableKey)

// Create an OrderIntent for a given patient
const { error, status, orderIntent } = await rupa.orderIntents.create({
  return_url: 'https://example.com',
  patient_data: {
    first_name: 'Ada',
    last_name: 'Lovelace',
    email: 'ada@rupahealth.com',
  },
})

if (status === 'error') {
  window.alert(`Error: ${error.message}`)
  return
}

const element = document.querySelector('#order-with-rupa')
element.setAttribute('href', orderIntent.redirect_url)
```

## Installation

To install via npm:

```
npm install @rupa-health/rupa-js
```

To use in a script tag, you can use the library via a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@rupa-health/rupa-js@VERSION/dist/index.js"></script>
```

**NOTE: Ensure you specify the library version**

## Usage

### `Rupa(getPublishableKey, options?: { sandbox: boolean })`

To initialize the library, you need to pass an async function that returns a publishable key for a connected practitioner. Learn more about how to get this key in [our authentication docs](https://docs.rupahealth.com/docs/api/ZG9jOjM4ODAzMDU4-authentication-setup).

This function will be called when you make your first request (e.g. by calling `rupa.orderIntents.create()`). If the key has expired, your function will be called again. If the key still isn't valid, an error will be returned.

```typescript
import Rupa from '@rupa-health/rupa-js'

// An async function that returns the publishable key for a connected practitioner.
async function getPublishableKey() {
  const response = await fetch('https://your-api.com')
  const { publishableKey } = await response.json()

  return publishableKey
}

// Create an instance of the library using your getPublishableKey function
const rupa = new Rupa(getPublishableKey)
```

During development, you can use Rupa's sandbox environment by passing `sandbox: true` in the options argument:

```typescript
const rupa = new Rupa(getPublishableKey, { sandbox: true })
```

### `Rupa.orderIntents.create(data: object)`

To allow your practitioners to quickly start an order in Rupa from your site, create an `OrderIntent` object. This object takes the patient information for the order and returns a `redirect_url` that you can direct practitioners to. If you'd like to, you can also add lab_tests from our catalog endpoint to this object. When they visit this URL, the order will created, and they'll be redirected to their new order within Rupa. If you've added lab tests to the object, those lab tests will be available in the cart. When they submit their order, they'll be shown a button they can click to return to your site (determined by the `return_url` you provide when creating the `OrderIntent`).

You can choose to either create the `OrderIntent` when the page in your app loads or when the practitioners clicks the order button.

```typescript
// Create an OrderIntent for a given patient
const { error, status, orderIntent } = await rupa.orderIntents.create({
  return_url: 'https://example.com',
  patient_data: {
    first_name: 'Ada',
    last_name: 'Lovelace',
    email: 'ada@rupahealth.com',
  },
  metadata: { some: 'data' },
})

// Check the status (either "error" or "success")
if (status === 'error') {
  window.alert(`Error: ${error.message}`)
  return
}

const element = document.querySelector('#order-with-rupa')
element.setAttribute('href', orderIntent.redirect_url)
```

#### Parameters

```typescript
data: {
  // The URL we'll direct practitioners to when they submit their order.
  return_url: string

  // The patient information for the order. If a patient with the given
  // email already exists within the practitioner's clinic, it'll be
  // used. Otherwise a new patient will be created.
  patient_data?: {
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

    // The patient ID for the order, if you have it. The patient ID will be
    // present in any order-related events we send to your webhook, so you
    // can persist the ID and provide it here instead of `patient_data`.
    patient?: string

    // Lab Tests to add to the order. These must be id's from our catalog endpoint.
    lab_tests?: string[]
  },

  // Optional metadata to attach to the order. This will be sent in any
  // order events sent to your app's webhook.
  metadata?: {
    [key: string]: any
  }
}
```

**You must provide either `patient_data` or `patient`.**

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

### `Rupa.elements.create(type, options)`

Elements are pre-built UI components you can use to build your Rupa integration. Currently the one element provided by the library is the `orderButton`, which allows you to easily add an `Order with Rupa` button to your site.

Elements are created using `Rupa.elements.create`.

```typescript
const orderButton = rupa.elements.create('orderButton', {
  orderIntent,
})
orderButton.mount('#rupa-button')
```

#### Parameters

```typescript
// The type of element to create.
type: 'orderButton'

// Options for the element. Depends on the `type`. See below.
options: object
```

##### `type: "orderButton"`

The `orderButton` element takes an `OrderIntent` and renders a button that when clicked, takes the practitioner to a new order within Rupa. The appearance of the button can be configured.

```typescript
options: {
  // An `OrderIntent`. Required.
  orderIntent: OrderIntent;

  // Background color for the button. Default: Rupa's brand color.
  background?: string

  // Text color. Default: #fff.
  color?: string

  // The text shown on the button. Default: Order with Rupa
  text?: string
}
```

#### Returns

`Rupa.elements.create` returns an `Element` instance.

### `Element.mount(selector)`

An element can be mounted to the page by calling the `.mount()` method and passing either a valid selector or a DOM element. The selector can be any selector that can be passed to `document.querySelector`.
