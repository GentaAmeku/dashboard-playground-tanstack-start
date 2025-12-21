import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as clientModule from "@/lib/db/client";
import type { NewTask } from "@/lib/db/schema";
import * as schema from "@/lib/db/schema";
import { PRIORITY, STATUS } from "@/lib/db/schema";
import type { Result } from "@/lib/result";
import { taskRepository } from "../task-repository";

/**
 * テスト用のインメモリデータベースをセットアップ
 * 各テストの前にクリーンな状態を保証する
 */
function createTestDB() {
  const sqlite = new Database(":memory:");
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  const db = drizzle(sqlite, { schema });
  return { db, sqlite };
}

/**
 * テスト用のタスクデータを作成するヘルパー
 */
function createTestTask(overrides?: Partial<NewTask>): NewTask {
  return {
    name: "Test Task",
    description: "Test Description",
    status: STATUS.PENDING,
    priority: PRIORITY.MEDIUM,
    ...overrides,
  };
}

function expectOk<T>(result: Result<T>): T {
  expect(result.ok).toBe(true);
  if (!result.ok) throw result.error;
  return result.value;
}

function expectNotFound(result: Result<unknown>) {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("Expected error result");
  expect(result.error.type).toBe("API_ERROR");
  if (result.error.type === "API_ERROR") {
    expect(result.error.httpStatus).toBe(404);
  }
}

describe("taskRepository", () => {
  let testDb: ReturnType<typeof createTestDB>;

  beforeEach(() => {
    // テスト用のDBを作成
    testDb = createTestDB();

    // テーブルを作成（スキーマに基づいて）
    testDb.sqlite.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        priority TEXT NOT NULL DEFAULT 'medium',
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER NOT NULL DEFAULT (unixepoch())
      )
    `);

    // getDBをモックしてテスト用DBを返すようにする
    vi.spyOn(clientModule, "getDB").mockReturnValue(testDb.db);
  });

  afterEach(() => {
    testDb.sqlite.close();
    vi.restoreAllMocks();
  });

  async function seedTasks(tasks: Array<Partial<NewTask>>) {
    for (const t of tasks) {
      expectOk(await taskRepository.create(createTestTask(t)));
    }
  }

  describe("getTotalCount", () => {
    it("空のデータベースでは0を返す", async () => {
      expect(expectOk(await taskRepository.getTotalCount())).toBe(0);
    });

    it("タスクが存在する場合、正しい総数を返す", async () => {
      await seedTasks([
        { name: "Task 1" },
        { name: "Task 2" },
        { name: "Task 3" },
      ]);
      expect(expectOk(await taskRepository.getTotalCount())).toBe(3);
    });
  });

  describe("getStatusCounts", () => {
    it("空のデータベースでは空のオブジェクトを返す", async () => {
      expect(expectOk(await taskRepository.getStatusCounts())).toEqual({});
    });

    it("各ステータスのタスク数を正しく集計する", async () => {
      await seedTasks([
        { name: "Task 1", status: STATUS.PENDING },
        { name: "Task 2", status: STATUS.PENDING },
        { name: "Task 3", status: STATUS.IN_PROGRESS },
        { name: "Task 4", status: STATUS.COMPLETED },
        { name: "Task 5", status: STATUS.COMPLETED },
        { name: "Task 6", status: STATUS.COMPLETED },
      ]);

      expect(expectOk(await taskRepository.getStatusCounts())).toEqual({
        [STATUS.PENDING]: 2,
        [STATUS.IN_PROGRESS]: 1,
        [STATUS.COMPLETED]: 3,
      });
    });
  });

  describe("getPriorityCounts", () => {
    it("空のデータベースでは空のオブジェクトを返す", async () => {
      expect(expectOk(await taskRepository.getPriorityCounts())).toEqual({});
    });

    it("各優先度のタスク数を正しく集計する", async () => {
      await seedTasks([
        { name: "Task 1", priority: PRIORITY.LOW },
        { name: "Task 2", priority: PRIORITY.LOW },
        { name: "Task 3", priority: PRIORITY.MEDIUM },
        { name: "Task 4", priority: PRIORITY.HIGH },
        { name: "Task 5", priority: PRIORITY.HIGH },
      ]);

      expect(expectOk(await taskRepository.getPriorityCounts())).toEqual({
        [PRIORITY.LOW]: 2,
        [PRIORITY.MEDIUM]: 1,
        [PRIORITY.HIGH]: 2,
      });
    });
  });

  describe("getCompletedCount", () => {
    it("完了タスクがない場合、0を返す", async () => {
      await seedTasks([{ name: "Task 1", status: STATUS.PENDING }]);
      expect(expectOk(await taskRepository.getCompletedCount())).toBe(0);
    });

    it("完了タスクの数を正しく返す", async () => {
      await seedTasks([
        { name: "Task 1", status: STATUS.PENDING },
        { name: "Task 2", status: STATUS.COMPLETED },
        { name: "Task 3", status: STATUS.COMPLETED },
      ]);
      expect(expectOk(await taskRepository.getCompletedCount())).toBe(2);
    });
  });

  describe("getAll", () => {
    it("空のデータベースでは空の配列を返す", async () => {
      expect(expectOk(await taskRepository.getAll())).toEqual([]);
    });

    it("作成日時の降順でタスクを返す", async () => {
      const now = Math.floor(Date.now() / 1000); // Unix timestamp (秒単位)

      expectOk(
        await taskRepository.create(
          createTestTask({
            name: "First Task",
            createdAt: new Date((now - 10) * 1000), // 10秒前
          }),
        ),
      );

      expectOk(
        await taskRepository.create(
          createTestTask({
            name: "Second Task",
            createdAt: new Date(now * 1000), // 現在時刻
          }),
        ),
      );

      const tasks = expectOk(await taskRepository.getAll());
      expect(tasks).toHaveLength(2);
      // 最新のタスクが最初に来ることを確認
      expect(tasks[0].name).toBe("Second Task");
      expect(tasks[1].name).toBe("First Task");
    });
  });

  describe("getByQuery", () => {
    beforeEach(async () => {
      // テストデータを準備
      await seedTasks([
        {
          name: "React Task",
          status: STATUS.PENDING,
          priority: PRIORITY.HIGH,
        },
        {
          name: "Next.js Task",
          status: STATUS.IN_PROGRESS,
          priority: PRIORITY.MEDIUM,
        },
        {
          name: "TypeScript Task",
          status: STATUS.PENDING,
          priority: PRIORITY.LOW,
        },
        {
          name: "Vue Task",
          status: STATUS.COMPLETED,
          priority: PRIORITY.HIGH,
        },
      ]);
    });

    it("クエリなしで全てのタスクを返す", async () => {
      expect(expectOk(await taskRepository.getByQuery({}))).toHaveLength(4);
    });

    it("名前で部分一致検索ができる", async () => {
      const tasks = expectOk(
        await taskRepository.getByQuery({ name: "React" }),
      );
      expect(tasks).toHaveLength(1);
      expect(tasks[0].name).toBe("React Task");
    });

    it("名前の検索は大文字小文字を区別しない（部分一致）", async () => {
      const tasks = expectOk(
        await taskRepository.getByQuery({ name: "react" }),
      );
      expect(tasks).toHaveLength(1);
      expect(tasks[0].name).toBe("React Task");
    });

    it("空文字列の名前は無視される", async () => {
      expect(
        expectOk(await taskRepository.getByQuery({ name: "" })),
      ).toHaveLength(4);
    });

    it("空白のみの名前は無視される", async () => {
      expect(
        expectOk(await taskRepository.getByQuery({ name: "   " })),
      ).toHaveLength(4);
    });

    it("ステータスでフィルタリングできる", async () => {
      const tasks = expectOk(
        await taskRepository.getByQuery({
          status: STATUS.PENDING,
        }),
      );
      expect(tasks).toHaveLength(2);
      expect(tasks.every((t) => t.status === STATUS.PENDING)).toBe(true);
    });

    it("優先度でフィルタリングできる", async () => {
      const tasks = expectOk(
        await taskRepository.getByQuery({
          priority: PRIORITY.HIGH,
        }),
      );
      expect(tasks).toHaveLength(2);
      expect(tasks.every((t) => t.priority === PRIORITY.HIGH)).toBe(true);
    });

    it("複数の条件でフィルタリングできる", async () => {
      const tasks = expectOk(
        await taskRepository.getByQuery({
          status: STATUS.PENDING,
          priority: PRIORITY.HIGH,
        }),
      );
      expect(tasks).toHaveLength(1);
      expect(tasks[0].name).toBe("React Task");
    });

    it("存在しない条件では空の配列を返す", async () => {
      const tasks = expectOk(
        await taskRepository.getByQuery({
          status: STATUS.CANCELLED,
        }),
      );
      expect(tasks).toHaveLength(0);
    });
  });

  describe("getById", () => {
    it("存在するIDでタスクを取得できる", async () => {
      const created = expectOk(
        await taskRepository.create(createTestTask({ name: "Test Task" })),
      );

      const task = expectOk(await taskRepository.getById(created.id));
      expect(task.id).toBe(created.id);
      expect(task.name).toBe("Test Task");
    });

    it("存在しないIDでは404エラーを返す", async () => {
      expectNotFound(await taskRepository.getById(999));
    });
  });

  describe("create", () => {
    it("新しいタスクを作成できる", async () => {
      const taskData = createTestTask({ name: "New Task" });
      const task = expectOk(await taskRepository.create(taskData));

      expect(task.name).toBe("New Task");
      expect(task.id).toBeDefined();
      expect(task.createdAt).toBeDefined();
    });

    it("作成されたタスクは取得できる", async () => {
      const created = expectOk(
        await taskRepository.create(createTestTask({ name: "Created Task" })),
      );
      expect(expectOk(await taskRepository.getById(created.id)).name).toBe(
        "Created Task",
      );
    });

    it("デフォルト値が正しく設定される", async () => {
      const taskData: NewTask = {
        name: "Task with defaults",
        description: null,
      };
      const task = expectOk(await taskRepository.create(taskData));
      expect(task.status).toBe(STATUS.PENDING);
      expect(task.priority).toBe(PRIORITY.MEDIUM);
    });
  });

  describe("update", () => {
    it("存在するタスクを更新できる", async () => {
      const created = expectOk(
        await taskRepository.create(createTestTask({ name: "Original Task" })),
      );

      const updated = expectOk(
        await taskRepository.update(created.id, {
          name: "Updated Task",
          status: STATUS.COMPLETED,
        }),
      );
      expect(updated.name).toBe("Updated Task");
      expect(updated.status).toBe(STATUS.COMPLETED);
    });

    it("部分的な更新ができる", async () => {
      const created = expectOk(
        await taskRepository.create(
          createTestTask({
            name: "Original Task",
            status: STATUS.PENDING,
            priority: PRIORITY.MEDIUM,
          }),
        ),
      );

      const updated = expectOk(
        await taskRepository.update(created.id, { status: STATUS.IN_PROGRESS }),
      );
      expect(updated.status).toBe(STATUS.IN_PROGRESS);
      // 他のフィールドは変更されていない
      expect(updated.name).toBe("Original Task");
      expect(updated.priority).toBe(PRIORITY.MEDIUM);
    });

    it("存在しないIDでは404エラーを返す", async () => {
      expectNotFound(await taskRepository.update(999, { name: "Updated" }));
    });
  });

  describe("delete", () => {
    it("存在するタスクを削除できる", async () => {
      const created = expectOk(
        await taskRepository.create(createTestTask({ name: "To Delete" })),
      );

      expectOk(await taskRepository.delete(created.id));

      // 削除後は取得できないことを確認
      expectNotFound(await taskRepository.getById(created.id));
    });

    it("存在しないIDでは404エラーを返す", async () => {
      expectNotFound(await taskRepository.delete(999));
    });

    it("削除後は総数が減る", async () => {
      const t1 = expectOk(
        await taskRepository.create(createTestTask({ name: "Task 1" })),
      );
      expectOk(await taskRepository.create(createTestTask({ name: "Task 2" })));

      const countBefore = expectOk(await taskRepository.getTotalCount());
      expectOk(await taskRepository.delete(t1.id));
      const countAfter = expectOk(await taskRepository.getTotalCount());

      expect(countAfter).toBe(countBefore - 1);
    });
  });
});
