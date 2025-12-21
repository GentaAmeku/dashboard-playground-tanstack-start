import { beforeEach, describe, expect, it, vi } from "vitest";
import * as taskRepository from "@/lib/db/repositories/task-repository";
import type { Task } from "@/lib/db/schema";
import { PRIORITY, STATUS } from "@/lib/db/schema";
import { apiError, databaseError } from "@/lib/errors";
import type { Result } from "@/lib/result";
import { err, ok } from "@/lib/result";
import { taskService } from "../task-service";

// リポジトリをモック
vi.mock("@/lib/db/repositories/task-repository", () => ({
  taskRepository: {
    getTotalCount: vi.fn(),
    getStatusCounts: vi.fn(),
    getPriorityCounts: vi.fn(),
    getCompletedCount: vi.fn(),
    getAll: vi.fn(),
    getByQuery: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("taskService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function expectOk<T>(result: Result<T>): T {
    expect(result.ok).toBe(true);
    if (!result.ok) throw result.error;
    return result.value;
  }

  function expectErrType(result: Result<unknown>, type: string) {
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected error result");
    expect(result.error.type).toBe(type);
  }

  function buildTask(overrides?: Partial<Task>): Task {
    const now = new Date();
    return {
      id: 1,
      name: "Task",
      description: "Description",
      status: STATUS.PENDING,
      priority: PRIORITY.MEDIUM,
      createdAt: now,
      updatedAt: now,
      ...overrides,
    };
  }

  describe("getTotalCount", () => {
    it("リポジトリから総数を取得できる", async () => {
      vi.mocked(taskRepository.taskRepository.getTotalCount).mockResolvedValue(
        ok(10),
      );

      const result = await taskService.getTotalCount();
      expect(expectOk(result)).toBe(10);
      expect(taskRepository.taskRepository.getTotalCount).toHaveBeenCalledTimes(
        1,
      );
    });

    it("データベースエラーが発生した場合、エラーを返す", async () => {
      const error = databaseError("Database connection failed");
      vi.mocked(taskRepository.taskRepository.getTotalCount).mockResolvedValue(
        err(error),
      );

      const result = await taskService.getTotalCount();
      expectErrType(result, "DATABASE_ERROR");
    });
  });

  describe("getStatusCounts", () => {
    it("ステータス別の集計を取得できる", async () => {
      const statusCounts = {
        [STATUS.PENDING]: 5,
        [STATUS.IN_PROGRESS]: 3,
        [STATUS.COMPLETED]: 2,
      };
      vi.mocked(
        taskRepository.taskRepository.getStatusCounts,
      ).mockResolvedValue(ok(statusCounts));

      const result = await taskService.getStatusCounts();
      expect(expectOk(result)).toEqual(statusCounts);
    });
  });

  describe("getPriorityCounts", () => {
    it("優先度別の集計を取得できる", async () => {
      const priorityCounts = {
        [PRIORITY.LOW]: 2,
        [PRIORITY.MEDIUM]: 5,
        [PRIORITY.HIGH]: 3,
      };
      vi.mocked(
        taskRepository.taskRepository.getPriorityCounts,
      ).mockResolvedValue(ok(priorityCounts));

      const result = await taskService.getPriorityCounts();
      expect(expectOk(result)).toEqual(priorityCounts);
    });
  });

  describe("getCompletedCount", () => {
    it("完了タスク数を取得できる", async () => {
      vi.mocked(
        taskRepository.taskRepository.getCompletedCount,
      ).mockResolvedValue(ok(7));

      const result = await taskService.getCompletedCount();
      expect(expectOk(result)).toBe(7);
    });
  });

  describe("getAllTasks", () => {
    it("全タスクを取得できる", async () => {
      const tasks: Task[] = [
        buildTask({ id: 1, name: "Task 1", description: "Description 1" }),
        buildTask({
          id: 2,
          name: "Task 2",
          description: "Description 2",
          status: STATUS.COMPLETED,
          priority: PRIORITY.HIGH,
        }),
      ];
      vi.mocked(taskRepository.taskRepository.getAll).mockResolvedValue(
        ok(tasks),
      );

      const result = await taskService.getAllTasks();
      expect(expectOk(result)).toEqual(tasks);
    });
  });

  describe("getTasksByQuery", () => {
    it("有効なクエリでタスクを検索できる", async () => {
      const tasks: Task[] = [
        buildTask({
          id: 1,
          name: "React Task",
          status: STATUS.PENDING,
          priority: PRIORITY.HIGH,
        }),
      ];
      vi.mocked(taskRepository.taskRepository.getByQuery).mockResolvedValue(
        ok(tasks),
      );

      const result = await taskService.getTasksByQuery({
        name: "React",
        status: STATUS.PENDING,
      });
      expect(expectOk(result)).toEqual(tasks);
      expect(taskRepository.taskRepository.getByQuery).toHaveBeenCalledWith({
        name: "React",
        status: STATUS.PENDING,
      });
    });

    it("無効なクエリではバリデーションエラーを返す", async () => {
      const result = await taskService.getTasksByQuery({
        status: "invalid_status",
      });
      expectErrType(result, "VALIDATION_ERROR");
      expect(taskRepository.taskRepository.getByQuery).not.toHaveBeenCalled();
    });

    it("空のクエリでも動作する", async () => {
      const tasks: Task[] = [];
      vi.mocked(taskRepository.taskRepository.getByQuery).mockResolvedValue(
        ok(tasks),
      );

      const result = await taskService.getTasksByQuery({});
      expect(expectOk(result)).toEqual(tasks);
    });

    it("部分的なクエリでも動作する", async () => {
      const tasks: Task[] = [];
      vi.mocked(taskRepository.taskRepository.getByQuery).mockResolvedValue(
        ok(tasks),
      );

      const result = await taskService.getTasksByQuery({
        name: "Test",
      });
      expectOk(result);
      expect(taskRepository.taskRepository.getByQuery).toHaveBeenCalledWith({
        name: "Test",
      });
    });
  });

  describe("getTask", () => {
    it("存在するIDでタスクを取得できる", async () => {
      const task: Task = buildTask({ id: 1, name: "Test Task" });
      vi.mocked(taskRepository.taskRepository.getById).mockResolvedValue(
        ok(task),
      );

      const result = await taskService.getTask(1);
      expect(expectOk(result)).toEqual(task);
      expect(taskRepository.taskRepository.getById).toHaveBeenCalledWith(1);
    });

    it("存在しないIDでは404エラーを返す", async () => {
      const error = apiError("Task with id 999 not found", 404);
      vi.mocked(taskRepository.taskRepository.getById).mockResolvedValue(
        err(error),
      );

      const result = await taskService.getTask(999);
      expect(result.ok).toBe(false);
      if (!result.ok && result.error.type === "API_ERROR") {
        expect(result.error.httpStatus).toBe(404);
      }
    });
  });

  describe("createTask", () => {
    it("有効なデータでタスクを作成できる", async () => {
      const taskData = {
        name: "New Task",
        description: "Description",
        status: STATUS.PENDING,
        priority: PRIORITY.HIGH,
      };
      const createdTask: Task = buildTask({ id: 1, ...taskData });
      vi.mocked(taskRepository.taskRepository.create).mockResolvedValue(
        ok(createdTask),
      );

      const result = await taskService.createTask(taskData);
      expect(expectOk(result)).toEqual(createdTask);
      expect(taskRepository.taskRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "New Task",
          status: STATUS.PENDING,
          priority: PRIORITY.HIGH,
        }),
      );
    });

    it.each([
      ["必須フィールドが不足", { description: "Description only" }],
      [
        "無効なステータス",
        { name: "Task", status: "invalid_status" as typeof STATUS.PENDING },
      ],
      [
        "無効な優先度",
        {
          name: "Task",
          priority: "invalid_priority" as typeof PRIORITY.MEDIUM,
        },
      ],
      ["名前が空文字列", { name: "" }],
      ["名前が長すぎる", { name: "a".repeat(201) }],
      ["説明が長すぎる", { name: "Task", description: "a".repeat(1001) }],
    ])("%sの場合、バリデーションエラーを返す", async (_label, input) => {
      const result = await taskService.createTask(input);
      expectErrType(result, "VALIDATION_ERROR");
      expect(taskRepository.taskRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("updateTask", () => {
    it("有効なデータでタスクを更新できる", async () => {
      const existingTask: Task = buildTask({
        id: 1,
        name: "Original Task",
        description: "Original Description",
      });
      const updatedTask: Task = buildTask({
        ...existingTask,
        name: "Updated Task",
        status: STATUS.COMPLETED,
        updatedAt: new Date(),
      });

      vi.mocked(taskRepository.taskRepository.getById).mockResolvedValue(
        ok(existingTask),
      );
      vi.mocked(taskRepository.taskRepository.update).mockResolvedValue(
        ok(updatedTask),
      );

      const result = await taskService.updateTask(1, {
        name: "Updated Task",
        status: STATUS.COMPLETED,
      });
      expect(expectOk(result)).toEqual(updatedTask);
      expect(taskRepository.taskRepository.getById).toHaveBeenCalledWith(1);
      expect(taskRepository.taskRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          name: "Updated Task",
          status: STATUS.COMPLETED,
        }),
      );
    });

    it("存在しないIDでは404エラーを返す", async () => {
      const error = apiError("Task with id 999 not found", 404);
      vi.mocked(taskRepository.taskRepository.getById).mockResolvedValue(
        err(error),
      );

      const result = await taskService.updateTask(999, { name: "Updated" });
      expect(result.ok).toBe(false);
      if (!result.ok && result.error.type === "API_ERROR") {
        expect(result.error.httpStatus).toBe(404);
      }
      expect(taskRepository.taskRepository.update).not.toHaveBeenCalled();
    });

    it("無効なデータではバリデーションエラーを返す", async () => {
      vi.mocked(taskRepository.taskRepository.getById).mockResolvedValue(
        ok(buildTask({ id: 1 })),
      );

      const result = await taskService.updateTask(1, {
        status: "invalid_status" as typeof STATUS.PENDING,
      });
      expectErrType(result, "VALIDATION_ERROR");
      expect(taskRepository.taskRepository.getById).not.toHaveBeenCalled();
      expect(taskRepository.taskRepository.update).not.toHaveBeenCalled();
    });

    it("部分的な更新ができる", async () => {
      const existingTask: Task = buildTask({ id: 1, name: "Original Task" });
      const updatedTask: Task = buildTask({
        ...existingTask,
        status: STATUS.IN_PROGRESS,
        updatedAt: new Date(),
      });

      vi.mocked(taskRepository.taskRepository.getById).mockResolvedValue(
        ok(existingTask),
      );
      vi.mocked(taskRepository.taskRepository.update).mockResolvedValue(
        ok(updatedTask),
      );

      const result = await taskService.updateTask(1, {
        status: STATUS.IN_PROGRESS,
      });
      expect(expectOk(result).status).toBe(STATUS.IN_PROGRESS);
    });

    it("空の更新データでも動作する（バリデーションは通る）", async () => {
      const existingTask: Task = buildTask({ id: 1, name: "Task" });
      vi.mocked(taskRepository.taskRepository.getById).mockResolvedValue(
        ok(existingTask),
      );
      vi.mocked(taskRepository.taskRepository.update).mockResolvedValue(
        ok(existingTask),
      );

      const result = await taskService.updateTask(1, {});
      expectOk(result);
      expect(taskRepository.taskRepository.update).toHaveBeenCalledWith(1, {});
    });
  });

  describe("deleteTask", () => {
    it("存在するタスクを削除できる", async () => {
      vi.mocked(taskRepository.taskRepository.delete).mockResolvedValue(
        ok(undefined),
      );

      const result = await taskService.deleteTask(1);
      expectOk(result);
      expect(taskRepository.taskRepository.delete).toHaveBeenCalledWith(1);
    });

    it("存在しないIDでは404エラーを返す", async () => {
      const error = apiError("Task with id 999 not found", 404);
      vi.mocked(taskRepository.taskRepository.delete).mockResolvedValue(
        err(error),
      );

      const result = await taskService.deleteTask(999);
      expect(result.ok).toBe(false);
      if (!result.ok && result.error.type === "API_ERROR") {
        expect(result.error.httpStatus).toBe(404);
      }
    });
  });
});
