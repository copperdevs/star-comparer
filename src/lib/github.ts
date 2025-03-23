import { toast } from "sonner";
import type { Data } from "./types";
import { createData, createDataWithError } from "./util";

export async function getAllUserStars(username: string): Promise<Data<number>> {
  try {
    const response = await fetch(
      `https://api.github-star-counter.workers.dev/user/${username}`
    );

    if (!response.ok) {
      toast.error(`Error getting stars for ${username}`);
      console.error(`GitHub API error: ${response.status}`);
      return createDataWithError(-1, `GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return createData(data.stars);
  } catch (error) {
    toast.error(`Error while getting stars for ${username}`);
    console.error("Error while fetching GitHub stars:", error);
    return createDataWithError(-1, `Error while getting stars for ${username}`);
  }
}

export async function userExists(username: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (response.status === 404) {
      return false;
    }

    return response.status === 200;
  } catch (error) {
    console.error("Error checking if GitHub user exists:", error);
    return false;
  }
}
