import { STATUS_LABELS, type Task } from "@/lib/db/schema";
import StatusIcon from "./StatusIcon";

interface StatusProps {
  status: Task["status"];
}

export default function Status({ status }: StatusProps) {
  return (
    <div className="flex items-center gap-2">
      <StatusIcon status={status} />
      {status && <p>{STATUS_LABELS[status]}</p>}
    </div>
  );
}
