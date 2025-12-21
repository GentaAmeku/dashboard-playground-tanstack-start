"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STATUS_LABELS, type TaskStatus } from "@/lib/db/schema";
import { STATUS_OPTIONS } from "@/routes/tasks/-constants";

interface StatusFilterProps {
  selectedStatus: TaskStatus | undefined;
  onStatusChange: (status: TaskStatus | undefined) => void;
}

export default function StatusFilter({
  selectedStatus,
  onStatusChange,
}: StatusFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          {selectedStatus ? STATUS_LABELS[selectedStatus] : "Status"}
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onStatusChange(undefined)}>
          All
        </DropdownMenuItem>
        {STATUS_OPTIONS.map(({ value, label }) => (
          <DropdownMenuItem key={value} onClick={() => onStatusChange(value)}>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
