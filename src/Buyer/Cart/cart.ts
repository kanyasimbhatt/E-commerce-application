import { induceNavbarCode } from "../../Navbar/navbarScript";
import { User } from "../../SignUp/types";
import { updateBadgeCount } from "../allProduct/cartBadgeCount";
import { GET, PUT } from "../../Services/methods";
import customAlert from "@pranshupatel/custom-alert";

document.addEventListener("DOMContentLoaded", () => {
  const navbarElement = document.querySelector(".navbar") as HTMLElement;
  induceNavbarCode(navbarElement, "buyer");
  updateBadgeCount();
  (document.getElementsByClassName("remove")[0] as HTMLElement).classList.add(
    "d-none"
  );
  document
    .getElementsByClassName("checkout-button")[0]
    .addEventListener("click", () => {
      handleClickOnCheckout();
    });
  displayCartItems();
});

async function handleClickOnCheckout() {
  let userId = localStorage.getItem("user-token");

  let userData = await GET<Array<User>>(`user?userId=${userId}`);

  userData[0].cart = [];
  await PUT(`user/${userData[0].id}`, {
    body: JSON.stringify(userData[0]),
  });
  updateBadgeCount();
  displayCartItems();
  customAlert("success", "top-right", "Order Placed successfully");
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
        document.getElementsByTagName("tbody") as unknown as HTMLElement
      )[0].innerHTML = "";
      return;
    }

    (
      document.getElementsByClassName("checkout-button")[0] as HTMLButtonElement
    ).disabled = false;
    data[0].cart.forEach((cartItem) => {
      htmlcode += `<tr class = "table-row">
                <th scope="row">${index++}</th>
                <td>${cartItem.name}</td>
                <td>
                  <img
                    src="${cartItem.image}"
                    alt="product image"
                    class="img-fluid"
                  />
                </td>
                <td>$${cartItem.price}</td>
                <td>${cartItem.description}</td>

                <td class = "d-flex gap-3 justify-content-center align-items-start quantity">
                  <a href="#" class="btn btn-danger btn-sm inc-dec-button decrease" id="${
                    cartItem.id
                  }"> - </a>
                  <p class="product-quantity m-0">${cartItem.count}</p>

                  <a href="#" class="btn btn-primary btn-sm inc-dec-button increase" id="${
                    cartItem.id
                  }"> + </a>
                </td>
              </tr>`;
    });

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
