import { formOptions } from "@tanstack/react-form-start";
import type { z } from "zod";
import {
  createTaskSchema,
  PRIORITY,
  STATUS,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/db/schema";

export type FormValues = z.infer<typeof createTaskSchema>;

const defaultValues: FormValues = {
  name: "",
  description: null as string | null,
  status: STATUS.PENDING as TaskStatus,
  priority: PRIORITY.MEDIUM as TaskPriority,
};

export const createFormOpts = (initialValues?: Partial<FormValues>) =>
  formOptions({
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    },
    validators: {
      onChange: createTaskSchema,
    },
  });
