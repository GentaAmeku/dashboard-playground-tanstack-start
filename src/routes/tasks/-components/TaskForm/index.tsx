import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DescriptionField } from "./components/DescriptionField";
import { NameField } from "./components/NameField";
import { PriorityField } from "./components/PriorityField";
import { StatusField } from "./components/StatusField";
import SubmitFormError from "./components/SubmitFormError";
import type { FormType } from "./hooks/useTaskForm";

interface TaskFormProps {
  form: FormType;
}

export function TaskForm({ form }: TaskFormProps) {
  return (
    // TODO: Progressive Enhancement
    <form
      id="task-form"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <SubmitFormError form={form} />
      <NameField form={form} />
      <DescriptionField form={form} />
      <StatusField form={form} />
      <PriorityField form={form} />
      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" asChild>
          <Link to="/tasks">Cancel</Link>
        </Button>
        <form.Subscribe
          selector={(state) => [
            state.isDirty,
            state.canSubmit,
            state.isSubmitting,
          ]}
        >
          {([isDirty, canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!isDirty || !canSubmit || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
