interface AppOptions {
  chatbotUuid: string;
  userData: {uuid: string; phoneNumber?: string};
  conversationUUid?: string;
}
interface FetchPaginationRes<T = any> {
  results: T[];
  next: string | null;
  prev: string | null;
  count: number;
}
export {AppOptions, FetchPaginationRes};
