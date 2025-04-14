function induceNavbarCode(element: HTMLElement, pageType: string) {
  element.innerHTML = `
      <!-- Logo  -->
      <a
        class="navbar-brand d-flex gap-2 align-items-center justify-content-center"
        href=""
      >
        <img src="https://th.bing.com/th/id/OIP.jZz_UxnqxGF3Fa2U3mXQpAHaHa?rs=1&pid=ImgDetMain" alt="Logo" height="40" width="40" />
        <h3 class="text-primary">Shopify</h3>
      </a>
      <div class="ms-auto d-flex align-items-center gap-4">
        <!-- Search bar -->
        <div
          class="d-flex flex-row justify-content-center align-items-center border rounded px-2 me-3 remove" 
        >
          <i class="fa fa-search px-2"></i>
          <input
          type="text"
          id="search"
          class="form-control bg-light border-0"
          placeholder="Search products..."
          aria-label="Search products"
      />

        </div>
        <!-- user-info -->
        <div class="profile-logo-info-wrapper">
          <a href="#" class="me-3 profile-popup">
            <i class="bi bi-person-circle" style="font-size: 1.7rem"></i>
          </a>
          <div class="profile-user-info-buyer toggleClass"></div>
        </div>
        <!-- add to cart -->
        <a href="../Cart/cart.html" class="me-3 cart position-relative d-inline-block">
  <i class="fa fa-shopping-cart" aria-hidden="true" style="font-size: 1.8rem;"></i>
  <span
    class="cart-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-flex justify-content-center align-items-center"
    style="min-width: 1.25rem; height: 1.25rem; font-size: 0.75rem; padding: 0;"
  >
    0
  </span>
</a>
      </div>
   `;

  if (pageType === "seller") {
    document.querySelectorAll(".remove").forEach((element) => {
      element.classList.add("d-none");
      document
        .getElementsByClassName("toggleClass")[0]
        .classList.remove("profile-user-info-buyer");
      document
        .getElementsByClassName("toggleClass")[0]
        .classList.add("profile-user-info-seller");
    });
  }

  const profileElement = document.getElementsByClassName(
    "profile-popup"
  )[0] as HTMLElement;

  profileElement.addEventListener("click", () => {
    if (pageType === "buyer") {
      document
        .getElementsByClassName("profile-user-info-buyer")[0]
        .classList.toggle("selected");
    } else {
      document
        .getElementsByClassName("profile-user-info-seller")[0]
        .classList.toggle("selected");
    }
  });
}

export function redirectNavbarRequest(element: HTMLElement) {
  const currentLink: string = document.location.href;
  if (currentLink.toLowerCase().includes("buyer")) {
    induceNavbarCode(element, "buyer");
  } else if (currentLink.toLowerCase().includes("seller")) {
    induceNavbarCode(element, "seller");
  }
}
