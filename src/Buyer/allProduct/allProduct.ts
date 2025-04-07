import { redirectNavbarRequest } from "../../Navbar/navbarScript";
import type { Product } from "../../SignUp/commonTypeInterface";

document.addEventListener("DOMContentLoaded", async () => {
  const productList = document.getElementById("product-list") as HTMLElement;
  const navbarElement = document.getElementsByClassName(
    "navbar"
  )[0] as HTMLElement;
  redirectNavbarRequest(navbarElement);

  const searchInput = document.getElementById(
    "search"
  ) as HTMLInputElement | null;
  const sortOptions = document.querySelectorAll(".dropdown-item");
  const limit: number = 18;

  const state = {
    products: [] as Product[],
    skip: 0,
    isFetching: false,
  };

  async function fetchProducts(): Promise<void> {
    if (state.isFetching) return;
    state.isFetching = true;

    try {
      const res = await fetch(
        `https://dummyjson.com/products?limit=${limit}&skip=${state.skip}`
      );
      const data = await res.json();

      // Map API response to match your Product interface
      const mappedProducts: Product[] = (data.products || []).map(
        (item: any) => ({
          id: item.id.toString(),
          name: item.title,
          price: item.price,
          image: item.thumbnail,
          userId: "", // placeholder since API doesn’t provide userId
        })
      );

      state.products = [...state.products, ...mappedProducts];
      displayProducts(state.products);
      state.skip += limit;
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      state.isFetching = false;
    }
  }

  function displayProducts(items: Product[]): void {
    productList.innerHTML = items
      .map(
        (product) => `
          <div class="col-md-3 col-lg-2 mb-4 d-flex align-items-stretch" id="main-card">
              <div class="card product-card w-100">
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
  }


  // Infinite Scroll
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
