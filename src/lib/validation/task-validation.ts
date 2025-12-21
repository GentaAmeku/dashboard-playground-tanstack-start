import { z } from "zod";
import {
  createTaskSchema,
  insertTaskSchema,
  type NewTask,
  updateTaskSchema,
} from "@/lib/db/schema";
import { type AppError, zodErrorToAppError } from "@/lib/errors";
import { err, ok, type Result } from "@/lib/result";

export const validateTaskData = (
  data: Partial<NewTask>,
): Result<NewTask, AppError> => {
  const result = createTaskSchema.safeParse(data);

  if (!result.success) {
    return err(zodErrorToAppError(result.error));
  }

  return ok(result.data);
};

export const validateTaskUpdate = (
  data: unknown,
): Result<Partial<NewTask>, AppError> => {
  const result = updateTaskSchema.safeParse(data);

  if (!result.success) {
    return err(zodErrorToAppError(result.error));
  }

  return ok(result.data);
};

export const validateTaskInsert = (
  data: unknown,
): Result<NewTask, AppError> => {
  const result = insertTaskSchema.safeParse(data);

  if (!result.success) {
    return err(zodErrorToAppError(result.error));
  }

  return ok(result.data);
};

export const validateTaskName = (name: unknown): Result<string, AppError> => {
  const result = z
    .string()
    .transform((s) => s.trim())
    .pipe(
      z
        .string()
        .min(1, "Name is required")
        .max(200, "Name must be 200 characters or less"),
    )
    .safeParse(name);

  if (!result.success) {
    return err(zodErrorToAppError(result.error));
  }

  return ok(result.data);
};

export const validateTaskDescription = (
  description: unknown,
): Result<string | null, AppError> => {
  const result = z
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .trim()
    .nullable()
    .safeParse(description);

  if (!result.success) {
    return err(zodErrorToAppError(result.error));
  }

  return ok(result.data);
};
