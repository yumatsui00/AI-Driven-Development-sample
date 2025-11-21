import fs from "fs";
import path from "path";
import { describe, expect, beforeEach, afterAll, it } from "vitest";
import { createProject, deleteProject, listProjects } from "@/logic/projectRepository";

const PROJECTS_CSV = path.join(process.cwd(), "db", "projects.test.csv");
const HEADER = "id,user_id,name,created_at,updated_at,order\n";

describe("projectRepository", () => {
  beforeEach(() => {
    process.env.PROJECTS_CSV_PATH = PROJECTS_CSV;
    fs.writeFileSync(PROJECTS_CSV, HEADER, { encoding: "utf-8" });
  });

  afterAll(() => {
    if (fs.existsSync(PROJECTS_CSV)) {
      fs.unlinkSync(PROJECTS_CSV);
    }
    delete process.env.PROJECTS_CSV_PATH;
  });

  it("creates project with incremental order per user", async () => {
    const userA = "user-a";
    const userB = "user-b";
    const first = await createProject("Project 1", userA);
    const second = await createProject("Project 2", userA);
    const other = await createProject("Other", userB);

    expect(first.ok && second.ok && other.ok).toBe(true);
    if (second.ok) {
      expect(second.value.order).toBe(2);
    }
    if (other.ok) {
      expect(other.value.order).toBe(1);
    }
  });

  it("lists only projects for the user sorted by order", async () => {
    await createProject("A", "u1");
    await createProject("B", "u1");
    await createProject("C", "u2");

    const result = await listProjects("u1");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.map((p) => p.userId)).toEqual(["u1", "u1"]);
      expect(result.value[0].order).toBeLessThanOrEqual(result.value[1].order);
    }
  });

  it("deletes a project for the specific user", async () => {
    const created = await createProject("Kill me", "u1");
    if (!created.ok) throw new Error("create failed");

    const del = await deleteProject(created.value.id, "u1");
    expect(del.ok).toBe(true);

    const result = await listProjects("u1");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.length).toBe(0);
    }
  });

  it("fails delete when project not found", async () => {
    const del = await deleteProject("nope", "u1");
    expect(del.ok).toBe(false);
    if (!del.ok) {
      expect(del.error).toBe("project_not_found");
    }
  });
});
