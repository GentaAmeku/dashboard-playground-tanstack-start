import {
  PRIORITY,
  PRIORITY_LABELS,
  STATUS,
  STATUS_LABELS,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/db/schema";

export const STATUS_OPTIONS: { value: TaskStatus; label: string }[] =
  Object.values(STATUS).map((status) => ({
    value: status,
    label: STATUS_LABELS[status],
  }));

export const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] =
  Object.values(PRIORITY).map((priority) => ({
    value: priority,
    label: PRIORITY_LABELS[priority],
  }));
