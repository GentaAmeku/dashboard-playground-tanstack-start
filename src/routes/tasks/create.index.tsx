import { createFileRoute } from "@tanstack/react-router";
import { TaskForm } from "@/routes/tasks/-components/TaskForm";
import { useCreateTaskForm } from "@/routes/tasks/-hooks/useCreateTaskForm";

export const Route = createFileRoute("/tasks/create/")({
  component: TasksCreateIndexComponent,
});

export default function TasksCreateIndexComponent() {
  const form = useCreateTaskForm();
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">Create Task</h2>
        <p className="text-muted-foreground">
          Add a new task by providing necessary info. Click save when you're
          done.
        </p>
      </div>
      <TaskForm form={form} />
    </div>
  );
}
