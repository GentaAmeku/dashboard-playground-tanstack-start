import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

/* ------------------------------ Constants ------------------------------ */

export const STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

/* ------------------------------ Schema ------------------------------ */

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status", {
    enum: [
      STATUS.PENDING,
      STATUS.IN_PROGRESS,
      STATUS.COMPLETED,
      STATUS.CANCELLED,
    ],
  })
    .notNull()
    .default(STATUS.PENDING),
  priority: text("priority", {
    enum: [PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH],
  })
    .notNull()
    .default(PRIORITY.MEDIUM),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
});

/* ------------------------------ Validation schemas ------------------------------ */

export const insertTaskSchema = createInsertSchema(tasks, {
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name must be 200 characters or less")
    .trim(),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .trim()
    .nullable(),
  status: z.enum([
    STATUS.PENDING,
    STATUS.IN_PROGRESS,
    STATUS.COMPLETED,
    STATUS.CANCELLED,
  ]),
  priority: z.enum([PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH]),
});

export const selectTaskSchema = createSelectSchema(tasks);

export const updateTaskSchema = insertTaskSchema
  .partial()
  .omit({ id: true, createdAt: true, updatedAt: true });

export const createTaskSchema = insertTaskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/* ------------------------------ Types ------------------------------ */

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type TaskStatus = (typeof STATUS)[keyof typeof STATUS];
export type TaskPriority = (typeof PRIORITY)[keyof typeof PRIORITY];
