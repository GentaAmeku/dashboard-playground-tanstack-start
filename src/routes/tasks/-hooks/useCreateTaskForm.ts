import { createTask } from "@/lib/server/tasks";
import { useTaskForm } from "@/routes/tasks/-components/TaskForm/hooks/useTaskForm";

export function useCreateTaskForm() {
  const form = useTaskForm({
    onSubmit: (value) => createTask({ data: value }),
  });

  return form;
}
