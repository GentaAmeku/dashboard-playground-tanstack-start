import type { QueryClient } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import {
  getCompletedTaskCount,
  getPriorityCounts,
  getStatusCounts,
  getTaskById,
  getTasks,
  getTotalTaskCount,
} from "@/lib/server/tasks";
import type { TaskQuery } from "@/lib/validation/task-query-validation";
import { queryKeys } from "./query-keys";

export const getTotalTaskCountQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.tasks.totalCount(),
    queryFn: () => getTotalTaskCount(),
    retry: false,
  });

export const getStatusCountsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.tasks.statusCounts(),
    queryFn: () => getStatusCounts(),
    retry: false,
  });

export const getPriorityCountsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.tasks.priorityCounts(),
    queryFn: () => getPriorityCounts(),
    retry: false,
  });

export const getCompletedTaskCountQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.tasks.completedCount(),
    queryFn: () => getCompletedTaskCount(),
    retry: false,
  });

export const getTasksQueryOptions = (query: TaskQuery) =>
  queryOptions({
    queryKey: queryKeys.tasks.list(query),
    queryFn: () => getTasks({ data: { query } }),
    retry: false,
  });

export const getTaskByIdQueryOptions = (id: number) =>
  queryOptions({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => getTaskById({ data: { id } }),
    retry: false,
  });

export const invalidateTaskQueries = async (queryClient: QueryClient) => {
  await queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
};
