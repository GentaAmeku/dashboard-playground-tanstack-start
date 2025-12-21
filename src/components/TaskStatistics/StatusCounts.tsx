import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getStatusCountsQueryOptions } from "@/lib/cache/query-options";
import { STATUS, STATUS_LABELS } from "@/lib/db/schema";
import { isErr } from "@/lib/result";

export default function StatusCounts() {
  const { data: result } = useSuspenseQuery(getStatusCountsQueryOptions());
  if (isErr(result)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ステータス別</CardTitle>
          <CardDescription>ステータスごとのタスク数</CardDescription>
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
        <CardTitle>ステータス別</CardTitle>
        <CardDescription>ステータスごとのタスク数</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.values(STATUS).map((status) => (
            <div
              key={status}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">
                {STATUS_LABELS[status]}
              </span>
              <span className="font-semibold">{result.value[status] ?? 0}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
