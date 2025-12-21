import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPriorityCountsQueryOptions } from "@/lib/cache/query-options";
import { PRIORITY, PRIORITY_LABELS } from "@/lib/db/schema";
import { isErr } from "@/lib/result";

export default function PriorityCounts() {
  const { data: result } = useSuspenseQuery(getPriorityCountsQueryOptions());

  if (isErr(result)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>優先度別</CardTitle>
          <CardDescription>優先度ごとのタスク数</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-destructive text-sm">
            エラー: {result.error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>優先度別</CardTitle>
        <CardDescription>優先度ごとのタスク数</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.values(PRIORITY).map((priority) => (
            <div
              key={priority}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">
                {PRIORITY_LABELS[priority]}
              </span>
              <span className="font-semibold">
                {result.value[priority] ?? 0}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
