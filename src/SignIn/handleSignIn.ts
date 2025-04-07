import customAlert from "../../node_modules/@pranshupatel/custom-alert/script";
import { User } from "../SignUp/commonTypeInterface.js";
import { GET } from "../Services/methods.js";

function initializeEventListener() {
  document
    .getElementById("sign-in-form")!
    .addEventListener("submit", (event) => {
      event.preventDefault();

      handleClickSignIn();
    });
}

function handleRedirect(userObject: User) {
  if (userObject.role === "buyer") document.location.href = "#";
  else document.location.href = "../Seller/add-product-form.html";
}

async function handleClickSignIn() {
  const userEmail = (document.getElementById("email") as HTMLInputElement)
    .value;
  const password = (document.getElementById("password") as HTMLInputElement)
    .value;
  try {
    const userData = (await GET("user")) as User[];

    const userObject = userData.find(
      (user: User) => user.email === userEmail && user.password === password
    );

    if (userObject) {
      customAlert("success", "top-right", "Login successful");
      localStorage.setItem("user-token", userObject.userId);
      setTimeout(() => {
        handleRedirect(userObject);
      }, 1000);
    } else {
      customAlert("error", "top-right", "Invalid username or password");
    }
  } catch (err) {
    console.log(err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  if (localStorage.getItem("user-token")) {
    const userObject = (await GET(
      `user/${localStorage.getItem("user-token")}`
    )) as User;

    handleRedirect(userObject);
  }
  initializeEventListener();
});
