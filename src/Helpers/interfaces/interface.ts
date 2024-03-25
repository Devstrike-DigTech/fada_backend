interface IFadaResponse<T> {
  msg: string;
  data: T[] | T;
  status_code: string;
}
