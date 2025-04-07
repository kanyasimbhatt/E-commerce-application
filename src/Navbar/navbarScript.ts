function induceNavbarCodeForBuyer(element: HTMLElement) {
  element.innerHTML = `<nav class="navbar navbar-expand-lg navbar-light bg-light px-3 shadow">
      <!-- Logo  -->
      <a
        class="navbar-brand d-flex gap-2 align-items-center justify-content-center"
        href="./viewAllProducts.html"
      >
        <img src="../images/logo.png" alt="Logo" height="40" width="40" />
        <h3 class="text-primary">Shopify</h3>
        <h5 class="text-primary seller-title">Seller</h5>
        <h5 class="text-primary buyer-title">Buyer</h5>
      </a>
      <div class="ms-auto d-flex align-items-center gap-4">
        <!-- Search bar -->
        <div
          class="d-flex flex-row justify-content-center align-items-center border rounded px-2 me-3 remove"
        >
          <i class="fa fa-search px-2"></i>
          <input
            type="text"
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
          <div class="profile-user-info-buyer"></div>
        </div>
        <!-- add to cart -->
        <a href="./viewCart.html" class="me-3 remove">
          <i
            class="fa fa-shopping-cart"
            aria-hidden="true"
            style="font-size: 1.5rem"
          ></i>
        </a>
      </div>
    </nav>`;
}

function induceNavbarCodeForSeller(element: HTMLElement) {
  element.innerHTML = `<nav class="navbar navbar-expand-lg navbar-light bg-light px-3 shadow">

      <!-- Logo  -->
      <a
        class="navbar-brand d-flex gap-2 align-items-center justify-content-center"
        href="./viewAllProducts.html"
      >
        <img src="../images/logo.png" alt="Logo" height="40" width="40" />
        <h3 class="text-primary">Shopify</h3>
        <h5 class="text-primary seller-title">Seller</h5>
        <h5 class="text-primary buyer-title">Buyer</h5>
      </a>
      <div class="ms-auto d-flex align-items-center gap-4">
        <!-- Search bar -->

        <div
          class="d-flex flex-row justify-content-center align-items-center border rounded px-2 me-3 remove"
        >
          <i class="fa fa-search px-2"></i>
          <input
            type="text"
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
          <div class="profile-user-info-seller"></div>
        </div>
      </div>
    </nav>`;
}

export function redirectNavbarRequest(element: HTMLElement) {
  const currentLink: string = document.location.href;
  if (currentLink.includes("Buyer")) {
    induceNavbarCodeForBuyer(element);
  } else if (currentLink.includes("Seller")) {
    induceNavbarCodeForSeller(element);
  }

  document
    .getElementsByClassName("profile-popup")[0]
    .addEventListener("click", () => {
      document
        .getElementsByClassName("profile-user-info")[0]
        .classList.toggle("selected");
    });
}
