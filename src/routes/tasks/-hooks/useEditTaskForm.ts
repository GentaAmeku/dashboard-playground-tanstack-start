import type { Task } from "@/lib/db/schema";
import { updateTask } from "@/lib/server/tasks";
import { useTaskForm } from "@/routes/tasks/-components/TaskForm/hooks/useTaskForm";

export function useEditTaskForm(task: Task) {
  const form = useTaskForm({
    defaultValues: {
      name: task.name,
      description: task.description,
      status: task.status,
      priority: task.priority,
    },
    onSubmit: (value) => updateTask({ data: { id: task.id, data: value } }),
  });

  return form;
}
