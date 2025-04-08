export interface Product {
  productId: any;
  id: string;
  name: string;
  price: number;
  image: string;
  userId: string;
<<<<<<< HEAD
  description?: string; 
=======
  description: string;
>>>>>>> fe7fcc89b27ec59ffadf4a7a898a35d434d8b25d
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
