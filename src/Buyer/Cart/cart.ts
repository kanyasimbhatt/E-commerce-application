import { redirectNavbarRequest } from "../../Navbar/navbarScript";
import { User } from "../../Type/types";
import { updateBadgeCount } from "../productList/cardBadgeCount";
import { GET, PUT } from "../../Services/methods";
import customAlert from "@pranshupatel/custom-alert";

document.addEventListener("DOMContentLoaded", () => {
  const navbarElement = document.querySelector(".navbar") as HTMLElement;
  redirectNavbarRequest(navbarElement);
  (
    document.getElementsByClassName("navbar-brand")[0] as HTMLAnchorElement
  ).href = "../allProduct/allProduct.html";

  updateBadgeCount();
  (document.getElementsByClassName("remove")[0] as HTMLElement).classList.add(
    "d-none"
  );
  document
    .getElementsByClassName("checkout-button")[0]
    .addEventListener("click", async () => {
      await clearCart();
      updateBadgeCount();
      displayCartItems();
      customAlert("success", "top-right", "Order Placed successfully");
    });

  document
    .getElementsByClassName("clear-cart-button")[0]
    .addEventListener("click", async () => {
      await clearCart();
      updateBadgeCount();
      displayCartItems();
      customAlert("success", "top-right", "Cart cleared successfully");
    });
  displayCartItems();
});

async function clearCart() {
  let userId = localStorage.getItem("user-token");
  try {
    let userData = await GET<Array<User>>(`user?userId=${userId}`);

    userData[0].cart = [];
    await PUT(`user/${userData[0].id}`, {
      body: JSON.stringify(userData[0]),
    });
  } catch (err) {
    console.log(err);
  }
}

async function displayCartItems() {
  const userId = localStorage.getItem("user-token");
  try {
    let data = await GET<Array<User>>(`user?userId=${userId}`);
    let index = 0;
    let htmlcode = "";

    if (data[0].cart.length === 0) {
      (
        document.getElementsByClassName(
          "checkout-button"
        )[0] as HTMLButtonElement
      ).disabled = true;

      (
        document.getElementsByClassName(
          "clear-cart-button"
        )[0] as HTMLButtonElement
      ).disabled = true;
      (
        document.getElementsByTagName("tbody") as unknown as HTMLElement
      )[0].innerHTML = "";
      document.getElementsByClassName("total-price")[0].textContent = `0`;

      return;
    }

    (
      document.getElementsByClassName("checkout-button")[0] as HTMLButtonElement
    ).disabled = false;

    let priceSum = 0;

    data[0].cart.forEach((cartItem) => {
      if (cartItem.count! > 0) {
        htmlcode += `
            <tr class="table-row">
              <th scope="row">${index++}</th>
              <td>${cartItem.name}</td>
              <td>
                <img
                  src="${cartItem.image}"
                  alt="product image"
                  class="img-fluid cart-product-img"
                />
              </td>
              <td>$${cartItem.price}</td>
              <td>${cartItem.description}</td>
              <td class="text-center">
                <div class="d-inline-flex align-items-center border rounded px-2 py-1 shadow-sm bg-light gap-2 justify-content-center action-container">
                  <button
                    class="btn btn-danger btn-sm square-button inc-dec-button decrease"
                    id="${cartItem.id}"
                    title="Decrease"
                  >
                    <i class="fas fa-minus"></i>
                  </button>
                  <span class="product-quantity fw-semibold px-2">${
                    cartItem.count
                  }</span>
                  <button
                    class="btn btn-primary btn-sm square-button inc-dec-button increase"
                    id="${cartItem.id}"
                    title="Increase"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              </td>
            </tr>
          `;

        priceSum += +cartItem.count! * +cartItem.price;
      }
    });

    document.getElementsByClassName(
      "total-price"
    )[0].textContent = `${priceSum}`;

    (
      document.getElementsByTagName("tbody") as unknown as HTMLElement
    )[0].innerHTML = htmlcode;
    document.querySelectorAll(".decrease").forEach((element) => {
      element.addEventListener("click", (event: Event) => {
        if ("id" in event.target!)
          incrementDecrementProductCount(
            event.target!.id as string,
            "decrement"
          );
      });
    });

    document.querySelectorAll(".increase").forEach((element) => {
      element.addEventListener("click", (event: Event) => {
        if ("id" in event.target!)
          incrementDecrementProductCount(
            event.target!.id as string,
            "increment"
          );
      });
    });
  } catch (err) {
    console.log(err);
  }
}

async function incrementDecrementProductCount(
  productId: string,
  action: string
) {
  let userId = localStorage.getItem("user-token");
  let index = 0;
  try {
    let data = await GET<Array<User>>(`user?userId=${userId}`);
    data[0].cart = data[0].cart.map((element) => {
      if (element.id === productId) {
        if (action === "decrement") element.count!--;
        else element.count!++;
      }
      index++;
      return element;
    });

    await PUT(`user/${data[0].id}`, {
      body: JSON.stringify(data[0]),
    });
    updateBadgeCount();
    displayCartItems();
  } catch (err) {
    console.log(err);
  }
}
