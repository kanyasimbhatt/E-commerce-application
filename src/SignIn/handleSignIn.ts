import customAlert from "../../node_modules/@pranshupatel/custom-alert/script";
import { User } from "../SignUp/commonTypeInterface.js";
import { GET } from "../Services/Service.js";

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
  const username = (document.getElementById("email") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement)
    .value;
  try {
    const userData = (await GET("user")) as User[];

    let userObject = userData.find(
      (user: User) => user.email === username && user.password === password
    );

    if (userObject) {
      customAlert("success", "top-right", "Login successful");
      localStorage.setItem("user-token", userObject.userId);
      setTimeout(() => {
        if (userObject.role === "buyer") document.location.href = "#";
        else document.location.href = "#";
      }, 1000);
    } else {
      customAlert("error", "top-right", "Invalid username and password");
    }
  } catch (err) {
    console.log(err);
  }
}
