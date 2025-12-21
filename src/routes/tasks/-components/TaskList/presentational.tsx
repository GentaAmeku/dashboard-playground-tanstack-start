import type { Task } from "@/lib/db/schema";
import type { AppError } from "@/lib/errors";
import TaskItem from "./components/TaskItem";

interface TaskListProps {
  tasks: Task[];
  error: AppError | undefined;
}

export default function TaskList({ tasks, error }: TaskListProps) {
  return (
    <div>
      <div className="grid grid-cols-[1fr_120px_120px_40px] gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b border-border">
        <div>Task</div>
        <div>Status</div>
        <div>Priority</div>
        <div></div>
      </div>
      <ul className="divide-y divide-border">
        {error && (
          <li className="py-4">
            <div className="text-destructive text-sm">{error.message}</div>
          </li>
        )}
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            id={task.id}
            name={task.name}
            description={task.description}
            status={task.status}
            priority={task.priority}
          />
        ))}
      </ul>
    </div>
  );
}
