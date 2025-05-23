import { ContentfulStatusCode } from "hono/utils/http-status";

export type Success<T> = {
  success: true;
  data: T;
  error: null;
};

export type Failure<E> = {
  success: false;
  data: null;
  error: E;
};

export type ResultType<T, E> = Success<T> | Failure<E>;

export const Result = {
  async tryCatch<T, E = Error>(promise: Promise<T>): Promise<ResultType<T, E>> {
    try {
      const data = await promise;
      return { data, error: null, success: true };
    } catch (error) {
      return { data: null, error: error as E, success: false };
    }
  },
  ok<T>(data: T): Success<T> {
    return {
      data,
      success: true,
      error: null,
    };
  },
  err<E>(error: E): Failure<E> {
    return {
      success: false,
      data: null,
      error,
    };
  },
  responseErr<S extends ContentfulStatusCode, M extends string, D = null>(
    code: S,
    message: M,
    details?: D,
  ): Failure<{ code: S; message: M; details: D }> {
    return Result.err({ code, message, details: details ?? (null as D) });
  },
};
