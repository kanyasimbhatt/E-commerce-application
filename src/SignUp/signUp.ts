import customAlert from "../../node_modules/@pranshupatel/custom-alert/script";
import { GET, POST } from "../Services/methods";
import { User } from "./commonTypeInterface";

function initSignUp(): void {
  const form = document.querySelector("form") as HTMLFormElement;
  form.setAttribute("novalidate", "true");
  const nameInput = document.getElementById("name") as HTMLInputElement;
  const emailInput = document.getElementById("email") as HTMLInputElement;
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const roleSelect = document.getElementById("role") as HTMLSelectElement;

  // Error message containers
  const nameError = document.getElementById("nameError") as HTMLElement;
  const emailError = document.getElementById("emailError") as HTMLElement;
  const passwordError = document.getElementById("passwordError") as HTMLElement;
  const roleError = document.getElementById("roleError") as HTMLElement;

  // Real-time validation for name
  const validateName = (): boolean => {
    const name = nameInput.value.trim();
    if (name === "" || name.length < 2) {
      nameError.textContent = "Full name must be at least 2 characters long";
      nameInput.classList.add("is-invalid");
      return false;
    } else {
      nameError.textContent = "";
      nameInput.classList.remove("is-invalid");
      return true;
    }
  };

  // Real-time validation for email
  const validateEmail = (): boolean => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const email = emailInput.value.trim();
    if (!emailPattern.test(email)) {
      emailError.textContent = "Please enter a valid email address";
      emailInput.classList.add("is-invalid");
      return false;
    } else {
      emailError.textContent = "";
      emailInput.classList.remove("is-invalid");
      return true;
    }
  };

  // Real-time email uniqueness check using the API
  const checkEmailUnique = async (): Promise<boolean> => {
    try {
      const email = emailInput.value.trim();
      const users = (await GET("user")) as User[];
      const emailExists = users.some((user) => user.email === email);

      if (emailExists) {
        emailError.textContent = "This email is already registered.";
        emailInput.classList.add("is-invalid");
        return false;
      } else {
        if (validateEmail()) {
          emailError.textContent = "";
          emailInput.classList.remove("is-invalid");
        }
        return true;
      }
    } catch (err) {
      console.log(err);
    }
    return false;
  };

  const validatePassword = (): boolean => {
    const password = passwordInput.value.trim();

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,}$/;

    if (!passwordPattern.test(password)) {
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

  // Real-time validation for role selection
  const validateRole = (): boolean => {
    if (roleSelect.value === "") {
      roleError.textContent = "Please select a role";
      roleSelect.classList.add("is-invalid");
      return false;
    } else {
      roleError.textContent = "";
      roleSelect.classList.remove("is-invalid");
      return true;
    }
  };

  // Event listeners for real-time validation
  nameInput.addEventListener("input", validateName);
  emailInput.addEventListener("input", async () => {
    validateEmail();
    await checkEmailUnique();
  });
  passwordInput.addEventListener("input", validatePassword);
  roleSelect.addEventListener("change", validateRole);

  // Function to generate a unique userId (using timestamp)
  const generateUserId = (): string => {
    return `user-${Date.now()}`;
  };

  form.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    // Run all custom validations
    const isNameValid = validateName();
    const isEmailValid = validateEmail() && (await checkEmailUnique());
    const isPasswordValid = validatePassword();
    const isRoleValid = validateRole();

    // Proceed only if all validations pass
    if (isNameValid && isEmailValid && isPasswordValid && isRoleValid) {
      const fullName: string = nameInput.value.trim();
      const email: string = emailInput.value.trim();
      const password: string = passwordInput.value.trim();
      const role: string = roleSelect.value;

      // Generate a unique userId
      const userId = generateUserId();

      const newUser: User = {
        userId,
        fullName,
        email,
        password,
        role: role as "buyer" | "seller",
        cart: [],
      };
      try {
        // Send the new user to the JSON server
        const option = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        };
        await POST("user", option);
        customAlert("success", "top-right", "Registration Successful");

        setTimeout(() => {
          document.location.href = "../SignIn/signIn.html";
        }, 1000);
      } catch (err) {
        console.log(err);
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", initSignUp);
