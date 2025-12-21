"use client";

import PriorityFilter from "./components/PriorityFilter";
import SearchFilter from "./components/SearchFilter";
import StatusFilter from "./components/StatusFilter";
import { useTaskFilters } from "./hooks/useTaskFilters";

export default function TaskFilters() {
  const taskFilters = useTaskFilters();
  return (
    <div className="flex items-center gap-2 mb-4">
      <SearchFilter
        searchValue={taskFilters.searchValue}
        onSearchChange={taskFilters.handleSearchChange}
      />
      <StatusFilter
        selectedStatus={taskFilters.selectedStatus}
        onStatusChange={taskFilters.handleStatusChange}
      />
      <PriorityFilter
        selectedPriority={taskFilters.selectedPriority}
        onPriorityChange={taskFilters.handlePriorityChange}
      />
    </div>
  );
}
