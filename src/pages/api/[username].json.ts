import { getAllUserStars, userExists, type Data, type UserData } from "@/lib";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params }) => {
  if (params.username === undefined)
    return new Response(JSON.stringify({ message: "Username was undefined" }), {
      status: 500,
    });

  const exists = await userExists(params.username);

  const stars = await getAllUserStars(params.username);

  const data: Data<UserData> = {
    data: {
      exists: exists,
      username: params.username,
      stars: exists && !stars.hasError ? stars.data : -1,
    },
    hasError: stars.hasError,
    error: stars.error,
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
