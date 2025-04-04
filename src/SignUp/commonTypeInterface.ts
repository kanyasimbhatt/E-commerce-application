export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  userId: string;
}
export interface User {
  userId: string;
  fullName: string;
  email: string;
  password: string;
  role: "buyer" | "seller";
  cart: Product[];
}
