interface AppOptions {
  chatbotUuid: string;
  userData: {uuid: string; phoneNumber?: string};
  conversationUUid?: string;
  debug?: boolean;
}
interface FetchPaginationRes<T = any> {
  results: T[];
  next: string | null;
  prev: string | null;
  count: number;
}
export type {AppOptions, FetchPaginationRes};
