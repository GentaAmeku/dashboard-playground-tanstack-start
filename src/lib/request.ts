import { apiError, unknownError } from "./errors";
import type { Result } from "./result";
import { err, ok } from "./result";

export async function request<T>(
  url: string,
  options?: RequestInit,
): Promise<Result<T>> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return err(apiError(res.statusText, res.status));
    const data = await res.json();
    return ok(data);
  } catch {
    return err(unknownError("An unknown error occurred"));
  }
}
