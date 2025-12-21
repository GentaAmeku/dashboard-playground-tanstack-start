import { useStore } from "@tanstack/react-form";
import type { FormType } from "@/routes/tasks/-components/TaskForm/hooks/useTaskForm";

interface SubmitFormErrorProps {
  form: FormType;
}

export default function SubmitFormError({ form }: SubmitFormErrorProps) {
  const submitError = useStore(form.store, (s) => s.errorMap?.onSubmit);
  if (!submitError) return null;
  return <p className="text-destructive text-sm">{submitError}</p>;
}
