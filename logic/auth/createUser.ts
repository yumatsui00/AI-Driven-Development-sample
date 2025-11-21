import path from "path";
import { readCsv } from "@/utils/csv/readCsv";
import { writeCsv } from "@/utils/csv/writeCsv";
import { generateId } from "@/utils/id";
import type { AuthUser, SignupInput } from "@/types/auth";
import { err, ok, type Result } from "@/types/result";

const USERS_CSV = path.join("db", "users.csv");
const USER_HEADER = ["id", "email", "password", "created_at"];

/**
 * Create a new user and persist into CSV.
 */
export async function createUser(input: SignupInput): Promise<Result<{ id: string }>> {
  const readResult = await readCsv(USERS_CSV, USER_HEADER as unknown as string[], true);
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
  const writeResult = await writeCsv(USERS_CSV, USER_HEADER as unknown as string[], rows);
  if (!writeResult.ok) {
    return err("csv_write_failed");
  }

  return ok({ id: newUser.id });
}
