declare global {
  interface Window {
    bootstrap: any;
  }
}

import customAlert from "@pranshupatel/custom-alert";
import { GET } from "../../Services/methods";
import { deleteProduct as deleteProductService } from "../../Services/productservice";
import { Product, User, Role } from "../../Type/types";
import { redirectNavbarRequest } from "../../Navbar/navbarScript";
import { RouteProtection } from "../../RouteProtection/routeProtection";
import {
  populateUserPopup,
  bindLogoutButton,
  bindAnalysisButton,
} from "../../Navbar/userInfo";

const showLoader = () => {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "flex";
};
const hideLoader = () => {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
};

let sellerProducts: Product[] = [];
let currentRenderProducts: Product[] = [];
let currentDisplayIndex = 0;
const itemsPerPage = 6;

let productListEl: HTMLDivElement;
let searchInputEl: HTMLInputElement;
let sortSelectEl: HTMLSelectElement;
let noProductsMessageEl: HTMLDivElement;

document.addEventListener("DOMContentLoaded", async () => {
  const navbarElement = document.getElementsByClassName(
    "navbar"
  )[0] as HTMLElement;
  redirectNavbarRequest(navbarElement);
  RouteProtection("seller");
  populateUserPopup();
  bindLogoutButton();
  console.log("hello")
  bindAnalysisButton();

  productListEl = document.getElementById("productList") as HTMLDivElement;
  searchInputEl = document.getElementById("searchInput") as HTMLInputElement;
  sortSelectEl = document.getElementById("sortSelect") as HTMLSelectElement;

  // Create and append the noProductsMessageEl
  noProductsMessageEl = document.createElement("div");
  noProductsMessageEl.id = "noProductsMessage";
  noProductsMessageEl.style.display = "none";
  noProductsMessageEl.style.textAlign = "center";
  noProductsMessageEl.style.marginTop = "2rem";
  noProductsMessageEl.innerHTML = `<h5>No products found.</h5>`;
  productListEl.parentElement?.insertBefore(noProductsMessageEl, productListEl);

  const userToken = localStorage.getItem("user-token");

  try {
    showLoader();

    const users = await GET<User[]>(`user?userId=${userToken}`);
    if (users.length === 0) {
      customAlert("error", "top-right", "User not found.");
      return;
    }

    const user = users[0];

    if (user.role !== Role.Seller) {
      customAlert("error", "top-right", "You do not have Seller permission.");
      return;
    }

    sellerProducts = await GET<Product[]>(`products?userId=${userToken}`);

    currentRenderProducts = sellerProducts;
    resetProductsDisplay();
    loadMoreProducts();

    searchInputEl.addEventListener("input", handleSearchAndSort);
    sortSelectEl.addEventListener("change", handleSearchAndSort);
    window.addEventListener("scroll", handleScroll);

    // Event delegation
    productListEl.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const viewBtn = target.closest("[data-view]") as HTMLElement;
      const editBtn = target.closest("[data-edit]") as HTMLElement;
      const deleteBtn = target.closest("[data-delete]") as HTMLElement;

      if (viewBtn) {
        const productId = viewBtn.getAttribute("data-view");
        if (productId) viewProduct(productId);
      } else if (editBtn) {
        const productId = editBtn.getAttribute("data-edit");
        if (productId) editProduct(productId);
      } else if (deleteBtn) {
        const productId = deleteBtn.getAttribute("data-delete");
        if (productId) deleteProduct(productId);
      }
    });
  } catch (error) {
    console.error("Error loading products:", error);
    customAlert("error", "top-right", "Failed to load products.");
  } finally {
    hideLoader();
  }
});

function handleSearchAndSort(): void {
  const searchTerm = searchInputEl.value.toLowerCase();
  const sortOption = sortSelectEl.value;

  let filtered = sellerProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm)
  );

  switch (sortOption) {
    case "name-asc":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
  }

  currentRenderProducts = filtered;
  resetProductsDisplay();
  loadMoreProducts();
}

function resetProductsDisplay(): void {
  productListEl.innerHTML = "";
  currentDisplayIndex = 0;

  if (currentRenderProducts.length === 0) {
    noProductsMessageEl.style.display = "block";
  } else {
    noProductsMessageEl.style.display = "none";
  }
}

function loadMoreProducts(): void {
  const nextItems = currentRenderProducts.slice(
    currentDisplayIndex,
    currentDisplayIndex + itemsPerPage
  );

  nextItems.forEach((product) => {
    const colDiv = document.createElement("div");
    colDiv.className = "col-md-3 mb-4";

    colDiv.innerHTML = `
        <div class="card h-100">
          <img
            src="${product.image}"
            class="card-img-top"
            alt="${product.name}"
            style="object-fit: cover; height: 200px;"
          />
          <div class="card-body d-flex flex-column text-center">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text text-secondary mb-1">$${product.price.toFixed(
              2
            )}</p>
            <div class="mt-auto d-flex justify-content-center gap-2">
              <button class="btn btn-sm btn-info" data-view="${
                product.id
              }">View</button>
              <button class="btn btn-sm btn-warning" data-edit="${
                product.id
              }">Edit</button>
              <button class="btn btn-sm btn-danger" data-delete="${
                product.id
              }">Delete</button>
            </div>
          </div>
        </div>
      `;

    productListEl.appendChild(colDiv);
  });

  currentDisplayIndex += itemsPerPage;
}

function handleScroll(): void {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
    if (currentDisplayIndex < currentRenderProducts.length) {
      loadMoreProducts();
    }
  }
}

function viewProduct(productId: string): void {
  const product = sellerProducts.find((product) => product.id === productId);
  if (!product) return;

  (document.getElementById("modalProductImage") as HTMLImageElement).src =
    product.image;
  (document.getElementById("modalProductName") as HTMLElement).textContent =
    product.name;
  (
    document.getElementById("modalProductDescription") as HTMLElement
  ).textContent = product.description || "(No description provided.)";
  (document.getElementById("modalProductPrice") as HTMLElement).textContent =
    product.price.toFixed(2);

  const modalElement = document.getElementById(
    "viewProductModal"
  ) as HTMLElement;
  const modal = new window.bootstrap.Modal(modalElement);
  modal.show();
}

function editProduct(productId: string): void {
  window.location.href = `../AddProductForm/addProductForm.html?edit=${productId}`;
}

async function deleteProduct(productId: string): Promise<void> {
  if (!window.confirm("Are you sure you want to delete this product?")) return;

  try {
    showLoader();
    await deleteProductService(productId);

    sellerProducts = sellerProducts.filter(
      (product) => product.id !== productId
    );
    currentRenderProducts = currentRenderProducts.filter(
      (product) => product.id !== productId
    );
    resetProductsDisplay();
    loadMoreProducts();

    customAlert("success", "top-right", "Product deleted successfully!");
  } catch (error) {
    console.error("Error deleting product:", error);
    customAlert("error", "top-right", "Failed to delete product.");
  } finally {
    hideLoader();
  }
}
