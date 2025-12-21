import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/tasks/create")({
  component: TasksCreateComponent,
});

export default function TasksCreateComponent() {
  return <Outlet />;
}
