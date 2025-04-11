import { redirectNavbarRequest } from "../../Navbar/navbarScript";
import type { Product } from "../../Type/types";
import { sortProducts } from "./sort";
import { GET } from "../../Services/methods";
import { filterProducts } from "./filter";
import { RouteProtection } from "../../RouteProtection/routeProtection";
import { populateUserPopup , bindLogoutButton } from "../../Navbar/userInfo";

interface ProductState {
  products: Product[];
  isFetching: boolean;
  sortKey: "name" | "price" | "none";
  sortDirection: "asc" | "desc";
}

let productList: HTMLElement;
let navbarElement: HTMLElement;
let state: ProductState = {
  products: [],
  isFetching: false,
  sortKey: "none",
  sortDirection: "asc",
};

document.addEventListener("DOMContentLoaded", () => {
  productList = document.getElementById("product-list") as HTMLElement;
  navbarElement = document.getElementsByClassName("navbar")[0] as HTMLElement;
  redirectNavbarRequest(navbarElement);
  init();
  RouteProtection("buyer");
  populateUserPopup(); 
  bindLogoutButton();
});

function init(): void {
  Search();
  Sort();
  fetchProducts();
}

function Search(): void {
  const searchInput = document.getElementById("search") as HTMLInputElement;
  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const filtered = filterProducts(searchInput.value, state.products);
    const sorted = sortProducts(filtered, {
      sortKey: state.sortKey,
      sortDirection: state.sortDirection,
    });
    displayProducts(sorted);
  });
}

function Sort(): void {
  const sortOptions = document.querySelectorAll(".dropdown-item");

  sortOptions.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.preventDefault();
      const selectedSort = (e.target as HTMLElement).dataset.sort;
      if (!selectedSort) return;

      if (selectedSort === "none") {
        state.sortKey = "none";
        state.sortDirection = "asc";
      } else {
        const isNameSort = selectedSort.startsWith("name");
        state.sortKey = isNameSort ? "name" : "price";
        state.sortDirection = selectedSort.endsWith("Asc") ? "asc" : "desc";
      }

      const searchInput = document.getElementById("search") as HTMLInputElement;
      const filtered = filterProducts(searchInput?.value || "", state.products);
      const sorted = sortProducts(filtered, {
        sortKey: state.sortKey,
        sortDirection: state.sortDirection,
      });
      displayProducts(sorted);
    });
  });
}

async function fetchProducts(): Promise<void> {
  if (state.isFetching) return;
  state.isFetching = true;

  const data = await GET<Product[]>("products");
  state.products = [...state.products, ...data];

  const searchInput = document.getElementById("search") as HTMLInputElement;
  const filtered = filterProducts(searchInput?.value || "", state.products);
  const sorted = sortProducts(filtered, {
    sortKey: state.sortKey,
    sortDirection: state.sortDirection,
  });

  displayProducts(sorted);
  state.isFetching = false;
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
        <div class="card product-card w-100 product-click" data-id="${product.id}">
          <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
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

  attachProductClickEvents();
  attachPopupCloseEvent();
}

function attachProductClickEvents(): void {
  document.querySelectorAll(".product-click").forEach((el) => {
    el.addEventListener("click", async (e) => {
      const target = e.currentTarget as HTMLElement;
      const productId = target.dataset.id;
      if (!productId) return;
      await showProductPopup(productId);
    });
  });
}

async function showProductPopup(productId: string): Promise<void> {
  try {
    const product = await GET<Product>(`products/${productId}`);
    (document.getElementById("popupProductName") as HTMLElement).textContent =
      product.name;
    (document.getElementById("popupProductImage") as HTMLImageElement).src =
      product.image;
    (
      document.getElementById("popupProductDescription") as HTMLElement
    ).textContent = product.description || "No description";
    (
      document.getElementById("popupProductPrice") as HTMLElement
    ).textContent = `$${product.price}`;
    (document.getElementById("productPopup") as HTMLElement).style.display =
      "flex";
  } catch (err) {
    console.error("Error fetching product details:", err);
  }
}

function attachPopupCloseEvent(): void {
  document.getElementById("productPopup")?.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).id === "productPopup") {
      (document.getElementById("productPopup") as HTMLElement).style.display =
        "none";
    }
  });
}
