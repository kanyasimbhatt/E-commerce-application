import type { Product } from "../../SignUp/types";

interface SortOptions {
  sortKey: "name" | "price" | "none";
  sortDirection: "asc" | "desc";
}

export function sortProducts(
  products: Product[],
  options: SortOptions
): Product[] {
  const { sortKey, sortDirection } = options;

  if (sortKey === "none") return products.slice();

  return products.slice().sort((a, b) => {
    let valueA = a[sortKey];
    let valueB = b[sortKey];

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    }

    return 0;
  });
}
