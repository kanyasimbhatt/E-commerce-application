import { User } from "../Type/types";
import { GET } from "../Services/methods";

export async function RouteProtection(expectedRole: string) {
  const userId = localStorage.getItem("user-token");

  if (!userId) {
    document.location.href = "../../SignUp/signUp.html";
    return;
  }

  const users = await GET(`user?userId=${userId}`) as User[];
  const user = users[0];

  if (user && user.role !== expectedRole) {
    if (user.role === "seller") {
      document.location.href = "../../Seller/addProductForm/addProductForm.html";
    } else {
      document.location.href = "../../Buyer/productList/productList.html";
    }
  }
}
