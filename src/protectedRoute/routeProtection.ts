import { User } from "../SignUp/types";
import { GET } from "../Services/methods";

export async function RouteProtection(pageType: string) {
  const userId = localStorage.getItem("user-token");
  const userObject = (await GET(`user?userId=${userId}`)) as User;

  if (userObject) {
    if (userObject.role !== pageType) {
      if (pageType === "buyer") {
        document.location.href = "../Buyer/allProduct/allProduct.html";
      } else {
        document.location.href =
          "../Seller/add-product-form/add-product-form.html";
      }
    }
  }
}
