import { createServerFn } from "@tanstack/react-start";
import type { NewTask } from "@/lib/db/schema";
import { createTaskSchema } from "@/lib/db/schema";
import { taskService } from "@/lib/db/services/task-service";
import { zodErrorToAppError } from "@/lib/errors";
import { err } from "@/lib/result";
import type { TaskQuery } from "@/lib/validation/task-query-validation";

export const getTotalTaskCount = createServerFn({ method: "GET" }).handler(
  async () => {
    const result = await taskService.getTotalCount();
    return result;
  },
);

export const getStatusCounts = createServerFn({ method: "GET" }).handler(
  async () => {
    const result = await taskService.getStatusCounts();
    return result;
  },
);

export const getPriorityCounts = createServerFn({ method: "GET" }).handler(
  async () => {
    const result = await taskService.getPriorityCounts();
    return result;
  },
);

export const getCompletedTaskCount = createServerFn({ method: "GET" }).handler(
  async () => {
    const result = await taskService.getCompletedCount();
    return result;
  },
);

export const getTasks = createServerFn({ method: "GET" })
  .inputValidator((data: { query: TaskQuery }) => data)
  .handler(async ({ data }) => {
    const result = await taskService.getTasksByQuery(data.query);
    return result;
  });

export const getTaskById = createServerFn({ method: "GET" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    const result = await taskService.getTask(data.id);
    return result;
  });

export const createTask = createServerFn({ method: "POST" })
  .inputValidator((data: NewTask) => data)
  .handler(async ({ data }) => {
    const parseResult = createTaskSchema.safeParse(data);
    if (!parseResult.success) {
      return err(zodErrorToAppError(parseResult.error));
    }
    const createTaskResult = await taskService.createTask(parseResult.data);
    return createTaskResult;
  });

export const updateTask = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number; data: NewTask }) => data)
  .handler(async ({ data }) => {
    const parseResult = createTaskSchema.safeParse(data.data);
    if (!parseResult.success) {
      return err(zodErrorToAppError(parseResult.error));
    }
    const updateTaskResult = await taskService.updateTask(
      data.id,
      parseResult.data,
    );
    return updateTaskResult;
  });

export const deleteTask = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    const deleteTaskResult = await taskService.deleteTask(data.id);
    return deleteTaskResult;
  });
