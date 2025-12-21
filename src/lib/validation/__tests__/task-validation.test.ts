import { describe, expect, it } from "vitest";
import { PRIORITY, STATUS } from "@/lib/db/schema";
import {
  validateTaskData,
  validateTaskDescription,
  validateTaskInsert,
  validateTaskName,
  validateTaskUpdate,
} from "@/lib/validation/task-validation";

describe("validation/task-validation", () => {
  describe("validateTaskName", () => {
    it("前後の空白をトリムして返す", () => {
      const result = validateTaskName("  Task  ");
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value).toBe("Task");
    });

    it("空文字列はエラー", () => {
      const result = validateTaskName("");
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.type).toBe("VALIDATION_ERROR");
    });

    it("空白のみはエラー", () => {
      const result = validateTaskName("   ");
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.type).toBe("VALIDATION_ERROR");
    });

    it("200文字を超えるとエラー", () => {
      const result = validateTaskName("a".repeat(201));
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.type).toBe("VALIDATION_ERROR");
    });
  });

  describe("validateTaskDescription", () => {
    it("null を許可する", () => {
      const result = validateTaskDescription(null);
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value).toBeNull();
    });

    it("1000文字を超えるとエラー", () => {
      const result = validateTaskDescription("a".repeat(1001));
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.type).toBe("VALIDATION_ERROR");
    });
  });

  describe("validateTaskData", () => {
    it("有効な入力を返す（nameはトリムされる）", () => {
      const result = validateTaskData({
        name: "  My Task  ",
        description: "Desc",
        status: STATUS.PENDING,
        priority: PRIORITY.MEDIUM,
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.name).toBe("My Task");
        expect(result.value.status).toBe(STATUS.PENDING);
        expect(result.value.priority).toBe(PRIORITY.MEDIUM);
      }
    });

    it("必須フィールドが不足するとエラー", () => {
      const result = validateTaskData({
        name: "Task",
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe("VALIDATION_ERROR");
        if (result.error.type === "VALIDATION_ERROR") {
          expect(result.error.fields).toEqual(
            expect.arrayContaining(["status", "priority"]),
          );
        }
      }
    });
  });

  describe("validateTaskUpdate", () => {
    it("空オブジェクトはOK（部分更新）", () => {
      const result = validateTaskUpdate({});
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value).toEqual({});
    });

    it("不正なステータスはエラー", () => {
      const result = validateTaskUpdate({
        status: "invalid" as typeof STATUS.PENDING,
      });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.type).toBe("VALIDATION_ERROR");
    });
  });

  describe("validateTaskInsert", () => {
    it("DB insert 相当の入力を検証できる", () => {
      const result = validateTaskInsert({
        name: "Insert",
        description: null,
        status: STATUS.COMPLETED,
        priority: PRIORITY.HIGH,
      });
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value.name).toBe("Insert");
    });
  });
});
