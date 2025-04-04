import { User } from "../SignUp/commonTypeInterface";

export async function GET(url, options?): Promise<User[] | User> {
  const response = await fetch(
    `https://e-commerce-website-backend-9431.onrender.com/${url}`
  );

  if (!response.ok) {
    throw new Error(`Couldn't fetch data`);
  }

  let data = await response.json();
  return data;
}

export async function POST(url: string, options: object) {
  const response = await fetch(
    `https://e-commerce-website-backend-9431.onrender.com/${url}`,
    options
  );

  if (!response.ok) {
    throw new Error("Couldn't Save new User data");
  }
}

export async function PUT(url: string, options: object) {
  const response = await fetch(
    `https://e-commerce-website-backend-9431.onrender.com/${url}`,
    options
  );

  if (!response.ok) {
    throw new Error("Couldn't Update User data");
  }
}

export async function DELETE(url: string, options: object) {
  const response = await fetch(
    `https://e-commerce-website-backend-9431.onrender.com/${url}`,
    options
  );

  if (!response.ok) {
    throw new Error("Couldn't Delete User data");
  }
}
