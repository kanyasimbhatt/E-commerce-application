declare global {
  interface Window {
    bootstrap: any;
  }
}

import customAlert from "../../../node_modules/@pranshupatel/custom-alert/script";
import { GET } from "../../Services/methods";
import { deleteProduct as deleteProductService } from "../../Services/productservice";
import { Product, User, Role } from "../../SignUp/types";

let sellerProducts: Product[] = [];

let currentRenderProducts: Product[] = [];
let currentDisplayIndex = 0;
const itemsPerPage = 6;

let productListEl: HTMLDivElement;
let searchInputEl: HTMLInputElement;
let sortSelectEl: HTMLSelectElement;

document.addEventListener("DOMContentLoaded", async () => {
  productListEl = document.getElementById("productList") as HTMLDivElement;
  searchInputEl = document.getElementById("searchInput") as HTMLInputElement;
  sortSelectEl = document.getElementById("sortSelect") as HTMLSelectElement;

  const userToken = localStorage.getItem("user-token");
  console.log("Logged in seller userId:", userToken);

  if (!userToken) {
    customAlert("error", "top-right", "You must be logged in as a Seller.");
    return;
  }

  try {
    const users = (await GET(`user?userId=${userToken}`)) as User[];

    if (users.length === 0) {
      customAlert("error", "top-right", "User not found.");
      return;
    }

    const user = users[0];

    if (user.role !== Role.Seller) {
      customAlert("error", "top-right", "You do not have Seller permission.");
      return;
    }

    const allProducts = (await GET("products")) as unknown as Product[];

    console.log(
      "All products:",
      allProducts.map((p) => ({
        productId: p.productId,
        userId: p.userId,
      }))
    );

    sellerProducts = allProducts.filter(
      (p) => String(p.userId) === String(userToken)
    );

    console.log("Filtered seller products:", sellerProducts);

    currentRenderProducts = sellerProducts;
    resetProductsDisplay();
    loadMoreProducts();

    searchInputEl.addEventListener("input", handleSearchAndSort);
    sortSelectEl.addEventListener("change", handleSearchAndSort);

    window.addEventListener("scroll", handleScroll);
  } catch (error) {
    console.error("Error loading products:", error);
    customAlert("error", "top-right", "Failed to load products.");
  }
});

function handleSearchAndSort(): void {
  const searchTerm = searchInputEl.value.toLowerCase();
  const sortOption = sortSelectEl.value;

  let filtered = sellerProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm)
  );

  if (sortOption === "name-asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === "name-desc") {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortOption === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  currentRenderProducts = filtered;
  resetProductsDisplay();
  loadMoreProducts();
}

function resetProductsDisplay(): void {
  productListEl.innerHTML = "";
  currentDisplayIndex = 0;
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
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text text-secondary mb-1">$${product.price.toFixed(
                2
              )}</p>
              <div class="mt-auto">
                <button class="btn btn-sm btn-info mb-1" data-view="${
                  product.productId
                }">View</button>
                <button class="btn btn-sm btn-warning mb-1" data-edit="${
                  product.productId
                }">Edit</button>
                <button class="btn btn-sm btn-danger" data-delete="${
                  product.productId
                }">Delete</button>
              </div>
            </div>
          </div>
        `;

    const viewBtn = colDiv.querySelector("[data-view]") as HTMLElement;
    viewBtn?.addEventListener("click", (e) => {
      const productId = (e.currentTarget as HTMLElement).getAttribute(
        "data-view"
      );
      if (productId) viewProduct(productId);
    });

    const editBtn = colDiv.querySelector("[data-edit]") as HTMLElement;
    editBtn?.addEventListener("click", (e) => {
      const productId = (e.currentTarget as HTMLElement).getAttribute(
        "data-edit"
      );
      if (productId) editProduct(productId);
    });

    const deleteBtn = colDiv.querySelector("[data-delete]") as HTMLElement;
    deleteBtn?.addEventListener("click", (e) => {
      const productId = (e.currentTarget as HTMLElement).getAttribute(
        "data-delete"
      );
      if (productId) deleteProduct(productId);
    });

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
  const product = sellerProducts.find((p) => p.productId === productId);
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
  window.location.href = `../Seller/add-product-form.html?edit=${productId}`;
}

async function deleteProduct(productId: string): Promise<void> {
  if (!window.confirm("Are you sure you want to delete this product?")) return;

  try {
    await deleteProductService(productId);

    sellerProducts = sellerProducts.filter((p) => p.productId !== productId);

    currentRenderProducts = currentRenderProducts.filter(
      (p) => p.productId !== productId
    );
    resetProductsDisplay();
    loadMoreProducts();

    customAlert("success", "top-right", "Product deleted successfully!");
  } catch (error) {
    console.error("Error deleting product:", error);
    customAlert("error", "top-right", "Failed to delete product.");
  }
}
