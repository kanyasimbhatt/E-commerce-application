import { GET } from "../Services/methods";
import { User } from "../SignUp/types";

export async function populateUserPopup() {
  const userId = localStorage.getItem("user-token");
  if (!userId) return;

    const userData = (await GET(`user?userId=${userId}`)) as User[];
    if (userData.length > 0) {
      const user = userData[0];
      const nameInput = document.getElementById(
        "popup-name"
      ) as HTMLInputElement;
      const emailInput = document.getElementById(
        "popup-email"
      ) as HTMLInputElement;
      if (nameInput) nameInput.value = user.fullName;
      if (emailInput) emailInput.value = user.email;
    }
}

export function bindLogoutButton() {
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.id === "logout-btn") {
        localStorage.removeItem("user-token");
        window.location.replace("../../SignIn/signIn.html");
      }
    });
  }