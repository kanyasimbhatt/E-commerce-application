import { User, Product } from "../SignUp/types";

export async function GET(
  url,
  options?
): Promise<User[] | User | Product | Product[]> {
  const response = await fetch(
    `https://e-commerce-website-backend-568s.onrender.com/${url}`,
    options
  );

  // ✅ Check if the response is OK
  if (!response.ok) {
    throw new Error("couldnt fetch data");
  }
  return await response.json();
}

export async function POST(url: string, options: object) {
  try {
    const response = await fetch(
      `https://e-commerce-website-backend-568s.onrender.com/${url}`,
      options
    );

    if (!response.ok) {
      const errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      console.error("POST Request Failed:", errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Network Error in POST Request:", error);
    throw error;
  }
}

export async function PUT(url: string, options: object) {
  try {
    const response = await fetch(
      `https://e-commerce-website-backend-568s.onrender.com/${url}`,
      options
    );

    if (!response.ok) {
      const errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      console.error("PUT Request Failed:", errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Network Error in PUT Request:", error);
    throw error;
  }
}

export async function DELETE(url: string, options: object) {
  try {
    const response = await fetch(
      `https://e-commerce-website-backend-568s.onrender.com/${url}`,
      options
    );

    if (!response.ok) {
      const errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      console.error("DELETE Request Failed:", errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Network Error in DELETE Request:", error);
    throw error;
  }
}
