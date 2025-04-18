import customAlert from "@pranshupatel/custom-alert";
import { User } from "../Type/types.js";
import { GET } from "../Services/methods.js";
import { emailValidator, passwordValidator } from "../SignUp/constants.js";

const passwordInput = document.getElementById("password") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const emailError = document.getElementById("email-error")!;
const passwordError = document.getElementById("password-error")!;

function initializeEventListener() {
  document
    .getElementById("sign-in-form")!
    .addEventListener("submit", (event) => {
      event.preventDefault();
      clearErrors();
      handleClickSignIn();
    });

  emailInput.addEventListener("input", validateEmail);
}

function handleRedirect(userObject: User) {
  if (userObject.role === "buyer") {
    document.location.href = "../Buyer/productList/productList.html";
  } else {
    document.location.href = "../Seller/AddProductForm/addProductForm.html";
  }
}

function validateEmail(): boolean {
  const email = emailInput.value.trim();

  if (!emailValidator.test(email)) {
    emailError.textContent = "Please enter a valid email address.";
    emailInput.classList.add("is-invalid");
    return false;
  } else {
    emailError.textContent = "";
    emailInput.classList.remove("is-invalid");
    return true;
  }
}

function clearErrors() {
  emailError.textContent = "";
  passwordError.textContent = "";
  emailInput.classList.remove("is-invalid");
  passwordInput.classList.remove("is-invalid");
}

async function handleClickSignIn() {
  const emailValid = validateEmail();

  if (!emailValid) {
    return;
  }

  const userEmail = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    const userData = await GET<Array<User>>("user");

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
    console.error("Login error:", err);
    customAlert(
      "error",
      "top-right",
      "Something went wrong. Please try again."
    );
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  if (localStorage.getItem("user-token")) {
    const userData = await GET<Array<User>>(
      `user?userId=${localStorage.getItem("user-token")}`
    );

    handleRedirect(userData[0]);
  }

  initializeEventListener();
});
