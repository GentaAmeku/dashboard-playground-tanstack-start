import { count } from "drizzle-orm";
import { getDB } from "./client";
import { PRIORITY, STATUS, tasks } from "./schema";

export function seedDatabase() {
  const db = getDB();
  const taskCount = db.select({ count: count() }).from(tasks).get();

  if (taskCount?.count === 0) {
    db.insert(tasks)
      .values([
        {
          name: "TASK-10001",
          description:
            "Use the digital TLS panel, then you can transmit the haptic system!",
          status: STATUS.IN_PROGRESS,
          priority: PRIORITY.HIGH,
        },
        {
          name: "TASK-10002",
          description: "Review and test the new authentication system",
          status: STATUS.COMPLETED,
          priority: PRIORITY.MEDIUM,
        },
        {
          name: "TASK-10003",
          description: "Update documentation for API endpoints",
          status: STATUS.PENDING,
          priority: PRIORITY.LOW,
        },
        {
          name: "TASK-10004",
          description: "Legacy feature migration (deprecated)",
          status: STATUS.CANCELLED,
          priority: PRIORITY.MEDIUM,
        },
        {
          name: "TASK-10005",
          description: "Implement user dashboard analytics",
          status: STATUS.IN_PROGRESS,
          priority: PRIORITY.MEDIUM,
        },
        {
          name: "TASK-10006",
          description: "Fix critical security vulnerability",
          status: STATUS.COMPLETED,
          priority: PRIORITY.HIGH,
        },
        {
          name: "TASK-10007",
          description: "Design new logo concepts",
          status: STATUS.PENDING,
          priority: PRIORITY.LOW,
        },
        {
          name: "TASK-10008",
          description: "Old feature that is no longer needed",
          status: STATUS.CANCELLED,
          priority: PRIORITY.LOW,
        },
      ])
      .run();
    console.log("✅ Successfully added seed data");
  } else {
    console.log("ℹ️ The database already has data. Skipping seeding.");
  }
}
