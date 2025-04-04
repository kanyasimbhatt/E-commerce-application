document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementsByClassName("profile-popup")[0]
    .addEventListener("click", () => {
      document
        .getElementsByClassName("profile-user-info")[0]
        .classList.toggle("selected");
    });
});
