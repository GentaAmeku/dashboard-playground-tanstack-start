"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { invalidateTaskQueries } from "@/lib/cache/query-options";
import { isErr } from "@/lib/result";
import { deleteTask } from "@/lib/server/tasks";
import { useDeleteTaskDialogStore } from "@/routes/tasks/-stores/delete-task-dialog-store";

export default function DeleteTaskDialog() {
  const { isOpen, taskId, taskName, close } = useDeleteTaskDialogStore();
  const queryClient = useQueryClient();
  const { mutateAsync: deleteTaskMutation, isPending } = useMutation({
    mutationFn: deleteTask,
    onSuccess: async (result) => {
      if (isErr(result)) return;
      await invalidateTaskQueries(queryClient);
      close();
    },
  });

  const handleDelete = async () => {
    if (taskId === null) return;
    await deleteTaskMutation({ data: { id: taskId } });
  };

  if (taskId === null || taskName === null) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this task: {taskName} ?</DialogTitle>
          <DialogDescription>
            You are about to delete a task with the ID TASK-{taskId}. This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
