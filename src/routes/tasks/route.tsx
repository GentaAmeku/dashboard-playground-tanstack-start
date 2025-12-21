import { createFileRoute, Outlet } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

import { getTasksQueryOptions } from "@/lib/cache/query-options";
import { taskQuerySchema } from "@/lib/validation/task-query-validation";

export const Route = createFileRoute("/tasks")({
  component: TasksComponent,
  validateSearch: zodValidator(taskQuerySchema),
  loaderDeps: ({ search: { name, status, priority } }) => ({
    name,
    status,
    priority,
  }),
  loader: ({ context, deps }) => {
    context.queryClient.ensureQueryData(getTasksQueryOptions(deps));
  },
});

export default function TasksComponent() {
  return <Outlet />;
}
