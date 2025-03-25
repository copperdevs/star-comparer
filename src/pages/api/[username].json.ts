import { calculateStars } from "@/lib";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params }) => {
  if (params.username === undefined)
    return new Response(JSON.stringify({ message: "Username was undefined" }), {
      status: 500,
    });

  const data = await calculateStars(params.username);

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
