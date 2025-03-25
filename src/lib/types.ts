export type Data<T> = {
  data: T;
  hasError: boolean;
  error: string;
};

export type GithubStarsApiResponse = {
  forks: number;
  stars: number;
};

export type GitHubRepoApiResponse = {
  forks: number;
  stargazers_count: number;
};
