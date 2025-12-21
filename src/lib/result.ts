import type { AppError } from "@/lib/errors";

/* ------------------------------ Types ------------------------------ */

export type Ok<T> = {
  ok: true;
  value: T;
};

export type Err<E = AppError> = {
  ok: false;
  error: E;
};

export type Result<T, E = AppError> = Ok<T> | Err<E>;

/* ------------------------------ Helpers ------------------------------ */

export const ok = <T>(value: T): Ok<T> => ({
  ok: true,
  value,
});

export const err = <E = AppError>(error: E): Err<E> => ({
  ok: false,
  error,
});

export const isOk = <T, E = AppError>(result: Result<T, E>): result is Ok<T> =>
  result.ok;

export const isErr = <T, E = AppError>(
  result: Result<T, E>,
): result is Err<E> => !result.ok;

export const unwrap = <T, E>(result: Result<T, E>): T => {
  if (result.ok) {
    return result.value;
  }
  throw result.error;
};

export const isResult = <T>(value: unknown): value is Result<T> =>
  value !== null &&
  typeof value === "object" &&
  "ok" in value &&
  "error" in value;
