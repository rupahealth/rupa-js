import Rupa from "@rupa-health/rupa-js";

const getPublishableKey = async () =>
  "pk_7bf3fca6e384960013f0cceae7c519ec86ec1646";

const rupa = new Rupa(getPublishableKey, { sandbox: true });

async function createLink() {
  const { error, status, orderIntent } = await rupa.orderIntents.create({
    return_url: "http://localhost:8001",
    patient: {
      first_name: "Jeremy",
      last_name: "Lovelace",
      email: "jeremy_diff@rupahealth.com",
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
