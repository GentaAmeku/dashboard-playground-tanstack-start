import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { invalidateTaskQueries } from "@/lib/cache/query-options";
import type { Result } from "@/lib/result";
import { isErr } from "@/lib/result";
import {
  createFormOpts,
  type FormValues,
} from "@/routes/tasks/-components/TaskForm/isomorphic/form-isomorphic";

export type FormType = ReturnType<typeof useTaskForm>;

export type UseTaskFormOptions = {
  defaultValues?: Partial<FormValues>;
  onSubmit: (value: FormValues) => Promise<Result<unknown>>;
};

export function useTaskForm({ defaultValues, onSubmit }: UseTaskFormOptions) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm({
    ...createFormOpts(defaultValues),
    onSubmit: async ({ value }) => {
      const result = await onSubmit(value);

      if (isErr(result)) {
        form.setErrorMap({
          onSubmit: {
            form: result.error.message,
            fields: {},
          },
        });
        return;
      }

      await invalidateTaskQueries(queryClient);
      navigate({ to: "/tasks" });
    },
  });

  return form;
}
