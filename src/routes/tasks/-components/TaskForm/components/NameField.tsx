import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FieldErrorMessage from "@/routes/tasks/-components/TaskForm/components/FieldErrorMessage";
import type { FormType } from "@/routes/tasks/-components/TaskForm/hooks/useTaskForm";

interface NameFieldProps {
  form: FormType;
}

export function NameField({ form }: NameFieldProps) {
  return (
    <form.Field name="name">
      {(field) => {
        return (
          <>
            <Label htmlFor="name">Title</Label>
            <Input
              name={field.name}
              value={field.state.value ?? ""}
              placeholder="Enter a title"
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldErrorMessage field={field} />
          </>
        );
      }}
    </form.Field>
  );
}
