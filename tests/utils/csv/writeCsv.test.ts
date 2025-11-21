import fs from "fs";
import path from "path";
import { describe, expect, it, beforeEach, afterAll } from "vitest";
import { writeCsv } from "@/utils/csv/writeCsv";

const TEST_CSV = path.join(process.cwd(), "db", "utils-test.csv");
const HEADER = ["id", "email", "password", "created_at"];

describe("writeCsv", () => {
  beforeEach(() => {
    if (fs.existsSync(TEST_CSV)) {
      fs.unlinkSync(TEST_CSV);
    }
  });

  afterAll(() => {
    if (fs.existsSync(TEST_CSV)) {
      fs.unlinkSync(TEST_CSV);
    }
  });

  it("adds new rows at the end", async () => {
    const first = { id: "1", email: "a@example.com", password: "p", created_at: "t1" };
    const second = { id: "2", email: "b@example.com", password: "q", created_at: "t2" };

    await writeCsv(TEST_CSV, HEADER, [first]);
    await writeCsv(TEST_CSV, HEADER, [first, second]);

    const lines = fs.readFileSync(TEST_CSV, "utf-8").trim().split("\n");
    expect(lines[lines.length - 1]).toBe("2,b@example.com,q,t2");
  });

  it("uses LF newlines and no carriage returns", async () => {
    await writeCsv(TEST_CSV, HEADER, []);
    const content = fs.readFileSync(TEST_CSV, "utf-8");
    expect(content).not.toContain("\r");
    expect(content.endsWith("\n")).toBe(true);
  });

  it("does not wrap values in double quotes", async () => {
    const row = { id: "3", email: "c@example.com", password: "p3", created_at: "t3" };
    await writeCsv(TEST_CSV, HEADER, [row]);
    const content = fs.readFileSync(TEST_CSV, "utf-8");
    expect(content).not.toContain("\"");
  });
});
