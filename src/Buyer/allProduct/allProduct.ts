import customAlert from "@pranshupatel/custom-alert";
import { redirectNavbarRequest } from "../../Navbar/navbarScript";
import { updateBadgeCount } from "./cartBadgeCount";
import type { Product } from "../../SignUp/types";
import { filterProducts, sortProducts } from "../Sort/sort";
import { GET, PUT } from "../../Services/methods";
import { User } from "../../SignUp/types";
import { populateUserPopup, bindLogoutButton } from "../../Navbar/userInfo";

document.addEventListener("DOMContentLoaded", async () => {
  updateBadgeCount();
  const productList = document.getElementById("product-list") as HTMLElement;
  const navbarElement = document.getElementsByClassName(
    "navbar"
  )[0] as HTMLElement;
  redirectNavbarRequest(navbarElement);

  const state = {
    products: [] as Product[],
    skip: 0,
    isFetching: false,
    sortKey: "none",
  };

  const limit = 18;

  setTimeout(() => {
    const searchInput = document.getElementById("search") as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const filtered = filterProducts(searchInput.value, state.products);
        const sorted = sortProducts(filtered, state.sortKey);
        displayProducts(sorted);
      });
    }
  }, 100);

  const sortOptions = document.querySelectorAll(".dropdown-item");
  sortOptions.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.preventDefault();
      const selectedSort = (e.target as HTMLElement).dataset.sort;
      if (!selectedSort) return;
      state.sortKey = selectedSort;

      const searchInput = document.getElementById("search") as HTMLInputElement;
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
        `https://e-commerce-website-backend-568s.onrender.com/products?_limit=${limit}&_start=${state.skip}`
      );
      const data: Product[] = await res.json();

      state.products = [...state.products, ...data];

      const searchInput = document.getElementById("search") as HTMLInputElement;
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

  async function handleAddToCart(productId: string, cardElement: HTMLElement) {
    const userId = localStorage.getItem("user-token");
    try {
      const data = await GET<Array<User>>(`user?userId=${userId}`);
      let productData = await GET<Product>(`products/${productId}`);

      let productDataIndex = data[0].cart.findIndex(
        (product) => product.id === productData.id
      );
      if (productDataIndex === -1) {
        productData = { ...productData, ...{ count: 1 } };
        data[0].cart.push(productData);
        console.log(data[0].cart);
      } else {
        data[0].cart[productDataIndex].count! += 1;
      }
      console.log(data[0]);

      await PUT(`user/${data[0].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data[0]),
      });

      customAlert("success", "top-right", "Item Added Successfully");

      updateBadgeCount();
    } catch (err) {
      console.log(err);
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
                <button class="btn btn-secondary" id = "${product.id}">
                  <i class="fa fa-shopping-cart me-2"></i> Add to Cart
                </button>
              </div>
            </div>
          </div>
        `
      )
      .join("");

    setTimeout(() => {
      document.querySelectorAll(".product-click").forEach((element) => {
        element.addEventListener("click", (e) => {
          const target = e.currentTarget as HTMLElement;

          const name = target.dataset.name || "";
          const image = target.dataset.image || "";
          const description = target.dataset.description || "";
          const price = target.dataset.price || "";

          (
            document.getElementById("popupProductName") as HTMLElement
          ).textContent = name;
          (
            document.getElementById("popupProductImage") as HTMLImageElement
          ).src = image;
          (
            document.getElementById("popupProductDescription") as HTMLElement
          ).textContent = description;
          (
            document.getElementById("popupProductPrice") as HTMLElement
          ).textContent = price;

          (
            document.getElementById("productPopup") as HTMLElement
          ).style.display = "flex";

          const button = element.querySelector("button");
          button?.addEventListener("click", (event) => {
            event.stopPropagation();
            if ("id" in event.target!)
              handleAddToCart(
                event.target!.id as string,
                element as HTMLElement
              );
          });
        });
      });

      // Close popup
      (document.getElementById("popupClose") as HTMLElement).addEventListener(
        "click",
        () => {
          (
            document.getElementById("productPopup") as HTMLElement
          ).style.display = "none";
        }
      );

      // Close when clicking outside content
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
