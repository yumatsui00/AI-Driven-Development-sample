import path from "path";
import type { AuthUser } from "@/types/auth";
import { err, ok, type Result } from "@/types/result";
import { readCsv } from "@/utils/csv/readCsv";

const USERS_CSV = path.join("db", "users.csv");
const USER_HEADER = ["id", "email", "password", "created_at"];

/**
 * Find a user by email. Returns null when not found.
 */
export async function findUserByEmail(email: string): Promise<Result<AuthUser | null>> {
  const readResult = await readCsv(USERS_CSV, USER_HEADER as unknown as string[], true);
  if (!readResult.ok) {
    return err("csv_read_failed");
  }

  const found = readResult.value.find((u) => u.email === email) as AuthUser | undefined;
  return ok(found ?? null);
}
