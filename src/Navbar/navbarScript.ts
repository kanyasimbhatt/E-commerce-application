document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementsByClassName("profile-popup")[0]
    .addEventListener("click", () => {
      document
        .getElementsByClassName("profile-user-info")[0]
        .classList.toggle("selected");
    });
});

function handleNavbarDisplay() {
  const currentLink: string = document.location.href;

  if (currentLink.includes("Seller")) {
    (
      document.getElementsByClassName("buyer-title")[0] as HTMLElement
    ).style.display = "none";
    (
      document.getElementsByClassName("seller-title")[0] as HTMLElement
    ).style.display = "inline";

    document.querySelectorAll(".remove").forEach((element) => {
      (element as HTMLElement).style.display = "none";
    });

    document
      .getElementsByClassName("profile-user-info")[0]
      .classList.add("profile-user-info-seller");

    document
      .getElementsByClassName("profile-user-info")[0]
      .classList.remove("profile-user-info-buyer");
  } else if (currentLink.includes("Buyer")) {
    (
      document.getElementsByClassName("buyer-title")[0] as HTMLElement
    ).style.display = "inline";
    (
      document.getElementsByClassName("seller-title")[0] as HTMLElement
    ).style.display = "none";
    document.querySelectorAll(".remove").forEach((element) => {
      (element as HTMLElement).style.display = "inline";
    });
    document
      .getElementsByClassName("profile-user-info")[0]
      .classList.add("profile-user-info-buyer");

    document
      .getElementsByClassName("profile-user-info")[0]
      .classList.remove("profile-user-info-seller");
  }
}
