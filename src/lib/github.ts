import { toast } from "sonner";
import type { Data } from "./types";
import { createData, createDataWithError } from "./util";
import { sessionGetItem, sessionHasItem, sessionSetItem } from "./storage";

export type UserStorage = {
  exists: boolean;
  username: string;
  stars: number | undefined;
  displayUsername: string | undefined;
  userType: UserType;
};

export type UserType = "User" | "Organization";

export async function getAllUserStars(username: string): Promise<Data<number>> {
  if (sessionHasItem(username)) {
    let item = sessionGetItem<UserStorage>(username);

    if (item) {
      item = await updateData(username, item);

      if (item.stars !== -1) {
        return createData(item.stars ?? -1);
      }
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

    sessionSetItem<UserStorage>(username, {
      exists: true,
      username: username,
      stars: data.stars,
      displayUsername: undefined,
      userType: "User",
    });

    return createData(data.stars);
  } catch (error) {
    toast.error(`Error while getting stars for ${username}`);
    console.error("Error while fetching GitHub stars:", error);
    return createDataWithError(-2, `Error while getting stars for ${username}`);
  }
}

export async function userExists(username: string): Promise<Data<boolean>> {
  if (sessionHasItem(username)) {
    let item = sessionGetItem<UserStorage>(username);

    if (item) {
      item = await updateData(username, item);

      return createData(item.exists ?? false);
    }
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (response.status === 404) {
      return createDataWithError(false, response.statusText);
    }

    const displayName = (await response.json()).name;

    sessionSetItem<UserStorage>(username, {
      exists: response.status === 200,
      username: username,
      stars: -1,
      displayUsername: displayName,
      userType: "User",
    });

    return createData(response.status === 200);
  } catch (error) {
    const message = `Error checking if GitHub user exists: ${error}`;
    console.error(message);
    return createDataWithError(false, message);
  }
}

async function updateData(
  username: string,
  targetItem: UserStorage
): Promise<UserStorage> {
  const item = targetItem;
  let updated: boolean = false;

  const response = await fetch(`https://api.github.com/users/${username}`);
  const data = (await response.json()) as {
    name: string;
    type: UserType;
  };

  // display name
  if (item.displayUsername === undefined || item.displayUsername === null) {
    const displayName = data.name;

    item.displayUsername = displayName;

    updated = true;
  }

  // user type
  {
    item.userType = data.type;
    updated = true;
  }

  if (updated) sessionSetItem(username, item);

  return item;
}
