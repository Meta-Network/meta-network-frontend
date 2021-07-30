export interface axiosResult<T>  {
  statusCode: number,
  message: string,
  data: T
}