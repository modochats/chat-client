interface AppOptions {
  chatbotUuid: string;
  userUuid: string;
}
interface FetchPaginationRes<T = any> {
  results: T[];
  next: string | null;
  prev: string | null;
  count: number;
}
export {AppOptions, FetchPaginationRes};
