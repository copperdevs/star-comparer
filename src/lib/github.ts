import { toast } from "sonner";
import type { Data } from "./types";
import { createData, createDataWithError } from "./util";
import { sessionGetItem, sessionHasItem, sessionSetItem } from "./storage";

export async function getAllUserStars(username: string): Promise<Data<number>> {
  if (sessionHasItem(`${username}-stars`)) {
    const itemStars = sessionGetItem<number>(`${username}-stars`);

    if (itemStars) {
      // toast.info("Getting stars from cache");
      return createData(itemStars);
    }
  }

  try {
    const response = await fetch(
      `https://api.github-star-counter.workers.dev/user/${username}`
    );

    if (!response.ok) {
      toast.error(`Error getting stars for ${username}`);
      console.error(`GitHub API error: ${response.status}`);
      return createDataWithError(-2, `GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    sessionSetItem(`${username}-stars`, data.stars);

    return createData(data.stars);
  } catch (error) {
    toast.error(`Error while getting stars for ${username}`);
    console.error("Error while fetching GitHub stars:", error);
    return createDataWithError(-2, `Error while getting stars for ${username}`);
  }
}

export async function userExists(username: string): Promise<Data<boolean>> {
  if (sessionHasItem(`${username}-exists`)) {
    const itemExists = sessionGetItem<boolean>(`${username}-exists`);

    if (itemExists) {
      // toast.info("Getting user exists from cache");
      return createData(itemExists);
    }
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (response.status === 404) {
      return createDataWithError(false, response.statusText);
    }

    sessionSetItem(`${username}-exists`, response.status === 200);

    return createData(response.status === 200);
  } catch (error) {
    const message = `Error checking if GitHub user exists: ${error}`;
    console.error(message);
    return createDataWithError(false, message);
  }
}
