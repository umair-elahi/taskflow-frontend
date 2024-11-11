export interface API<T> {
  meta: APIMeta;
  data: T;
}

export interface APIMeta {
  limit: number;
  message: string;
  offset: number;
  status: number;
  totalCount: number;
}
