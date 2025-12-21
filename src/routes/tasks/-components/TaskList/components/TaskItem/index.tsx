import { Link } from "@tanstack/react-router";
import { MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Task } from "@/lib/db/schema";
import { DeleteMenuItem } from "./components/DeleteMenuItem";
import Priority from "./components/Priority";
import Status from "./components/Status";

interface TaskItemProps {
  id: Task["id"];
  name: Task["name"];
  description: Task["description"];
  status: Task["status"];
  priority: Task["priority"];
}

export default function TaskItem({
  id,
  name,
  description,
  status,
  priority,
}: TaskItemProps) {
  return (
    <li className="py-4">
      <div className="grid grid-cols-[1fr_120px_120px_40px] gap-4 items-center px-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-medium">{name}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center">
          <Status status={status} />
        </div>
        <div className="flex items-center">
          <Priority priority={priority} />
        </div>
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  to="/tasks/$id/edit"
                  params={{ id: id.toString() }}
                  className="flex items-center"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DeleteMenuItem taskId={id} taskName={name} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </li>
  );
}
