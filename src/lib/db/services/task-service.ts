import { taskRepository } from "@/lib/db/repositories/task-repository";
import type { NewTask } from "@/lib/db/schema";
import { isErr } from "@/lib/result";
import {
  type TaskQuery,
  validateTaskQuery,
} from "@/lib/validation/task-query-validation";
import {
  validateTaskData,
  validateTaskUpdate,
} from "@/lib/validation/task-validation";

export const taskService = {
  getTotalCount: () => taskRepository.getTotalCount(),

  getStatusCounts: () => taskRepository.getStatusCounts(),

  getPriorityCounts: () => taskRepository.getPriorityCounts(),

  getCompletedCount: () => taskRepository.getCompletedCount(),

  getAllTasks: () => taskRepository.getAll(),

  getTasksByQuery: async (query: TaskQuery) => {
    const validationResult = validateTaskQuery(query);
    if (isErr(validationResult)) return validationResult;
    return taskRepository.getByQuery(validationResult.value);
  },

  getTask: (id: number) => taskRepository.getById(id),

  createTask: async (taskData: Partial<NewTask>) => {
    const validatedResult = validateTaskData(taskData);
    if (isErr(validatedResult)) return validatedResult;
    return taskRepository.create(validatedResult.value);
  },

  updateTask: async (id: number, taskData: Partial<NewTask>) => {
    const validatedResult = validateTaskUpdate(taskData);
    if (isErr(validatedResult)) return validatedResult;

    const existingResult = await taskRepository.getById(id);
    if (isErr(existingResult)) return existingResult;

    return await taskRepository.update(id, validatedResult.value);
  },

  deleteTask: (id: number) => taskRepository.delete(id),
};
