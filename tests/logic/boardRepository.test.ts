import fs from "fs";
import path from "path";
import { beforeEach, afterAll, describe, expect, it } from "vitest";
import { createBoard, deleteBoard, listBoards } from "@/logic/boardRepository";

const BOARDS_CSV = path.join(process.cwd(), "db", "boards.test.csv");
const HEADER = "id,project_id,name,created_at,updated_at,order\n";

describe("boardRepository", () => {
  beforeEach(() => {
    process.env.BOARDS_CSV_PATH = BOARDS_CSV;
    fs.writeFileSync(BOARDS_CSV, HEADER, { encoding: "utf-8" });
  });

  afterAll(() => {
    if (fs.existsSync(BOARDS_CSV)) {
      fs.unlinkSync(BOARDS_CSV);
    }
    delete process.env.BOARDS_CSV_PATH;
  });

  it("creates boards with incremental order per project", async () => {
    const p1 = "project-1";
    const p2 = "project-2";
    const b1 = await createBoard("Board A", p1);
    const b2 = await createBoard("Board B", p1);
    const bOther = await createBoard("Board C", p2);

    expect(b1.ok && b2.ok && bOther.ok).toBe(true);
    if (b2.ok) expect(b2.value.order).toBe(2);
    if (bOther.ok) expect(bOther.value.order).toBe(1);
  });

  it("lists boards filtered by project and sorted by order", async () => {
    await createBoard("Board A", "p1");
    await createBoard("Board B", "p1");
    await createBoard("Board C", "p2");

    const result = await listBoards("p1");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.every((b) => b.projectId === "p1")).toBe(true);
      expect(result.value[0].order).toBeLessThanOrEqual(result.value[1].order);
    }
  });

  it("deletes a board by id", async () => {
    const created = await createBoard("Kill me", "p1");
    if (!created.ok) throw new Error("create failed");

    const del = await deleteBoard(created.value.id);
    expect(del.ok).toBe(true);

    const list = await listBoards("p1");
    expect(list.ok).toBe(true);
    if (list.ok) expect(list.value.length).toBe(0);
  });

  it("returns error when deleting missing board", async () => {
    const del = await deleteBoard("missing-id");
    expect(del.ok).toBe(false);
    if (!del.ok) expect(del.error).toBe("board_not_found");
  });
});
