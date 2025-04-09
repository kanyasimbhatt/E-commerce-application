import { redirectNavbarRequest } from "../../Navbar/navbarScript";
import type { Product } from "../../SignUp/types";
import { filterProducts, sortProducts } from "../Sort/sort";
import { RouteProtection } from "../../protectedRoute/routeProtection";
import { populateUserPopup, bindLogoutButton } from "../../Navbar/userInfo";

document.addEventListener("DOMContentLoaded", async () => {
  RouteProtection("buyer");

  const productList = document.getElementById("product-list") as HTMLElement;
  const navbarElement = document.getElementsByClassName(
    "navbar"
  )[0] as HTMLElement;
  redirectNavbarRequest(navbarElement);

  setTimeout(() => {
    populateUserPopup();
    bindLogoutButton();
  }, 0);

  const state = {
    products: [] as Product[],
    skip: 0,
    isFetching: false,
    sortKey: "none",
  };

  const limit = 18;

  const searchInput = document.getElementById("search") as HTMLInputElement;
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const filtered = filterProducts(searchInput.value, state.products);
      const sorted = sortProducts(filtered, state.sortKey);
      displayProducts(sorted);
    });
  }

  document.querySelectorAll(".dropdown-item").forEach((option) => {
    option.addEventListener("click", (e) => {
      e.preventDefault();
      const selectedSort = (e.target as HTMLElement).dataset.sort;
      if (!selectedSort) return;
      state.sortKey = selectedSort;

      const filtered = filterProducts(searchInput?.value || "", state.products);
      const sorted = sortProducts(filtered, state.sortKey);
      displayProducts(sorted);
    });
  });

  async function fetchProducts(): Promise<void> {
    if (state.isFetching) return;
    state.isFetching = true;

    try {
      const res = await fetch(
        `https://e-commerce-website-backend-production-2211.up.railway.app/products?_limit=${limit}&_start=${state.skip}`
      );
      const data: Product[] = await res.json();

      const newProducts = data.filter(
        (newItem) =>
          !state.products.some((existing) => existing.name === newItem.name)
      );

      state.products = [...state.products, ...newProducts];

      const filtered = filterProducts(searchInput?.value || "", state.products);
      const sorted = sortProducts(filtered, state.sortKey);
      displayProducts(sorted);

      state.skip += limit;
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      state.isFetching = false;
    }
  }

  function displayProducts(items: Product[]): void {
    if (items.length === 0) {
      productList.innerHTML = `
        <div class="col-12 text-center">
          <h5 class="text-muted">No products found.</h5>
        </div>
      `;
      return;
    }

    productList.innerHTML = items
      .map(
        (product) => `
          <div class="col-md-3 col-lg-2 mb-4 d-flex align-items-stretch" id="main-card">
            <div class="card product-card w-100 product-click" 
                data-name="${product.name}" 
                data-image="${product.image}" 
                data-description="${product.description || "No description"}" 
                data-price="$${product.price}">
              <img src="${
                product.image
              }" class="card-img-top product-img" alt="${product.name}">
              <div class="card-body text-center">
                <h5 class="card-title">${product.name}</h5>
                <p class="text-success fw-bold">$${product.price}</p>
                <button class="btn btn-secondary">
                  <i class="fa fa-shopping-cart me-2"></i> Add to Cart
                </button>
              </div>
            </div>
          </div>
        `
      )
      .join("");

    setTimeout(() => {
      document.querySelectorAll(".product-click").forEach((el) => {
        el.addEventListener("click", (e) => {
          const target = e.currentTarget as HTMLElement;

          (
            document.getElementById("popupProductName") as HTMLElement
          ).textContent = target.dataset.name || "";
          (
            document.getElementById("popupProductImage") as HTMLImageElement
          ).src = target.dataset.image || "";
          (
            document.getElementById("popupProductDescription") as HTMLElement
          ).textContent = target.dataset.description || "";
          (
            document.getElementById("popupProductPrice") as HTMLElement
          ).textContent = target.dataset.price || "";

          (
            document.getElementById("productPopup") as HTMLElement
          ).style.display = "flex";
        });

        el.querySelector("button")?.addEventListener("click", (event) => {
          event.stopPropagation();
        });
      });

      (document.getElementById("popupClose") as HTMLElement).addEventListener(
        "click",
        () => {
          (
            document.getElementById("productPopup") as HTMLElement
          ).style.display = "none";
        }
      );

      document
        .getElementById("productPopup")
        ?.addEventListener("click", (e) => {
          if ((e.target as HTMLElement).id === "productPopup") {
            (
              document.getElementById("productPopup") as HTMLElement
            ).style.display = "none";
          }
        });
    }, 0);
  }
  
  fetchProducts();
});
