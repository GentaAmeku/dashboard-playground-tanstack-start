import { and, count, desc, eq, like } from "drizzle-orm";
import { getDB } from "@/lib/db/client";
import type { NewTask } from "@/lib/db/schema";
import * as schema from "@/lib/db/schema";
import { apiError, databaseError } from "@/lib/errors";
import { err, ok } from "@/lib/result";
import type { TaskQuery } from "@/lib/validation/task-query-validation";

export const taskRepository = {
  getTotalCount: async () => {
    try {
      const db = getDB();
      const [result] = await db.select({ count: count() }).from(schema.tasks);
      return ok(result?.count ?? 0);
    } catch {
      return err(databaseError("Failed to fetch total task count"));
    }
  },

  getStatusCounts: async () => {
    try {
      const db = getDB();
      const statusCounts = await db
        .select({
          status: schema.tasks.status,
          count: count(),
        })
        .from(schema.tasks)
        .groupBy(schema.tasks.status);

      const statusMap = statusCounts.reduce(
        (acc, item) => {
          acc[item.status] = item.count;
          return acc;
        },
        {} as Record<string, number>,
      );

      return ok(statusMap);
    } catch {
      return err(databaseError("Failed to fetch status counts"));
    }
  },

  getPriorityCounts: async () => {
    try {
      const db = getDB();
      const priorityCounts = await db
        .select({
          priority: schema.tasks.priority,
          count: count(),
        })
        .from(schema.tasks)
        .groupBy(schema.tasks.priority);

      const priorityMap = priorityCounts.reduce(
        (acc, item) => {
          acc[item.priority] = item.count;
          return acc;
        },
        {} as Record<string, number>,
      );

      return ok(priorityMap);
    } catch {
      return err(databaseError("Failed to fetch priority counts"));
    }
  },

  getCompletedCount: async () => {
    try {
      const db = getDB();
      const [result] = await db
        .select({ count: count() })
        .from(schema.tasks)
        .where(eq(schema.tasks.status, "completed"));
      return ok(result?.count ?? 0);
    } catch {
      return err(databaseError("Failed to fetch completed task count"));
    }
  },

  getAll: async () => {
    try {
      const db = getDB();
      const tasks = await db
        .select()
        .from(schema.tasks)
        .orderBy(desc(schema.tasks.createdAt));
      return ok(tasks);
    } catch {
      return err(databaseError("Failed to fetch tasks"));
    }
  },

  getByQuery: async (query: TaskQuery) => {
    try {
      const db = getDB();
      const conditions = [];
      if (query.name && query.name.trim() !== "") {
        conditions.push(like(schema.tasks.name, `%${query.name.trim()}%`));
      }
      if (query.status) {
        conditions.push(eq(schema.tasks.status, query.status));
      }
      if (query.priority) {
        conditions.push(eq(schema.tasks.priority, query.priority));
      }
      const tasks = await db
        .select()
        .from(schema.tasks)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(schema.tasks.createdAt));

      return ok(tasks);
    } catch {
      return err(databaseError("Failed to fetch tasks by query"));
    }
  },

  getById: async (id: number) => {
    try {
      const db = getDB();
      const [task] = await db
        .select()
        .from(schema.tasks)
        .where(eq(schema.tasks.id, id));

      if (!task) {
        return err(apiError(`Task with id ${id} not found`, 404));
      }

      return ok(task);
    } catch {
      return err(databaseError("Failed to find task"));
    }
  },

  create: async (taskData: NewTask) => {
    try {
      const db = getDB();
      const [task] = await db.insert(schema.tasks).values(taskData).returning();
      return ok(task);
    } catch {
      return err(databaseError("Failed to create task"));
    }
  },

  update: async (id: number, taskData: Partial<NewTask>) => {
    try {
      const db = getDB();
      const [updated] = await db
        .update(schema.tasks)
        .set(taskData)
        .where(eq(schema.tasks.id, id))
        .returning();

      if (!updated) return err(apiError(`Task with id ${id} not found`, 404));

      return ok(updated);
    } catch {
      return err(databaseError("Failed to update task"));
    }
  },

  delete: async (id: number) => {
    try {
      const db = getDB();
      const deleted = await db
        .delete(schema.tasks)
        .where(eq(schema.tasks.id, id))
        .returning();

      if (deleted.length === 0)
        return err(apiError(`Task with id ${id} not found`, 404));

      return ok(undefined);
    } catch {
      return err(databaseError("Failed to delete task"));
    }
  },
};
