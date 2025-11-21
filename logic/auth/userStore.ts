import path from "path";

export const USER_HEADER = ["id", "email", "password", "created_at"];

/**
 * Resolve CSV path for users, defaults to db/users.csv; can be overridden via USERS_CSV_PATH (for tests).
 */
export function getUsersCsvPath(): string {
  const custom = process.env.USERS_CSV_PATH;
  if (custom) {
    return path.isAbsolute(custom) ? custom : path.join(process.cwd(), custom);
  }
  return path.join(process.cwd(), "db", "users.csv");
}
