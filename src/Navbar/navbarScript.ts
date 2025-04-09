import { populateUserPopup, bindLogoutButton } from "./userInfo";

export function induceNavbarCode(element: HTMLElement, pageType: string) {
  element.innerHTML = `
    <!-- Logo -->
    <a class="navbar-brand d-flex gap-2 align-items-center justify-content-center" href="">
      <img src="https://th.bing.com/th/id/OIP.jZz_UxnqxGF3Fa2U3mXQpAHaHa?rs=1&pid=ImgDetMain" alt="Logo" height="40" width="40" />
      <h3 class="text-primary">Shopify</h3>
    </a>

    <div class="ms-auto d-flex align-items-center gap-4">
      <!-- Search bar -->
      <div class="d-flex flex-row justify-content-center align-items-center border rounded px-2 me-3 remove">
        <i class="fa fa-search px-2"></i>
        <input type="text" id="search" class="form-control bg-light border-0" placeholder="Search products..." aria-label="Search products" />
      </div>

      <!-- User info popup -->
      <div class="profile-logo-info-wrapper position-relative">
        <a href="#" class="me-3 profile-popup">
          <i class="bi bi-person-circle" style="font-size: 1.7rem"></i>
        </a>
        <div class="profile-user-info-buyer toggleClass d-none position-absolute bg-white border shadow p-3 rounded"
             style="top: 100%; right: 0; min-width: 270px; z-index: 1050;">
          <div class="mb-3">
            <label for="popup-name" class="form-label d-flex align-items-center gap-2">
              <i class="bi bi-person-fill text-primary"></i><span>Full Name</span>
            </label>
            <input type="text" id="popup-name" class="form-control" readonly />
          </div>
          <div class="mb-3">
            <label for="popup-email" class="form-label d-flex align-items-center gap-2">
              <i class="bi bi-envelope-fill text-secondary"></i><span>Email</span>
            </label>
            <input type="email" id="popup-email" class="form-control" readonly />
          </div>
          <button class="btn btn-danger w-100" id="logout-btn">
            <i class="bi bi-box-arrow-right me-2"></i>Logout
          </button>
        </div>
      </div>

      <!-- Cart -->
      <a href="../../allProduct/Cart/cart.html" class="me-3 remove">
        <i class="fa fa-shopping-cart" aria-hidden="true" style="font-size: 1.5rem"></i>
      </a>
    </div>
  `;

  if (pageType === "seller") {
    document.querySelectorAll(".remove").forEach((element) => {
      element.classList.add("d-none");
      const toggleDiv = document.getElementsByClassName("toggleClass")[0];
      toggleDiv.classList.remove("profile-user-info-buyer");
      toggleDiv.classList.add("profile-user-info-seller");
    });
  }

  const profileElement = document.getElementsByClassName(
    "profile-popup"
  )[0] as HTMLElement;
  profileElement.addEventListener("click", (e) => {
    e.preventDefault();
    if (pageType === "buyer") {
      document
        .getElementsByClassName("profile-user-info-buyer")[0]
        .classList.toggle("d-none");
    } else {
      document
        .getElementsByClassName("profile-user-info-seller")[0]
        .classList.toggle("d-none");
    }
  });

  // Call user popup logic after navbar is added
  populateUserPopup();
  bindLogoutButton();
}

export function redirectNavbarRequest(element: HTMLElement) {
  const currentLink = document.location.href.toLowerCase();
  if (currentLink.includes("buyer")) {
    induceNavbarCode(element, "buyer");
  } else if (currentLink.includes("seller")) {
    induceNavbarCode(element, "seller");
  }
}
