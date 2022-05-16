import Rupa from "@rupa-health/rupa-js";

async function getPublishableKey() {
  return {
    publishableKey: "{{ REPLACE_WITH_PUBLISHABLE_KEY }}",
    expiresIn: 36000,
  };
}

const rupa = new Rupa({ getPublishableKey, sandbox: true });

async function createLink() {
  const { error, status, orderIntent } = await rupa.orderIntents.create({
    return_url: "http://localhost:8001",
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
}

createLink();
