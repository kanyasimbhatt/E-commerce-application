import { GET, POST, PUT, DELETE } from "./methods";
import { Product } from "../SignUp/types";

// Create Product
export async function createProduct(
  product: Product
): Promise<Product | undefined> {
  try {
    const response = await POST("products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    return response as unknown as Product;
  } catch (error) {
    console.error("Error creating product:", error);
  }
}

// Get All Products
export async function getAllProducts(): Promise<Product[] | undefined> {
  try {
    const response = await GET("products");
    return response as unknown as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Get Single Product
export async function getProductById(
  productId: string
): Promise<Product | undefined> {
  try {
    const allProducts = (await GET("products")) as unknown as Product[];
    return allProducts.find((p) => p.productId === productId);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
  }
}

// Update Product
export async function updateProduct(
  productId: string,
  updatedData: Partial<Product>
): Promise<Product | undefined> {
  try {
    const response = await PUT(`products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    return response as unknown as Product;
  } catch (error) {
    console.error("Error updating product:", error);
  }
}

// Delete Product
export async function deleteProduct(productId: string): Promise<void> {
  try {
    await DELETE(`products/${productId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}

export { GET, POST, PUT, DELETE };
