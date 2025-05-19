import { ContentfulStatusCode } from "hono/utils/http-status";

export type Success<T> = {
  success: true;
  data: T;
  error?: never;
};

export type Failure<E> = {
  success: false;
  data?: never;
  error: E;
};

export type ResultType<T, E = Error> = Success<T> | Failure<E>;

export const Result = {
  async tryCatch<T, E = Error>(promise: Promise<T>): Promise<ResultType<T, E>> {
    try {
      const data = await promise;
      return { data, error: undefined, success: true };
    } catch (error) {
      return { data: undefined, error: error as E, success: false };
    }
  },
  ok<T>(data: T): Success<T> {
    return {
      data,
      success: true,
      error: undefined,
    };
  },
  err<E = Error>(error: E): Failure<E> {
    return {
      success: false,
      data: undefined,
      error,
    };
  },
  apiErr<S extends ContentfulStatusCode, M extends string>(
    status: S,
    message: M,
  ): Failure<{ status: S; message: M }> {
    return Result.err({ status, message });
  },
};
