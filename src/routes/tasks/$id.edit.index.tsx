import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getTaskByIdQueryOptions } from "@/lib/cache/query-options";
import type { Task } from "@/lib/db/schema";
import { isErr } from "@/lib/result";
import { TaskForm } from "@/routes/tasks/-components/TaskForm";
import { useEditTaskForm } from "@/routes/tasks/-hooks/useEditTaskForm";
import { Route as EditRoute } from "@/routes/tasks/$id.edit.route";

export const Route = createFileRoute("/tasks/$id/edit/")({
  component: TasksEditIndexComponent,
});

function TaskEditForm({ task }: { task: Task }) {
  const form = useEditTaskForm(task);
  return <TaskForm form={form} />;
}

export default function TasksEditIndexComponent() {
  const { id } = EditRoute.useParams();
  const { data: result } = useSuspenseQuery(
    getTaskByIdQueryOptions(Number.parseInt(id, 10)),
  );
  if (isErr(result)) {
    return <p className="text-destructive text-sm">{result.error.message}</p>;
  }

  return <TaskEditForm task={result.value} />;
}
