import { useSuspenseQuery } from "@tanstack/react-query";
import { getTasksQueryOptions } from "@/lib/cache/query-options";
import { isErr, isOk } from "@/lib/result";
import { Route as TasksRoute } from "@/routes/tasks/route";
import TaskListPresentational from "./presentational";

export default function TaskListContainer() {
  const deps = TasksRoute.useLoaderDeps();
  const { data: result } = useSuspenseQuery(getTasksQueryOptions(deps));
  const tasks = isOk(result) ? result.value : [];
  const error = isErr(result) ? result.error : undefined;
  return <TaskListPresentational tasks={tasks} error={error} />;
}
