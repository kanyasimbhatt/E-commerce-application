import { redirectNavbarRequest } from "../../Navbar/navbarScript";
import type { Product } from "../../SignUp/types";
import { filterProducts, sortProducts } from "../Sort/sort";
import { GET } from "../../Services/methods";

const productList = document.getElementById("product-list") as HTMLElement;
const navbarElement = document.getElementsByClassName(
  "navbar"
)[0] as HTMLElement;
redirectNavbarRequest(navbarElement);

const state = {
  products: [] as Product[],
  isFetching: false,
  sortKey: "none",
};

const searchInput = document.getElementById("search") as HTMLInputElement;
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const filtered = filterProducts(searchInput.value, state.products);
    const sorted = sortProducts(filtered, state.sortKey);
    displayProducts(sorted);
  });
}

const sortOptions = document.querySelectorAll(".dropdown-item");
sortOptions.forEach((option) => {
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

  const data = await GET<Product[]>("products");

  state.products = [...state.products, ...data];

  const filtered = filterProducts(searchInput?.value || "", state.products);
  const sorted = sortProducts(filtered, state.sortKey);

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

  document.querySelectorAll(".product-click").forEach((el) => {
    el.addEventListener("click", async (e) => {
      const target = e.currentTarget as HTMLElement;
      const productId = target.dataset.id;
      if (!productId) return;

      try {
        const product = await GET<Product>(`products/${productId}`);

        (
          document.getElementById("popupProductName") as HTMLElement
        ).textContent = product.name;

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
    });
  });

  document.getElementById("productPopup")?.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).id === "productPopup") {
      (document.getElementById("productPopup") as HTMLElement).style.display =
        "none";
    }
  });
}

fetchProducts();
