import type { AuthUser } from "@/types/auth";
import { err, ok, type Result } from "@/types/result";
import { readCsv } from "@/utils/csv/readCsv";
import { getUsersCsvPath, USER_HEADER } from "./userStore";

/**
 * Find a user by email. Returns null when not found.
 */
export async function findUserByEmail(email: string): Promise<Result<AuthUser | null>> {
  const usersCsv = getUsersCsvPath();
  const readResult = await readCsv(usersCsv, USER_HEADER, true);
  if (!readResult.ok) {
    return err("csv_read_failed");
  }

  const found = readResult.value.find((u) => u.email === email) as AuthUser | undefined;
  return ok(found ?? null);
}
