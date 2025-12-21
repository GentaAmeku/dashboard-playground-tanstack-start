import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { TaskPriority } from "@/lib/db/schema";
import FieldErrorMessage from "@/routes/tasks/-components/TaskForm/components/FieldErrorMessage";
import type { FormType } from "@/routes/tasks/-components/TaskForm/hooks/useTaskForm";
import { PRIORITY_OPTIONS } from "@/routes/tasks/-constants";

interface PriorityFieldProps {
  form: FormType;
}

export function PriorityField({ form }: PriorityFieldProps) {
  return (
    <form.Field name="priority">
      {(field) => {
        return (
          <>
            <Label htmlFor="priority">Priority</Label>
            <fieldset className="space-y-2">
              <input
                type="hidden"
                name={field.name}
                value={field.state.value ?? ""}
              />
              <RadioGroup
                value={field.state.value ?? undefined}
                onValueChange={(value: TaskPriority) =>
                  field.handleChange(value)
                }
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <RadioGroupItem
                      value={option.value}
                      id={`priority-${option.value}`}
                    />
                    <label
                      htmlFor={`priority-${option.value}`}
                      className="cursor-pointer text-sm"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
              <FieldErrorMessage field={field} />
            </fieldset>
          </>
        );
      }}
    </form.Field>
  );
}
