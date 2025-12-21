import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import DeleteTaskDialog from "@/routes/tasks/-components/DeleteTaskDialog";
import TaskFilters from "@/routes/tasks/-components/TaskFilters";
import TaskList from "@/routes/tasks/-components/TaskList/container";
import TaskListSkeleton from "@/routes/tasks/-components/TaskListSkeleton";

export const Route = createFileRoute("/tasks/")({
  component: TasksIndexComponent,
});

export default function TasksIndexComponent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
        </div>
        <div className="flex items-center">
          <Button className="space-x-1" asChild>
            <Link to="/tasks/create">
              <span>Create</span> <Plus size={18} />
            </Link>
          </Button>
        </div>
      </div>
      <TaskFilters />
      <Suspense fallback={<TaskListSkeleton />}>
        <TaskList />
      </Suspense>
      <DeleteTaskDialog />
    </div>
  );
}
