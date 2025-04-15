import { redirectNavbarRequest } from "../../Navbar/navbarScript";
import { User } from "../../Type/types";
import { updateBadgeCount } from "../productList/cardBadgeCount";
import { GET, PUT, POST } from "../../Services/methods";
import customAlert from "@pranshupatel/custom-alert";
import { RouteProtection } from "../../RouteProtection/routeProtection";
import { bindAnalysisButton } from "../../Navbar/userInfo";

document.addEventListener("DOMContentLoaded", () => {
  RouteProtection("buyer");

  const navbarElement = document.querySelector(".navbar") as HTMLElement;
  redirectNavbarRequest(navbarElement);
  (
    document.getElementsByClassName("navbar-brand")[0] as HTMLAnchorElement
  ).href = "../productList/productList.html";
  bindAnalysisButton();
  updateBadgeCount();
  (document.getElementsByClassName("remove")[0] as HTMLElement).classList.add(
    "d-none"
  ); //to remove search bar
  document
    .getElementsByClassName("checkout-button")[0]
    .addEventListener("click", async () => {
      let userData = await getUserData();

      POST("orders", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: new Date(),
          userId: localStorage.getItem("user-token"),
          orderItems: userData[0].cart,
        }),
      });
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

async function getUserData() {
  const userId = localStorage.getItem("user-token");
  return await GET<Array<User>>(`user?userId=${userId}`);
}

async function clearCart() {
  try {
    let userData = await getUserData();

    userData[0].cart = [];
    await PUT(`user/${userData[0].id}`, {
      body: JSON.stringify(userData[0]),
    });
  } catch (err) {
    console.log(err);
  }
}

function handleClearCartScenario() {
  (
    document.getElementsByClassName("checkout-button")[0] as HTMLButtonElement
  ).disabled = true;

  (
    document.getElementsByClassName("clear-cart-button")[0] as HTMLButtonElement
  ).disabled = true;
  (
    document.getElementsByTagName("tbody") as unknown as HTMLElement
  )[0].innerHTML = "";
  document.getElementsByClassName("total-price")[0].textContent = `0`;
}

async function displayCartItems() {
  try {
    let data = await getUserData();
    let index = 0;
    let htmlcode = "";

    if (data[0].cart.length === 0) {
      handleClearCartScenario();
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

                  <button
                    class="btn btn-danger btn-sm square-button delete-item"
                    id="${cartItem.id}"
                    title="delete"
                  >
                    <i class="bi bi-trash-fill"></i>
                  </button>
                </div>
              </td>
            </tr>
          `;

        priceSum += +cartItem.count! * +cartItem.price;
      }
    });
    document.getElementsByTagName("tbody")[0].innerHTML = htmlcode;
    document.getElementsByClassName(
      "total-price"
    )[0].textContent = `${priceSum.toFixed(2)}`;

    attachListenerForOperations();
  } catch (err) {
    console.log(err);
  }
}

function attachListenerForOperations() {
  document.querySelectorAll(".decrease").forEach((element) => {
    element.addEventListener("click", (event: Event) => {
      if ("id" in event.target!)
        incrementDecrementProductCount(event.target!.id as string, "decrement");
    });
  });

  document.querySelectorAll(".increase").forEach((element) => {
    element.addEventListener("click", (event: Event) => {
      if ("id" in event.target!)
        incrementDecrementProductCount(event.target!.id as string, "increment");
    });
  });

  document.querySelectorAll(".delete-item").forEach((element) => {
    element.addEventListener("click", (event: Event) => {
      let closestButton = (event.target! as HTMLElement).closest("button");
      if ("id" in closestButton!) {
        deleteItemFromCart(closestButton.id as string);
      }
    });
  });
}

async function deleteItemFromCart(productId: string) {
  try {
    let data = await getUserData();
    let productIndex = data[0].cart.findIndex(
      (product) => product.id === productId
    );
    if (productIndex === -1) return;
    data[0].cart.splice(productIndex, 1);
    if (data[0].cart.length === 0) {
      handleClearCartScenario();
    }
    await PUT(`user/${data[0].id}`, {
      body: JSON.stringify(data[0]),
    });
    updateBadgeCount();
    displayCartItems();
    customAlert("success", "top-right", "Item Removed successfully");
  } catch (err) {
    console.log(err);
  }
}

async function incrementDecrementProductCount(
  productId: string,
  action: string
) {
  let index = 0;
  try {
    let data = await getUserData();
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
