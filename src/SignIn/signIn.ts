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

  passwordInput.addEventListener("input", validatePassword);
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

const validatePassword = (): boolean => {
  const password = passwordInput.value.trim();
  if (!passwordValidator.test(password)) {
    passwordError.textContent =
      "Password must be at least 7 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
    passwordInput.classList.add("is-invalid");
    return false;
  } else {
    passwordError.textContent = "";
    passwordInput.classList.remove("is-invalid");
    return true;
  }
};

function clearErrors() {
  emailError.textContent = "";
  passwordError.textContent = "";
  emailInput.classList.remove("is-invalid");
  passwordInput.classList.remove("is-invalid");
}

async function handleClickSignIn() {
  const emailValid = validateEmail();
  const passwordValid = validatePassword();

  if (!emailValid || !passwordValid) {
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
    const userObject = await GET<Array<User>>(
      `user?userId=${localStorage.getItem("user-token")}`
    );

    if (userObject.length > 0) {
      handleRedirect(userObject[0]);
    }
  }

  initializeEventListener();
});
