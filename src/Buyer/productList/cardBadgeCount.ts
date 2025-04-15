import { GET } from "../../Services/methods";
import { User } from "../../Type/types";

export async function updateBadgeCount() {
  const userId = localStorage.getItem("user-token");
  const data = await GET<Array<User>>(`user?userId=${userId}`);

  let cartCount = data[0].cart.reduce(
    (accumulator, element) => accumulator + element.count!,
    0
  );
  document.getElementsByClassName("cart-badge")[0].textContent = `${cartCount}`;
}
