import { FETCH_URL } from "../SignUp/constants";
export async function GET<T>(url: string, options: object = {}): Promise<T> {
  const response = await fetch(`${FETCH_URL}/${url}`);
  console.log(response);

  if (!response.ok) {
    throw new Error(`Couldn't fetch data`);
  }

  let data = await response.json();
  return data;
}

export async function POST<T>(url: string, options: object = {}): Promise<T> {
  const response = await fetch(`${FETCH_URL}/${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    ...options,
  });

  if (!response.ok) {
    throw new Error("Couldn't Save new User data");
  }

  let data = await response.json();
  return data;
}

export async function PUT<T>(url: string, options: object = {}): Promise<T> {
  const response = await fetch(`${FETCH_URL}/${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    ...options,
  });

  if (!response.ok) {
    throw new Error("Couldn't Update User data");
  }
  return await response.json();
}

export async function DELETE<T>(url: string, options?: object): Promise<T> {
  const response = await fetch(`${FETCH_URL}/${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "DELETE",
    ...options,
  });

  if (!response.ok) {
    throw new Error("Couldn't Delete User data");
  }

  return await response.json();
}
