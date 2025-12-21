import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TaskStatus } from "@/lib/db/schema";
import FieldErrorMessage from "@/routes/tasks/-components/TaskForm/components/FieldErrorMessage";
import type { FormType } from "@/routes/tasks/-components/TaskForm/hooks/useTaskForm";
import { STATUS_OPTIONS } from "@/routes/tasks/-constants";

interface StatusFieldProps {
  form: FormType;
}

export function StatusField({ form }: StatusFieldProps) {
  return (
    <form.Field name="status">
      {(field) => {
        return (
          <>
            <Label htmlFor="status">Status</Label>
            <input
              type="hidden"
              name={field.name}
              value={field.state.value ?? ""}
            />
            <Select
              value={field.state.value ?? undefined}
              onValueChange={(value: TaskStatus) => field.handleChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldErrorMessage field={field} />
          </>
        );
      }}
    </form.Field>
  );
}
