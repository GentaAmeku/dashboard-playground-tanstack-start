"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PRIORITY_LABELS, type TaskPriority } from "@/lib/db/schema";
import { PRIORITY_OPTIONS } from "@/routes/tasks/-constants";

interface PriorityFilterProps {
  selectedPriority: TaskPriority | undefined;
  onPriorityChange: (priority: TaskPriority | undefined) => void;
}

export default function PriorityFilter({
  selectedPriority,
  onPriorityChange,
}: PriorityFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          {selectedPriority ? PRIORITY_LABELS[selectedPriority] : "Priority"}
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onPriorityChange(undefined)}>
          All
        </DropdownMenuItem>
        {PRIORITY_OPTIONS.map(({ value, label }) => (
          <DropdownMenuItem key={value} onClick={() => onPriorityChange(value)}>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
