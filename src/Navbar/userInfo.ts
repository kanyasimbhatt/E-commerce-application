import ApexCharts from "apexcharts";
import { GET } from "../Services/methods";
import { Order, User } from "../Type/types";
import { bodyElement, analysisElement, removePopupButton } from "./constants";
import { Role, Product } from "../Type/types";

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

async function fetchChartOptions(userId: string) {
  const userData: Array<Order> = await GET(`orders?userId=${userId}`);
  const productCountPerMonth = new Array(12).fill(0);

  userData.forEach((order) => {
    const month = new Date(order.date).getMonth();
    const totalCount = order.orderItems.reduce(
      (accumulator, product) => accumulator + (product.count ?? 1),
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
        "February",
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
    const userId = localStorage.getItem("user-token");
    if (!userId) return;

    const currentUser: User = (
      (await GET(`user?userId=${userId}`)) as User[]
    )[0];

    let chartInstance: ApexCharts | null = null;

    const chartOptions =
      currentUser.role === Role.Buyer
        ? await fetchChartOptions(userId)
        : await fetchSellerChartOptions(userId);

    document.getElementById("analysis-btn")?.addEventListener("click", () => {
      if (!chartInstance) {
        analysisElement.style.display = "block";

        chartInstance = new ApexCharts(
          document.querySelector(".chart-display"),
          chartOptions
        );
        chartInstance.render();

        bodyElement.style.display = "none";
        searchDiv.disabled = true;
      }
    });

    removePopupButton.addEventListener("click", () => {
      analysisElement.style.display = "none";
      bodyElement.style.display = "block";
      searchDiv.disabled = false;

      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
    });
  } catch (err) {
    console.error("Error binding analysis button:", err);
  }
}

async function fetchSellerChartOptions(sellerId: string) {
  const orders: Order[] = await GET("orders");
  const productCountPerMonth = orders.reduce((acc, order) => {
    const month = new Date(order.date).getMonth();

    const monthlyCount = order.orderItems.reduce((sum, product) => {
      return product.userId === sellerId ? sum + (product.count ?? 1) : sum;
    }, 0);

    acc[month] += monthlyCount;
    return acc;
  }, new Array(12).fill(0));

  return {
    chart: {
      height: "100%",
      width: "100%",
      type: "line",
      background: "transparent",
      foreColor: "#333",
    },
    series: [
      {
        name: "Products Sold",
        data: productCountPerMonth,
      },
    ],
    xaxis: {
      categories: [
        "January",
        "February",
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
