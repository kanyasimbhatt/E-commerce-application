import { User } from "../SignUp/signUp";
export async function addNewUser(newUser: User) {
  const response = await fetch(
    "https://e-commerce-website-backend-9431.onrender.com/user",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    }
  );

  if (!response.ok) {
    throw new Error("Couldn't Save new User data");
  }
}
