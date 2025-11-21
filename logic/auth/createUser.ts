import { readCsv } from "@/utils/csv/readCsv";
import { writeCsv } from "@/utils/csv/writeCsv";
import { generateId } from "@/utils/id";
import type { AuthUser, SignupInput } from "@/types/auth";
import { err, ok, type Result } from "@/types/result";
import { getUsersCsvPath, USER_HEADER } from "./userStore";

/**
 * Create a new user and persist into CSV.
 */
export async function createUser(input: SignupInput): Promise<Result<{ id: string }>> {
  if (!input.password || input.password.trim().length === 0) {
    return err("password_required");
  }

  const usersCsv = getUsersCsvPath();
  const readResult = await readCsv(usersCsv, USER_HEADER, true);
  if (!readResult.ok) {
    return err("csv_read_failed");
  }

  const existing = readResult.value.find((u) => u.email === input.email);
  if (existing) {
    return err("email_exists");
  }

  const newUser: AuthUser = {
    id: generateId(),
    email: input.email,
    password: input.password,
    created_at: new Date().toISOString()
  };

  const rows: Array<Record<string, string>> = [...readResult.value, newUser];
  const writeResult = await writeCsv(usersCsv, USER_HEADER, rows);
  if (!writeResult.ok) {
    return err("csv_write_failed");
  }

  return ok({ id: newUser.id });
}
