import { PRIORITY_LABELS, type Task } from "@/lib/db/schema";
import PriorityIcon from "./PriorityIcon";

interface PriorityProps {
  priority: Task["priority"];
}

export default function Priority({ priority }: PriorityProps) {
  return (
    <div className="flex items-center gap-2">
      <PriorityIcon priority={priority} />
      {priority && <p>{PRIORITY_LABELS[priority]}</p>}
    </div>
  );
}
