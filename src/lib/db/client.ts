import { join } from "node:path";
import Database from "better-sqlite3";
import {
  type BetterSQLite3Database,
  drizzle,
} from "drizzle-orm/better-sqlite3";
import type { AppError } from "@/lib/errors";
import { err, isErr, ok, type Result } from "@/lib/result";
import * as schema from "./schema";

export type DB = BetterSQLite3Database<typeof schema>;

type GlobalDb = {
  sqlite?: Database.Database;
  db?: DB;
};

const globalForDb = globalThis as unknown as GlobalDb;

const dbPath = join(process.cwd(), "local.db");

const initSqlite = (): Result<Database.Database, AppError> => {
  try {
    if (globalForDb.sqlite) {
      return ok(globalForDb.sqlite);
    }

    const sqlite = new Database(dbPath);

    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");
    sqlite.pragma("synchronous = NORMAL");

    if (process.env.NODE_ENV !== "production") {
      globalForDb.sqlite = sqlite;
    }

    return ok(sqlite);
  } catch (error) {
    return err({
      type: "DATABASE_ERROR",
      message: "Failed to initialize SQLite database",
      cause: error,
    });
  }
};

const initDB = (): Result<DB, AppError> => {
  try {
    if (globalForDb.db) return ok(globalForDb.db);
    const sqliteResult = initSqlite();
    if (isErr(sqliteResult)) return sqliteResult;
    const db = drizzle(sqliteResult.value, { schema });
    if (process.env.NODE_ENV !== "production") {
      globalForDb.db = db;
    }
    return ok(db);
  } catch (error) {
    return err({
      type: "DATABASE_ERROR",
      message: "Failed to initialize Drizzle database",
      cause: error,
    });
  }
};

export const getDB = (): DB => {
  const result = initDB();
  if (isErr(result)) {
    throw new Error(`Database initialization failed: ${result.error.message}`);
  }
  return result.value;
};
