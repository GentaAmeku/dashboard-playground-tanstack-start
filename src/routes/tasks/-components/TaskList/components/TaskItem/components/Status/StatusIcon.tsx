import {
  CheckCircleIcon,
  CircleIcon,
  ClockIcon,
  XCircleIcon,
} from "lucide-react";
import type { Task } from "@/lib/db/schema";
import { STATUS } from "@/lib/db/schema";

interface StatusIconProps {
  status: Task["status"];
}

export default function StatusIcon({ status }: StatusIconProps) {
  if (status === STATUS.IN_PROGRESS)
    return <ClockIcon size={16} className="text-muted-foreground" />;

  if (status === STATUS.COMPLETED)
    return <CheckCircleIcon size={16} className="text-muted-foreground" />;

  if (status === STATUS.CANCELLED)
    return <XCircleIcon size={16} className="text-muted-foreground" />;

  if (status === STATUS.PENDING)
    return <CircleIcon size={16} className="text-muted-foreground" />;

  return <CircleIcon size={16} className="text-muted-foreground" />;
}
