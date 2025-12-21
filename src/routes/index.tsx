import { createFileRoute } from "@tanstack/react-router";

import TaskStatistics from "@/components/TaskStatistics";
import {
  getCompletedTaskCountQueryOptions,
  getPriorityCountsQueryOptions,
  getStatusCountsQueryOptions,
  getTotalTaskCountQueryOptions,
} from "@/lib/cache/query-options";

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(getTotalTaskCountQueryOptions());
    context.queryClient.ensureQueryData(getStatusCountsQueryOptions());
    context.queryClient.ensureQueryData(getPriorityCountsQueryOptions());
    context.queryClient.ensureQueryData(getCompletedTaskCountQueryOptions());
  },
  component: RouteIndexComponent,
});

function RouteIndexComponent() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">タスクの統計情報を確認できます</p>
      </div>
      <TaskStatistics />
    </div>
  );
}
