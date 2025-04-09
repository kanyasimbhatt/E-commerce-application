import { GET, POST, PUT, DELETE } from "./methods";
import { Product } from "../SignUp/types";

// Create Product
export async function createProduct(product: Product) {
  try {
    await POST<object>("products", {
      body: JSON.stringify(product),
    });
  } catch (error) {
    console.error("Error creating product:", error);
  }
}

// Get All Products
export async function getAllProducts(): Promise<Product[] | undefined> {
  try {
    const response = await GET<Array<Product>>("products");
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Get Single Product
export async function getProductById(productId: string) {
  try {
<<<<<<< HEAD
    const allProducts = (await GET("products")) as unknown as Product[];
    return allProducts.find((p) => p.id === productId);
=======
    const allProducts = await GET<Array<Product>>("products");
    return allProducts.find((product) => product.id === productId);
>>>>>>> c39efdf619f61d083bfca38148ad65cd8e9eacb2
  } catch (error) {
    console.error("Error fetching product by ID:", error);
  }
}

// Update Product
export async function updateProduct(
  productId: string,
  updatedData: Partial<Product>
) {
  try {
    await PUT<object>(`products/${productId}`, {
      body: JSON.stringify(updatedData),
    });
  } catch (error) {
    console.error("Error updating product:", error);
  }
}

// Delete Product
export async function deleteProduct(productId: string): Promise<void> {
  try {
    await DELETE<object>(`products/${productId}`);
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}
<<<<<<< HEAD

export { GET, POST, PUT, DELETE };
=======
>>>>>>> c39efdf619f61d083bfca38148ad65cd8e9eacb2
