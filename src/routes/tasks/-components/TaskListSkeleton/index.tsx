import { Skeleton } from "@/components/ui/skeleton";

export default function TaskListSkeleton() {
  return (
    <ul className="divide-y divide-border">
      {Array.from({ length: 5 }, (_, i) => i).map((num) => (
        <li key={num} className="py-4">
          <div className="grid grid-cols-[1fr_120px_120px_40px] gap-4 items-center px-4">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="flex items-center justify-end">
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
