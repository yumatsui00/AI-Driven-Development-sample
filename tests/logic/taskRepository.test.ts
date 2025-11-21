import fs from "fs";
import path from "path";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { createTask, listTasksByBoard, moveTaskDnd, reorderTasksWithinList } from "@/logic/taskRepository";

const TASKS_CSV = path.join(process.cwd(), "db", "tasks.test.csv");
const LISTS_CSV = path.join(process.cwd(), "db", "lists.test.csv");
const TASK_HEADER = "id,list_id,title,description,created_at,updated_at,order\n";
const LIST_HEADER = "id,board_id,name,created_at,order\n";

describe("taskRepository", () => {
  beforeEach(() => {
    process.env.TASKS_CSV_PATH = TASKS_CSV;
    process.env.LISTS_CSV_PATH = LISTS_CSV;
    fs.writeFileSync(TASKS_CSV, TASK_HEADER, { encoding: "utf-8" });
    const now = new Date().toISOString();
    fs.writeFileSync(LISTS_CSV, `${LIST_HEADER}list-a,board-1,Todo,${now},1\nlist-b,board-1,Doing,${now},2\n`, {
      encoding: "utf-8"
    });
  });

  afterAll(() => {
    delete process.env.TASKS_CSV_PATH;
    delete process.env.LISTS_CSV_PATH;
    if (fs.existsSync(TASKS_CSV)) fs.unlinkSync(TASKS_CSV);
    if (fs.existsSync(LISTS_CSV)) fs.unlinkSync(LISTS_CSV);
  });

  it("reorders tasks within a list", async () => {
    const t1 = await createTask("list-a", "Task 1", "");
    const t2 = await createTask("list-a", "Task 2", "");
    const t3 = await createTask("list-a", "Task 3", "");
    expect(t1.ok && t2.ok && t3.ok).toBe(true);
    if (!t1.ok || !t2.ok || !t3.ok) throw new Error("create failed");

    const reorder = await reorderTasksWithinList("list-a", [t3.value.id, t1.value.id, t2.value.id]);
    expect(reorder.ok).toBe(true);

    const tasks = await listTasksByBoard("board-1");
    expect(tasks.ok).toBe(true);
    if (tasks.ok) {
      const listTasks = tasks.value.filter((t) => t.listId === "list-a");
      expect(listTasks.map((t) => t.id)).toEqual([t3.value.id, t1.value.id, t2.value.id]);
      expect(listTasks.map((t) => t.order)).toEqual([1, 2, 3]);
    }
  });

  it("moves a task between lists and normalizes order", async () => {
    const t1 = await createTask("list-a", "Task 1", "");
    const t2 = await createTask("list-a", "Task 2", "");
    await createTask("list-b", "Existing", "");
    if (!t1.ok || !t2.ok) throw new Error("create failed");

    const move = await moveTaskDnd(t1.value.id, "list-a", "list-b", 0);
    expect(move.ok).toBe(true);

    const tasks = await listTasksByBoard("board-1");
    expect(tasks.ok).toBe(true);
    if (tasks.ok) {
      const listA = tasks.value.filter((t) => t.listId === "list-a");
      const listB = tasks.value.filter((t) => t.listId === "list-b");
      expect(listA.map((t) => t.id)).toEqual([t2.value.id]);
      expect(listA[0].order).toBe(1);
      expect(listB.map((t) => t.id)).toContain(t1.value.id);
      expect(listB[0].order).toBe(1);
    }
  });
});
