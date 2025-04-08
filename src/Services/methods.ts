export async function GET<T>(url, options?): Promise<T> {
  const response = await fetch(
    `https://e-commerce-website-backend-568s.onrender.com/${url}`
  );

  if (!response.ok) {
    throw new Error(`Couldn't fetch data`);
  }

  let data = await response.json();
  return data;
}

export async function POST(url: string, options: object) {
  const response = await fetch(
    `https://e-commerce-website-backend-568s.onrender.com/${url}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      ...options,
    }
  );

  if (!response.ok) {
    throw new Error("Couldn't Save new User data");
  }
}

export async function PUT(url: string, options: object) {
  const response = await fetch(
    `https://e-commerce-website-backend-568s.onrender.com/${url}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      ...options,
    }
  );

  if (!response.ok) {
    throw new Error("Couldn't Update User data");
  }
}

export async function DELETE(url: string, options: object) {
  const response = await fetch(
    `https://e-commerce-website-backend-568s.onrender.com/${url}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
      ...options,
    }
  );

  if (!response.ok) {
    throw new Error("Couldn't Delete User data");
  }
}
