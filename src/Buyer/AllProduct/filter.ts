export function filterProducts(
  products: Product[],
  searchTerm: string
): Product[] {
  searchTerm = searchTerm.toLowerCase().trim();

  return products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
  );
}

export function sortProducts(
  products: Product[],
  order: "lowToHigh" | "highToLow" | "none" | "nameAsc" | "nameDesc"
): Product[] {
  if (order === "none") return products; // No sorting

  return products.slice().sort((a, b) => {
    if (order === "lowToHigh") return a.price - b.price;
    if (order === "highToLow") return b.price - a.price;
    if (order === "nameAsc") return a.title.localeCompare(b.title); // Sort A → Z
    if (order === "nameDesc") return b.title.localeCompare(a.title); // Sort Z → A
    return 0;
  });
}

// Define Product interface if not declared elsewhere
interface Product {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}
