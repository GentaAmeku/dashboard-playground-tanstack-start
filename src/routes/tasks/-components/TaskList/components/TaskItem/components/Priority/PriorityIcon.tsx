import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react";
import type { Task } from "@/lib/db/schema";
import { PRIORITY } from "@/lib/db/schema";

interface PriorityIconProps {
  priority: Task["priority"];
}

export default function PriorityIcon({ priority }: PriorityIconProps) {
  if (priority === PRIORITY.LOW)
    return <ArrowDownIcon size={16} className="text-muted-foreground" />;

  if (priority === PRIORITY.MEDIUM)
    return <ArrowRightIcon size={16} className="text-muted-foreground" />;

  if (priority === PRIORITY.HIGH)
    return <ArrowUpIcon size={16} className="text-muted-foreground" />;

  return <ArrowUpIcon size={16} className="text-muted-foreground" />;
}
