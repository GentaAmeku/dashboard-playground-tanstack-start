import type { z } from "zod";

/* ------------------------------ Types ------------------------------ */

export type AppError =
  | { type: "API_ERROR"; message: string; httpStatus?: number | string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "UNKNOWN_ERROR"; message: string }
  | {
      type: "VALIDATION_ERROR";
      message: string;
      fields?: string[];
      issues?: Array<{ path: (string | number)[]; message: string }>;
    };

/* ------------------------------ Helpers ------------------------------ */

export const apiError = (
  message: string,
  httpStatus?: number | string,
): AppError => ({
  type: "API_ERROR",
  message,
  httpStatus,
});

export const databaseError = (message: string): AppError => ({
  type: "DATABASE_ERROR",
  message,
});

export const unknownError = (message: string): AppError => ({
  type: "UNKNOWN_ERROR",
  message,
});

export const validationError = (
  message: string,
  fields?: string[],
): AppError => ({
  type: "VALIDATION_ERROR",
  message,
  fields,
});

export const zodErrorToAppError = (zodError: z.ZodError): AppError => {
  const fields = zodError.issues.map((issue) => issue.path.join("."));
  const message = zodError.issues.map((issue) => issue.message).join(", ");
  const issues = zodError.issues.map((issue) => ({
    path: issue.path.filter(
      (p): p is string | number =>
        typeof p === "string" || typeof p === "number",
    ),
    message: issue.message,
  }));

  return {
    type: "VALIDATION_ERROR",
    message,
    fields,
    issues,
  };
};
