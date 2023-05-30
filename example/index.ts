import Rupa from "@rupa-health/rupa-js";

const getPublishableKey = async () =>
  "pk_379ac425b04221877a00206d22033e4632cb275e";

const rupa = new Rupa(getPublishableKey, { sandbox: true });

async function createLink() {
  const { error, status, orderIntent } = await rupa.orderIntents.create({
    return_url: "http://localhost:8001",
    patient_data: {
      first_name: "Jeremy",
      last_name: "Lovelace",
      email: "jeremy_diff@rupahealth.com",
    },
    lab_tests: [
      "labt_123abc",
      "labt_456def",
    ]
  });

  if (status === "error") {
    window.alert(`Error: ${error.message}`);
    return;
  }

  // Use custom element
  const element = document.querySelector("#order-with-rupa");
  element.setAttribute("href", orderIntent.redirect_url);

  // Use element
  const orderWithRupa = rupa.elements.create("orderButton", {
    orderIntent,
  });
  orderWithRupa.mount("#shadow");
}

createLink();
