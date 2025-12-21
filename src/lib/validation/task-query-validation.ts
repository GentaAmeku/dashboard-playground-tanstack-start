import { z } from "zod";
import { PRIORITY, STATUS } from "@/lib/db/schema";
import { zodErrorToAppError } from "@/lib/errors";
import { err, ok } from "@/lib/result";

export const taskQuerySchema = z.object({
  name: z.string().trim().optional(),
  status: z
    .enum([
      STATUS.PENDING,
      STATUS.IN_PROGRESS,
      STATUS.COMPLETED,
      STATUS.CANCELLED,
    ])
    .optional(),
  priority: z.enum([PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH]).optional(),
});

export type TaskQuery = z.infer<typeof taskQuerySchema>;

export const validateTaskQuery = (data: TaskQuery) => {
  const result = taskQuerySchema.safeParse(data);

  if (!result.success) {
    return err(zodErrorToAppError(result.error));
  }

  return ok(result.data);
};
