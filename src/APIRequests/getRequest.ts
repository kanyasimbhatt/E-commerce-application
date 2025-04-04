import { User } from "../SignUp/signUp";
export async function getUserInfo(): Promise<User[]> {
  const response = await fetch(
    "https://e-commerce-website-backend-9431.onrender.com/user"
  );

  if (!response.ok) {
    throw new Error(`Couldn't fetch data`);
  }

  let data = await response.json();
  return data;
}
