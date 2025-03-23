import { toast } from "sonner";
import type { Data } from "./types";
import { createData, createDataWithError } from "./util";

// export async function getUserData(username: string): Promise<Data<UserData>> {
//   const exists = await userExists(username);

//   const stars = await getAllUserStars(username);

//   const data: Data<UserData> = {
//     data: {
//       exists: exists,
//       username: username,
//       stars: exists && !stars.hasError ? stars.data : -1,
//     },
//     hasError: stars.hasError,
//     error: stars.error,
//   };

//   return data;
// }

export async function getAllUserStars(username: string): Promise<Data<number>> {
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
    return createData(data.stars);
  } catch (error) {
    toast.error(`Error while getting stars for ${username}`);
    console.error("Error while fetching GitHub stars:", error);
    return createDataWithError(-2, `Error while getting stars for ${username}`);
  }
}

export async function userExists(username: string): Promise<Data<boolean>> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (response.status === 404) {
      return createDataWithError(false, response.statusText);
    }

    return createData(response.status === 200);
  } catch (error) {
    const message = `Error checking if GitHub user exists: ${error}`;
    console.error(message);
    return createDataWithError(false, message);
  }
}
