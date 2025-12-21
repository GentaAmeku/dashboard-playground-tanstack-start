import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getCompletedTaskCountQueryOptions,
  getTotalTaskCountQueryOptions,
} from "@/lib/cache/query-options";
import { isErr } from "@/lib/result";

export default function CompletionRate() {
  const { data: totalResult } = useSuspenseQuery(
    getTotalTaskCountQueryOptions(),
  );
  const { data: completedResult } = useSuspenseQuery(
    getCompletedTaskCountQueryOptions(),
  );

  if (isErr(totalResult)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>完了率</CardTitle>
          <CardDescription>完了したタスクの割合</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-destructive text-sm">
            エラー: {totalResult.error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isErr(completedResult)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>完了率</CardTitle>
          <CardDescription>完了したタスクの割合</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-destructive text-sm">
            エラー: {completedResult.error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  const total = totalResult.value;
  const completed = completedResult.value;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>完了率</CardTitle>
        <CardDescription>完了したタスクの割合</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {rate}
          <span className="text-lg text-muted-foreground">%</span>
        </div>
      </CardContent>
    </Card>
  );
}
