import { findUserByEmail } from "./findUserByEmail";
import { err, ok, type Result } from "@/types/result";

/**
 * Verify email/password combination.
 */
export async function verifyCredentials(
  email: string,
  password: string
): Promise<Result<{ id: string; email: string }>> {
  const lookup = await findUserByEmail(email);
  if (!lookup.ok) {
    return err("csv_read_failed");
  }

  if (!lookup.value) {
    return err("invalid_credentials");
  }

  if (lookup.value.password !== password) {
    return err("invalid_credentials");
  }

  return ok({ id: lookup.value.id, email: lookup.value.email });
}
