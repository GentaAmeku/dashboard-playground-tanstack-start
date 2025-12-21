import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CompletionRate from "./CompletionRate";
import PriorityCounts from "./PriorityCounts";
import StatusCounts from "./StatusCounts";
import TotalTaskCount from "./TotalTaskCount";

function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-32 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-16" />
      </CardContent>
    </Card>
  );
}

function StatusCountsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-32 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Array.from({ length: 4 }, (_, index) => `skeleton-${index}`).map(
            (key) => (
              <div key={key} className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-8" />
              </div>
            ),
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function TaskStatistics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Suspense fallback={<CardSkeleton />}>
        <TotalTaskCount />
      </Suspense>

      <Suspense fallback={<StatusCountsSkeleton />}>
        <StatusCounts />
      </Suspense>

      <Suspense fallback={<StatusCountsSkeleton />}>
        <PriorityCounts />
      </Suspense>

      <Suspense fallback={<CardSkeleton />}>
        <CompletionRate />
      </Suspense>
    </div>
  );
}
