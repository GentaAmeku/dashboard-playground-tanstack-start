import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getTaskByIdQueryOptions } from "@/lib/cache/query-options";

export const Route = createFileRoute("/tasks/$id/edit")({
  loader: async ({ context, params }) => {
    context.queryClient.ensureQueryData(
      getTaskByIdQueryOptions(Number.parseInt(params.id, 10)),
    );
  },
  component: TasksEditComponent,
});

export default function TasksEditComponent() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">Edit Task</h2>
        <p className="text-muted-foreground">
          Update task information. Click save when you're done.
        </p>
      </div>
      <Outlet />
    </div>
  );
}
