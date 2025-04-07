import { filterProducts, sortProducts } from "./filter";
import { redirectNavbarRequest } from "../../Navbar/navbarScript";

document.addEventListener("DOMContentLoaded", async () => {
  const productList = document.getElementById("product-list") as HTMLElement;
  const searchInput = document.getElementById(
    "search"
  ) as HTMLInputElement | null;
  const navbarElement = document.getElementsByClassName(
    "navbar"
  )[0] as HTMLElement;
  redirectNavbarRequest(navbarElement);
  const sortOptions = document.querySelectorAll(".dropdown-item");

  interface Product {
    title: string;
    description: string;
    price: number;
    thumbnail: string;
  }

  let products: Product[] = [];
  let limit: number = 18;
  let skip: number = 0;
  let isFetching: boolean = false;

  async function fetchProducts(): Promise<void> {
    if (isFetching) return;
    isFetching = true;

    try {
      const res = await fetch(
        `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
      );
      const data = await res.json();
      products = [...products, ...(data.products as Product[])];
      displayProducts(products);
      skip += limit;
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      isFetching = false;
    }
  }

  function displayProducts(items: Product[]): void {
    productList.innerHTML = items
      .map(
        (product) => `
            <div class="col-md-3 col-lg-2 mb-4 d-flex align-items-stretch" id="main-card">
                <div class="card product-card w-100">
                    <img src="${product.thumbnail}" class="card-img-top product-img"
                        alt="${product.title}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${product.title}</h5>
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
  }

  // Attach search functionality
  searchInput?.addEventListener("input", () => {
    const searchTerm = searchInput.value;
    const filteredProducts = filterProducts(products, searchTerm);
    displayProducts(filteredProducts);
  });

  // Attach sorting functionality
  document.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      const sortOrder = (event.target as HTMLElement).getAttribute(
        "data-sort"
      ) as "none" | "nameAsc" | "nameDesc";
      const sortedProducts = sortProducts(products, sortOrder);

      displayProducts(sortedProducts);
    });
  });

  // Infinite Scroll Event
  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {
      fetchProducts();
    }
  });

  fetchProducts();
});

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementsByClassName("profile-popup")[0]
    .addEventListener("click", () => {
      document
        .getElementsByClassName("profile-user-info")[0]
        .classList.toggle("selected");
    });
});
