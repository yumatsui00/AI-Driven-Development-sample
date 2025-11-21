import fs from "fs";
import path from "path";
import { describe, expect, beforeEach, it } from "vitest";
import { createUser } from "@/logic/auth/createUser";
import { verifyCredentials } from "@/logic/auth/verifyCredentials";

const USERS_CSV = path.join(process.cwd(), "db", "users.test.csv");
const HEADER = "id,email,password,created_at\n";

describe("createUser", () => {
  beforeEach(() => {
    process.env.USERS_CSV_PATH = USERS_CSV;
    fs.writeFileSync(USERS_CSV, HEADER, { encoding: "utf-8" });
  });

  afterAll(() => {
    if (fs.existsSync(USERS_CSV)) {
      fs.unlinkSync(USERS_CSV);
    }
    delete process.env.USERS_CSV_PATH;
  });

  it("creates a user when email is unique and password provided", async () => {
    const result = await createUser({ email: "test@example.com", password: "secret" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.id).toBeTruthy();
    }

    const content = fs.readFileSync(USERS_CSV, "utf-8").trim().split("\n");
    expect(content.length).toBe(2);
    expect(content[1]).toContain("test@example.com");
    expect(content[1]).toContain("secret");
  });

  it("returns error when email already exists", async () => {
    await createUser({ email: "dup@example.com", password: "a" });
    const result = await createUser({ email: "dup@example.com", password: "b" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("email_exists");
    }

    const lines = fs.readFileSync(USERS_CSV, "utf-8").trim().split("\n");
    expect(lines.length).toBe(2);
  });

  it("returns error when password is blank", async () => {
    const result = await createUser({ email: "blank@example.com", password: "   " });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("password_required");
    }
    const lines = fs.readFileSync(USERS_CSV, "utf-8").trim().split("\n");
    expect(lines.length).toBe(1);
  });

  it("verifies credentials after signup", async () => {
    const email = "user@example.com";
    const password = "pass123";
    await createUser({ email, password });
    const loginResult = await verifyCredentials(email, password);
    expect(loginResult.ok).toBe(true);
    if (loginResult.ok) {
      expect(loginResult.value.email).toBe(email);
    }
  });
});
