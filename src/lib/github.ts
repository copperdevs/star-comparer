export type UserData = {
  username: string;
  stars: number;
};

// TODO: merge getAllUserStars and userExists into one function
export async function getAllUserStars(username: string): Promise<number> {
  try {
    const response = await fetch(
      `https://api.github-star-counter.workers.dev/user/${username}`
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return data.stars;
  } catch (error) {
    console.error("Error fetching GitHub stars:", error);
    throw error;
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
