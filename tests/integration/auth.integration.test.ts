import fs from "fs";
import path from "path";
import { describe, expect, it, beforeEach } from "vitest";
import { createUser } from "@/logic/auth/createUser";
import { verifyCredentials } from "@/logic/auth/verifyCredentials";

const USERS_CSV = path.join(process.cwd(), "db", "users.integration.csv");
const HEADER = "id,email,password,created_at\n";

describe("auth integration", () => {
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

  it("signup then login succeeds and persists to CSV", async () => {
    const email = `int-${Date.now()}@example.com`;
    const password = "integrated-pass";

    const signup = await createUser({ email, password });
    expect(signup.ok).toBe(true);
    if (!signup.ok) {
      throw new Error("signup failed");
    }

    const login = await verifyCredentials(email, password);
    if (!login.ok) {
      throw new Error(`login failed: ${login.error}`);
    }
    expect(login.value.email).toBe(email);

    const lines = fs.readFileSync(USERS_CSV, "utf-8").trim().split("\n");
    expect(lines.length).toBe(2);
    expect(lines[1]).toContain(email);
  });
});
