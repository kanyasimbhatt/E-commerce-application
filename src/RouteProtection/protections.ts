import { User } from "../SignUp/types";
import { GET } from "../Services/methods";

export async function RouteProtection(
  pageType: string,
  bodyElement: HTMLElement
) {
  const userId = localStorage.getItem("user-token");
  const userObject = (await GET(`user/${userId}`)) as User;
  const bodyChildNodes = bodyElement.childNodes;

  if (userObject) {
    if (userObject.role === pageType) {
      bodyChildNodes.forEach((element) => {
        (element as HTMLElement).style.display = "none";
      });

      const textElement = document.createElement("p");
      textElement.className = "no-entry-text";
      textElement.innerHTML = "<p>You can not visit this page</p>";

      bodyElement.appendChild(textElement);
    } else {
      bodyChildNodes.forEach((element) => {
        (element as HTMLElement).style.display = "block";
      });
      const noEntryTextElement = document.getElementsByClassName(
        "no-entry-text"
      )[0] as HTMLParagraphElement;
      console.log(noEntryTextElement);

      if (noEntryTextElement) {
        // remove(noEntryTextElement);?
      }
    }
  }
}
