import customAlert from "../../../node_modules/@pranshupatel/custom-alert/script";

import { User, Product, Role } from "../../SignUp/types";
import {
  getAllProducts,
  updateProduct,
  createProduct,
} from "../../Services/productservice";
import { GET } from "../../Services/methods";
import { RouteProtection } from "../../protectedRoute/routeProtection";
import { redirectNavbarRequest } from "../../Navbar/navbarScript";

function getProductById(productId: string): Promise<Product | undefined> {
  return getAllProducts().then((products) => {
    if (!products) return undefined;
    const found = products.find((p) => p.id === productId);
    console.log("Looking for productId:", productId);
    console.log("Matched product:", found);
    return found;
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const navbarElement = document.getElementsByClassName(
    "navbar"
  )[0] as HTMLElement;
  redirectNavbarRequest(navbarElement);
  RouteProtection("seller");
  const form = document.getElementById("productForm") as HTMLFormElement;
  const productNameInput = document.getElementById(
    "productName"
  ) as HTMLInputElement;
  const productImageInput = document.getElementById(
    "productImage"
  ) as HTMLInputElement;
  const productUrlInput = document.getElementById(
    "productUrl"
  ) as HTMLInputElement;
  const productPriceInput = document.getElementById(
    "productPrice"
  ) as HTMLInputElement;
  const productDescriptionInput = document.getElementById(
    "productDescription"
  ) as HTMLTextAreaElement;
  const imagePreview = document.getElementById(
    "imagePreview"
  ) as HTMLImageElement;

  const queryParams = new URLSearchParams(window.location.search);
  const editingProductId = queryParams.get("edit") ?? undefined;
  let editingInternalId: string | undefined = undefined;

  if (editingProductId) {
    try {
      const products = await getAllProducts();
      if (!products) throw new Error("No products found");

      const product = products.find((p) => p.id === editingProductId);
      if (product) {
        editingInternalId = product.id;

        productNameInput.value = product.name;
        productPriceInput.value = String(product.price);
        productDescriptionInput.value = product.description;

        if (product.image.startsWith("data:image")) {
          const imageBlob = await fetch(product.image).then((res) =>
            res.blob()
          );
          const file = new File([imageBlob], "image.jpg", {
            type: imageBlob.type,
          });
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          productImageInput.files = dataTransfer.files;
          imagePreview.src = product.image;
        } else {
          productUrlInput.value = product.image;
          imagePreview.src = product.image;
        }
      } else {
        console.warn("Product not found for editing");
      }
    } catch (error) {
      console.error("Failed to load product for editing:", error);
    }
  }

  // Validation and UI Updates
  productNameInput.addEventListener("input", () => {
    const value = productNameInput.value.trim();
    productNameInput.classList.toggle("is-invalid", value.length < 2);
  });

  productPriceInput.addEventListener("input", () => {
    const value = parseFloat(productPriceInput.value);
    productPriceInput.classList.toggle(
      "is-invalid",
      isNaN(value) || value <= 0
    );
  });

  productDescriptionInput.addEventListener("input", () => {
    const value = productDescriptionInput.value.trim();
    productDescriptionInput.classList.toggle("is-invalid", value.length < 10);
  });

  productImageInput.addEventListener("change", () => {
    const file = productImageInput.files?.[0];
    if (file) {
      productUrlInput.value = "";
      if (!file.type.startsWith("image/") || file.size > 1048576) {
        productImageInput.classList.add("is-invalid");
      } else {
        productImageInput.classList.remove("is-invalid");
        const reader = new FileReader();
        reader.onload = () => {
          imagePreview.src = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    } else {
      productImageInput.classList.add("is-invalid");
      imagePreview.src =
        "https://placehold.co/300x300?text=Product+Image&font=roboto";
    }
  });

  productUrlInput.addEventListener("input", () => {
    const url = productUrlInput.value.trim();
    if (url !== "") {
      productImageInput.value = "";
      imagePreview.src = url;
      productUrlInput.classList.remove("is-invalid");
    } else {
      imagePreview.src =
        "https://placehold.co/300x300?text=Product+Image&font=roboto";
      productUrlInput.classList.add("is-invalid");
    }
  });

  // Submit Handling
  form.addEventListener("submit", async (event: Event) => {
    event.preventDefault();
    let isValid = true;

    const nameValue = productNameInput.value.trim();
    const priceValue = parseFloat(productPriceInput.value);
    const descriptionValue = productDescriptionInput.value.trim();
    const file = productImageInput.files?.[0];
    const url = productUrlInput.value.trim();

    if (nameValue.length < 2) {
      productNameInput.classList.add("is-invalid");
      isValid = false;
    } else {
      productNameInput.classList.remove("is-invalid");
    }

    if (isNaN(priceValue) || priceValue <= 0) {
      productPriceInput.classList.add("is-invalid");
      isValid = false;
    } else {
      productPriceInput.classList.remove("is-invalid");
    }

    if (descriptionValue.length < 10) {
      productDescriptionInput.classList.add("is-invalid");
      isValid = false;
    } else {
      productDescriptionInput.classList.remove("is-invalid");
    }

    if (!file && url === "") {
      productImageInput.classList.add("is-invalid");
      productUrlInput.classList.add("is-invalid");
      isValid = false;
    } else if (
      file &&
      (!file.type.startsWith("image/") || file.size > 1048576)
    ) {
      productImageInput.classList.add("is-invalid");
      isValid = false;
    } else {
      productImageInput.classList.remove("is-invalid");
      productUrlInput.classList.remove("is-invalid");
    }

    if (!isValid) return;

    const userToken = localStorage.getItem("user-token");
    if (!userToken) {
      customAlert(
        "error",
        "top-right",
        "You must be logged in to add a product."
      );
      return;
    }

    try {
      const userId = userToken;
      const users = (await GET(`user?userId=${userId}`)) as User[];

      if (users.length === 0) throw new Error("User not found.");

      const user = users[0];
      if (user.role !== Role.Seller) {
        customAlert(
          "error",
          "top-right",
          "You do not have permission to add products."
        );
        return;
      }

      let imageValue = "";
      if (file) {
        imageValue = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      } else if (url !== "") {
        imageValue = url;
      }

      const newProduct: Product = {
        id: editingProductId ? editingProductId : `prod-${Date.now()}`,
        name: nameValue,
        price: priceValue,
        image: imageValue,
        userId: String(userId),
        description: descriptionValue,
        productId: undefined,
      };

      if (editingProductId && editingInternalId) {
        await updateProduct(editingInternalId, newProduct);
      } else {
        await createProduct(newProduct);
      }

      customAlert(
        "success",
        "top-right",
        editingProductId ? "Product updated!" : "Product added successfully!"
      );
      setTimeout(() => {
        window.location.assign("../seller-products/seller-products.html");
      }, 1000);
    } catch (error) {
      console.error("Error adding/updating product:", error);
      customAlert(
        "error",
        "top-right",
        "Failed to save product. Please try again."
      );
    }
  });
});
