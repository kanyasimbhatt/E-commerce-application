export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  userId: string;
}

export enum Role {
  Buyer = "buyer",
  Seller = "seller",
}
export interface User {
  userId: string;
  fullName: string;
  email: string;
  password: string;
  role: Role;
  cart: Array<Product>;
}
