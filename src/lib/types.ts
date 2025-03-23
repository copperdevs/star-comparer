export type UserData = {
  exists: boolean;
  username: string;
  stars: number;
};

export type Data<T> = {
  data: T;
  hasError: boolean;
  error: string;
};
