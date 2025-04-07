import type { Product } from "../../SignUp/commonTypeInterface";

export function sortProducts(products: Product[], sortKey: string): Product[] {
  switch (sortKey) {
    case "nameAsc":
      return [...products].sort((a, b) => a.name.localeCompare(b.name));
    case "nameDesc":
      return [...products].sort((a, b) => b.name.localeCompare(a.name));
    case "lowToHigh":
      return [...products].sort((a, b) => a.price - b.price);
    case "highToLow":
      return [...products].sort((a, b) => b.price - a.price);
    default:
      return products;
  }
}
