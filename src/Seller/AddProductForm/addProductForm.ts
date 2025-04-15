import customAlert from "@pranshupatel/custom-alert";
import { User, Product, Role } from "../../Type/types";
import {
  getAllProducts,
  updateProduct,
  createProduct,
} from "../../Services/productservice";
import { GET } from "../../Services/methods";
import { redirectNavbarRequest } from "../../Navbar/navbarScript";
import { RouteProtection } from "../../RouteProtection/routeProtection";
import { populateUserPopup, bindLogoutButton } from "../../Navbar/userInfo";

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("productForm") as HTMLFormElement;
  const navbarElement = document.getElementsByClassName(
    "navbar"
  )[0] as HTMLElement;
  redirectNavbarRequest(navbarElement);
  RouteProtection("seller");
  populateUserPopup();
  bindLogoutButton();
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

      const product = products.find(
        (product) => product.id === editingProductId
      );
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

  productNameInput.addEventListener("input", () => {
    const value = productNameInput.value.trim();
    if (value === "") {
      productNameInput.classList.remove("is-invalid");
    } else {
      productNameInput.classList.toggle("is-invalid", value.length < 2);
    }
  });

  productPriceInput.addEventListener("input", () => {
    const value = parseFloat(productPriceInput.value);
    if (productPriceInput.value.trim() === "") {
      productPriceInput.classList.remove("is-invalid");
    } else {
      productPriceInput.classList.toggle(
        "is-invalid",
        isNaN(value) || value <= 0
      );
    }
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
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;

    if (url !== "") {
      productImageInput.value = "";
      if (!urlPattern.test(url)) {
        productUrlInput.classList.add("is-invalid");
        let errorMsg = document.getElementById("url-error");
        if (!errorMsg) {
          errorMsg = document.createElement("div");
          errorMsg.id = "url-error";
          errorMsg.classList.add("invalid-feedback");
          errorMsg.textContent = "Invalid image URL. Please enter a valid URL.";
          productUrlInput.parentNode?.appendChild(errorMsg);
        } else {
          errorMsg.textContent = "Invalid image URL. Please enter a valid URL.";
        }
      } else {
        productUrlInput.classList.remove("is-invalid");
        const errorMsg = document.getElementById("url-error");
        if (errorMsg) errorMsg.remove();
        imagePreview.src = url;
      }
    } else {
      imagePreview.src =
        "https://placehold.co/300x300?text=Product+Image&font=roboto";
      productUrlInput.classList.remove("is-invalid");
      const errorMsg = document.getElementById("url-error");
      if (errorMsg) errorMsg.remove();
    }
  });

  // Submit Handling
  form.addEventListener("submit", async (event: SubmitEvent) => {
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

      const users = await GET<User[]>(`user?userId=${userId}`);
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
        window.location.assign("../SellerProducts/sellerProducts.html");
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
