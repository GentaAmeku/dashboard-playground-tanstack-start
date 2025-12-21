import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FieldErrorMessage from "@/routes/tasks/-components/TaskForm/components/FieldErrorMessage";
import type { FormType } from "@/routes/tasks/-components/TaskForm/hooks/useTaskForm";

interface DescriptionFieldProps {
  form: FormType;
}

export function DescriptionField({ form }: DescriptionFieldProps) {
  return (
    <form.Field name="description">
      {(field) => {
        return (
          <>
            <Label htmlFor="description">Description</Label>
            <Textarea
              name={field.name}
              value={field.state.value ?? ""}
              placeholder="Enter a description (optional)"
              rows={4}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            <FieldErrorMessage field={field} />
          </>
        );
      }}
    </form.Field>
  );
}
