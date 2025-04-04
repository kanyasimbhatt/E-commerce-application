import customAlert from "../../node_modules/@pranshupatel/custom-alert/script";
import { User } from "../SignUp/commonTypeInterface.js";
import { getUserInfo } from "../Services/getRequest.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeEventListener();
});

function initializeEventListener() {
  document
    .getElementsByClassName("sign-in-form")[0]
    .addEventListener("submit", (event) => {
      event.preventDefault();

      handleSignIn();
    });
}

async function handleSignIn() {
  let username = (document.getElementById("email") as HTMLInputElement).value;
  let password = (document.getElementById("password") as HTMLInputElement)
    .value;

  let userData = await getUserInfo();
  let conditionalFlag: number = 0;

  userData.forEach((user: User) => {
    if (user.email === username) {
      if (user.password === password) {
        conditionalFlag = 1;
        customAlert("success", "top-right", "Login successful");
        localStorage.setItem("current-user-id", user.userId);
        setTimeout(() => {
          if (user.role === "buyer") document.location.href = "#";
          else document.location.href = "#";
        }, 1000);
      }
    }
  });

  if (conditionalFlag === 0) {
    customAlert("error", "top-right", "Invalid username and password");
  }
}
