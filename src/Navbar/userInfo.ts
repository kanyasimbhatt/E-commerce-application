import ApexCharts from "apexcharts";
import { GET } from "../Services/methods";
import { Order, User } from "../Type/types";
import { bodyElement, analysisElement, removePopupButton } from "./constants";

export async function populateUserPopup() {
  const userId = localStorage.getItem("user-token");
  if (!userId) return;

  const userData = (await GET(`user?userId=${userId}`)) as User[];
  if (userData.length > 0) {
    const user = userData[0];
    const nameInput = document.getElementById("popup-name") as HTMLInputElement;
    const emailInput = document.getElementById(
      "popup-email"
    ) as HTMLInputElement;
    if (nameInput) nameInput.value = user.fullName;
    if (emailInput) emailInput.value = user.email;
  }
}

export function bindLogoutButton() {
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.id === "logout-btn") {
      localStorage.removeItem("user-token");
      window.location.replace("../../SignIn/signIn.html");
    }
  });
}

async function fetchChartOptions() {
  let userData: Array<Order> = await GET(
    `orders?userId=${localStorage.getItem("user-token")}`
  );
  let productCountPerMonth = new Array(12).fill(0);
  userData.forEach((order) => {
    let month = new Date(order.date).getMonth();
    let totalCount = order.orderItems.reduce(
      (accumulator, product) => product.count! + accumulator,
      0
    );

    productCountPerMonth[month] += totalCount;
  });

  return {
    chart: {
      height: "100%",
      width: "100%",
      type: "bar",
      background: "transparent",
      color: "black",
      foreColor: "#333",
    },
    series: [
      {
        name: "Products Bought",
        data: productCountPerMonth,
      },
    ],

    xaxis: {
      categories: [
        "January",
        "Feburary",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },
  };
}

export async function bindAnalysisButton() {
  try {
    const searchDiv = document.getElementById("search") as HTMLInputElement;
    let visibleFlag = false;
    let chartOptions = await fetchChartOptions();

    document
      .getElementById("analysis-btn")
      ?.addEventListener("click", (event: Event) => {
        if (!visibleFlag) {
          analysisElement.style.display = "block";

          const charts = new ApexCharts(
            document.querySelector(".chart-display"),
            chartOptions
          );
          charts.render();
          visibleFlag = true;
          bodyElement.style.display = "none";
          searchDiv.disabled = true;
        }
      });

    removePopupButton.addEventListener("click", () => {
      analysisElement.style.display = "none";
      bodyElement.style.display = "block";
      visibleFlag = false;
      searchDiv.disabled = false;
    });
  } catch (err) {
    console.log(err);
  }
}
