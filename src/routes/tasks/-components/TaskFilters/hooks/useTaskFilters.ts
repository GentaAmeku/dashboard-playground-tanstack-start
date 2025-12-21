"use client";

import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import type { TaskPriority, TaskStatus } from "@/lib/db/schema";
import { Route as TasksRoute } from "@/routes/tasks/route";

export function useTaskFilters() {
  const searchParams = TasksRoute.useSearch();
  const navigate = TasksRoute.useNavigate();

  const [searchValue, setSearchValue] = useState(searchParams.name ?? "");

  const debouncedNavigate = useDebouncedCallback(
    (value: string) => {
      navigate({
        search: (prev) => ({ ...prev, name: value || undefined }),
      });
    },
    500,
    { leading: false },
  );

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    debouncedNavigate(value);
  };

  const handleStatusChange = (value: TaskStatus | undefined) => {
    navigate({
      search: (prev) => ({ ...prev, status: value ?? undefined }),
    });
  };

  const handlePriorityChange = (value: TaskPriority | undefined) => {
    navigate({
      search: (prev) => ({ ...prev, priority: value ?? undefined }),
    });
  };

  useEffect(() => {
    return () => {
      debouncedNavigate.cancel();
    };
  }, [debouncedNavigate]);

  useEffect(() => {
    setSearchValue(searchParams.name ?? "");
  }, [searchParams.name]);

  return {
    searchValue,
    selectedStatus: searchParams.status,
    selectedPriority: searchParams.priority,
    handleSearchChange,
    handleStatusChange,
    handlePriorityChange,
  };
}
