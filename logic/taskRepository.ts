import path from "path";
import { err, ok, type Result } from "@/types/result";
import { readCsv } from "@/utils/csv/readCsv";
import { writeCsv } from "@/utils/csv/writeCsv";
import { generateId } from "@/utils/id";
import type { Task } from "@/types/task";

const TASK_HEADER = ["id", "list_id", "title", "description", "created_at", "updated_at", "order"] as const;
type TaskRow = Record<(typeof TASK_HEADER)[number], string>;

const ENV_TASKS_CSV = "TASKS_CSV_PATH";
const ENV_LISTS_CSV = "LISTS_CSV_PATH";

function getTasksCsvPath(): string {
  const custom = process.env[ENV_TASKS_CSV];
  if (custom) return path.isAbsolute(custom) ? custom : path.join(process.cwd(), custom);
  return path.join(process.cwd(), "db", "tasks.csv");
}

function getListsCsvPath(): string {
  const custom = process.env[ENV_LISTS_CSV];
  if (custom) return path.isAbsolute(custom) ? custom : path.join(process.cwd(), custom);
  return path.join(process.cwd(), "db", "lists.csv");
}

function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    listId: row.list_id,
    title: row.title,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    order: Number(row.order) || 0
  };
}

function toRow(task: Task): TaskRow {
  return {
    id: task.id,
    list_id: task.listId,
    title: task.title,
    description: task.description,
    created_at: task.createdAt,
    updated_at: task.updatedAt,
    order: task.order.toString()
  };
}

/**
 * List tasks for all lists in a board, ordered by order asc.
 */
export async function listTasksByBoard(boardId: string): Promise<Result<Task[]>> {
  const listsCsv = getListsCsvPath();
  const listsResult = await readCsv(listsCsv, ["id", "board_id", "name", "created_at", "order"], true);
  if (!listsResult.ok) return err("csv_read_failed");
  const listIds = new Set(
    (listsResult.value as Record<string, string>[]).filter((row) => row.board_id === boardId).map((row) => row.id)
  );

  const tasksCsv = getTasksCsvPath();
  const tasksResult = await readCsv(tasksCsv, TASK_HEADER as unknown as string[], true);
  if (!tasksResult.ok) return err("csv_read_failed");

  const tasks = (tasksResult.value as TaskRow[])
    .filter((row) => listIds.has(row.list_id))
    .map((row) => toTask(row))
    .sort((a, b) => a.order - b.order);

  return ok(tasks);
}

/**
 * Create a new task in the list.
 */
export async function createTask(listId: string, title: string, description: string): Promise<Result<Task>> {
  const trimmed = title.trim();
  if (!trimmed) return err("task_title_required");

  const tasksCsv = getTasksCsvPath();
  const readResult = await readCsv(tasksCsv, TASK_HEADER as unknown as string[], true);
  if (!readResult.ok) return err("csv_read_failed");

  const rows = readResult.value as TaskRow[];
  const nextOrder =
    rows
      .filter((row) => row.list_id === listId)
      .map((row) => Number(row.order) || 0)
      .reduce((max, val) => Math.max(max, val), 0) + 1;

  const now = new Date().toISOString();
  const task: Task = {
    id: generateId(),
    listId,
    title: trimmed,
    description: description ?? "",
    createdAt: now,
    updatedAt: now,
    order: nextOrder
  };

  const writeResult = await writeCsv(tasksCsv, TASK_HEADER as unknown as string[], [...rows, toRow(task)]);
  if (!writeResult.ok) return err("csv_write_failed");
  return ok(task);
}

/**
 * Update title/description of a task.
 */
export async function updateTask(id: string, fields: { title?: string; description?: string }): Promise<Result<Task>> {
  const tasksCsv = getTasksCsvPath();
  const readResult = await readCsv(tasksCsv, TASK_HEADER as unknown as string[], true);
  if (!readResult.ok) return err("csv_read_failed");

  const rows = readResult.value as TaskRow[];
  const idx = rows.findIndex((row) => row.id === id);
  if (idx === -1) return err("task_not_found");

  const existing = rows[idx];
  const trimmed = fields.title?.trim() ?? existing.title;
  if (!trimmed) return err("task_title_required");

  const updated: Task = {
    id: existing.id,
    listId: existing.list_id,
    title: trimmed,
    description: fields.description ?? existing.description,
    createdAt: existing.created_at,
    updatedAt: new Date().toISOString(),
    order: Number(existing.order) || 0
  };

  rows[idx] = toRow(updated);
  const writeResult = await writeCsv(tasksCsv, TASK_HEADER as unknown as string[], rows);
  if (!writeResult.ok) return err("csv_write_failed");
  return ok(updated);
}

/**
 * Delete a task by id.
 */
export async function deleteTask(id: string): Promise<Result<null>> {
  const tasksCsv = getTasksCsvPath();
  const readResult = await readCsv(tasksCsv, TASK_HEADER as unknown as string[], true);
  if (!readResult.ok) return err("csv_read_failed");
  const rows = readResult.value as TaskRow[];
  const filtered = rows.filter((row) => row.id !== id);
  if (filtered.length === rows.length) return err("task_not_found");
  const writeResult = await writeCsv(tasksCsv, TASK_HEADER as unknown as string[], filtered);
  if (!writeResult.ok) return err("csv_write_failed");
  return ok(null);
}

/**
 * Delete all tasks of a list.
 */
export async function deleteTasksByList(listId: string): Promise<Result<null>> {
  const tasksCsv = getTasksCsvPath();
  const readResult = await readCsv(tasksCsv, TASK_HEADER as unknown as string[], true);
  if (!readResult.ok) return err("csv_read_failed");
  const rows = readResult.value as TaskRow[];
  const filtered = rows.filter((row) => row.list_id !== listId);
  const writeResult = await writeCsv(tasksCsv, TASK_HEADER as unknown as string[], filtered);
  if (!writeResult.ok) return err("csv_write_failed");
  return ok(null);
}

/**
 * Reorder tasks inside a list according to taskIdsInOrder.
 */
export async function reorderTasksWithinList(listId: string, taskIdsInOrder: string[]): Promise<Result<null>> {
  const tasksCsv = getTasksCsvPath();
  const readResult = await readCsv(tasksCsv, TASK_HEADER as unknown as string[], true);
  if (!readResult.ok) return err("csv_read_failed");

  const rows = readResult.value as TaskRow[];
  const target = rows.filter((row) => row.list_id === listId);
  const others = rows.filter((row) => row.list_id !== listId);

  const orderMap = new Map(taskIdsInOrder.map((id, idx) => [id, idx]));
  const sorted = target
    .slice()
    .sort((a, b) => {
      const aOrder = orderMap.has(a.id) ? orderMap.get(a.id)! : Number.MAX_SAFE_INTEGER;
      const bOrder = orderMap.has(b.id) ? orderMap.get(b.id)! : Number.MAX_SAFE_INTEGER;
      return aOrder - bOrder;
    })
    .map((row, idx) => ({ ...row, order: String(idx + 1) }));

  const newRows = [...others, ...sorted];
  const writeResult = await writeCsv(tasksCsv, TASK_HEADER as unknown as string[], newRows);
  if (!writeResult.ok) return err("csv_write_failed");
  return ok(null);
}

/**
 * Move task between lists or within a list via DnD.
 */
export async function moveTaskDnd(
  taskId: string,
  fromListId: string,
  toListId: string,
  newIndex: number
): Promise<Result<Task>> {
  const tasksCsv = getTasksCsvPath();
  const readResult = await readCsv(tasksCsv, TASK_HEADER as unknown as string[], true);
  if (!readResult.ok) return err("csv_read_failed");
  const rows = readResult.value as TaskRow[];

  const targetIdx = rows.findIndex((row) => row.id === taskId && row.list_id === fromListId);
  if (targetIdx === -1) return err("task_not_found");

  const moving = rows[targetIdx];
  const fromTasks = rows.filter((row) => row.list_id === fromListId && row.id !== taskId);
  const toTasks = rows.filter((row) => row.list_id === toListId);
  const others = rows.filter((row) => row.list_id !== fromListId && row.list_id !== toListId);

  const normalizedIndex = Math.max(0, Math.min(newIndex, toTasks.length));
  const updatedAt = new Date().toISOString();

  const reorderedFrom = [...fromTasks]
    .sort((a, b) => Number(a.order) - Number(b.order))
    .map((row, idx) => ({ ...row, order: String(idx + 1) }));

  const orderedTo = [...toTasks].sort((a, b) => Number(a.order) - Number(b.order));
  const withInserted = [
    ...orderedTo.slice(0, normalizedIndex),
    { ...moving, list_id: toListId, order: String(normalizedIndex + 1), updated_at: updatedAt },
    ...orderedTo.slice(normalizedIndex)
  ];
  const reorderedTo = withInserted.map((row, idx) => ({
    ...row,
    order: String(idx + 1),
    updated_at: row.updated_at ?? updatedAt
  }));

  const newRows = [...others, ...reorderedFrom, ...reorderedTo];
  const writeResult = await writeCsv(tasksCsv, TASK_HEADER as unknown as string[], newRows);
  if (!writeResult.ok) return err("csv_write_failed");

  const updated = toTask({
    ...moving,
    list_id: toListId,
    order: String(normalizedIndex + 1),
    updated_at: updatedAt
  });
  return ok(updated);
}

/**
 * Return tasks CSV path (honors TASKS_CSV_PATH env override).
 */
export function getTasksCsv(): string {
  return getTasksCsvPath();
}
