import { User } from "../SignUp/types";
import { GET } from "../Services/methods";

export async function RouteProtection(pageType: string) {
  const userId = localStorage.getItem("user-token");
  if (!userId) {
    document.location.href = "../../SignUp/signUp.html";
    return;
  }
  const userObject = (await GET(`user?userId=${userId}`)) as User[];
  if (userObject.length !== 0) {
    if (userObject[0].role !== pageType) {
      if (pageType === "buyer" && userObject[0].role === "seller") {
        document.location.href =
          "../../Seller/addProductForm/addProduorm.html";
      } else {
        document.location.href = "../../Buyer/productList/productList.html";
      }
    }
  }
}
