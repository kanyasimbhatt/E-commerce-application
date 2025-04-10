import type { Product } from "../../SignUp/types";

export function filterProducts(query: string, products: Product[]): Product[] {
  return products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );
}

export function sortProducts(
  products: Array<Product>,
  sortKey: string
): Array<Product> {
  
  switch (sortKey) {
    case "nameAsc":
      return products.slice().sort((a, b) => a.name.localeCompare(b.name));
    case "nameDesc":
      return products.slice().sort((a, b) => b.name.localeCompare(a.name));
    case "lowToHigh":
      return products.slice().sort((a, b) => a.price - b.price);
    case "highToLow":
      return products.slice().sort((a, b) => b.price - a.price);
    default:
      return products.slice();
  }
}
