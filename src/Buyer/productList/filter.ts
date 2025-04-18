import { Product } from "../../Type/types";

export function filterProducts(query: string, products: Product[]): Product[] {
  return products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );
}
