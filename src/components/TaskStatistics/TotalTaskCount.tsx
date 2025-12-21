import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTotalTaskCountQueryOptions } from "@/lib/cache/query-options";
import { isErr } from "@/lib/result";

export default function TotalTaskCount() {
  const { data: result } = useSuspenseQuery(getTotalTaskCountQueryOptions());

  if (isErr(result)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>総タスク数</CardTitle>
          <CardDescription>すべてのタスクの合計</CardDescription>
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
        <CardTitle>総タスク数</CardTitle>
        <CardDescription>すべてのタスクの合計</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{result.value}</div>
      </CardContent>
    </Card>
  );
}
