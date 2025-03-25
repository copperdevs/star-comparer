import type { GitHubRepoApiResponse, GithubStarsApiResponse } from ".";

export async function calculateStars(
  username: string
): Promise<GithubStarsApiResponse> {
  const resp = await github(`/users/${username}`);
  const data = await resp.json();
  const pageCount = Math.ceil(data.public_repos / 100);
  const pages = [];
  for (let i = 0; i < pageCount; i++) {
    pages.push(i);
  }
  const result: GithubStarsApiResponse = {
    stars: 0,
    forks: 0,
  };
  await Promise.all(
    pages.map(async (p) => {
      const data = await getRepos(username, p);
      result.stars += data.stars;
      result.forks += data.forks;
    })
  );

  return result;
}

async function github(path: string): Promise<Response> {
  const GITHUB_API = "https://api.github.com";
  return fetch(`${GITHUB_API}${path}`, {
    headers: {
      "User-Agent": "Copper-GitHub-Star-Counter",
    },
    // @ts-ignore
    cf: { cacheTTl: 900 },
  });
}

async function getRepos(
  user: string,
  page: number
): Promise<GithubStarsApiResponse> {
  const path = `/users/${user}/repos?per_page=100&page=${page}`;
  const resp = await github(path);
  const repos: GitHubRepoApiResponse[] = await resp.json();
  return repos.reduce(
    (acc, cur) => {
      acc.stars += cur.stargazers_count;
      acc.forks += cur.forks;
      return acc;
    },
    { stars: 0, forks: 0 }
  );
}
