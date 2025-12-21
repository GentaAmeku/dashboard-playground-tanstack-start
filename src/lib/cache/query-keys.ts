import type { TaskQuery } from "../validation/task-query-validation";

const tasks = ["tasks"] as const;

export const queryKeys = {
  tasks: {
    all: tasks,
    list: (query?: TaskQuery) =>
      query ? [...tasks, "list", query] : [...tasks, "list"],
    detail: (id: number) => [...tasks, "detail", id],
    totalCount: () => [...tasks, "totalCount"],
    statusCounts: () => [...tasks, "statusCounts"],
    priorityCounts: () => [...tasks, "priorityCounts"],
    completedCount: () => [...tasks, "completedCount"],
  },
} as const;
