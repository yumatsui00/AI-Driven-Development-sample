import path from "path";
import { err, ok, type Result } from "@/types/result";
import { readCsv } from "@/utils/csv/readCsv";
import { writeCsv } from "@/utils/csv/writeCsv";
import { generateId } from "@/utils/id";
import type { List } from "@/types/list";
import { deleteTasksByList } from "@/logic/taskRepository";

const LIST_HEADER = ["id", "board_id", "name", "created_at", "order"] as const;
type ListRow = Record<(typeof LIST_HEADER)[number], string>;

const ENV_LISTS_CSV = "LISTS_CSV_PATH";

function getListsCsvPath(): string {
  const custom = process.env[ENV_LISTS_CSV];
  if (custom) return path.isAbsolute(custom) ? custom : path.join(process.cwd(), custom);
  return path.join(process.cwd(), "db", "lists.csv");
}

function toList(row: ListRow): List {
  return {
    id: row.id,
    boardId: row.board_id,
    name: row.name,
    createdAt: row.created_at,
    order: Number(row.order) || 0
  };
}

function toRow(list: List): ListRow {
  return {
    id: list.id,
    board_id: list.boardId,
    name: list.name,
    created_at: list.createdAt,
    order: list.order.toString()
  };
}

/**
 * Get lists for a board, ordered by order ascending.
 */
export async function getLists(boardId: string): Promise<Result<List[]>> {
  const csvPath = getListsCsvPath();
  const result = await readCsv(csvPath, LIST_HEADER as unknown as string[], true);
  if (!result.ok) return err("csv_read_failed");
  const lists = (result.value as ListRow[])
    .filter((row) => row.board_id === boardId)
    .map((row) => toList(row))
    .sort((a, b) => a.order - b.order);
  return ok(lists);
}

/**
 * Create a new list under a board.
 */
export async function createList(name: string, boardId: string): Promise<Result<List>> {
  const trimmed = name.trim();
  if (!trimmed) return err("list_name_required");
  const csvPath = getListsCsvPath();
  const readResult = await readCsv(csvPath, LIST_HEADER as unknown as string[], true);
  if (!readResult.ok) return err("csv_read_failed");

  const rows = readResult.value as ListRow[];
  const nextOrder =
    rows
      .filter((row) => row.board_id === boardId)
      .map((row) => Number(row.order) || 0)
      .reduce((max, val) => Math.max(max, val), 0) + 1;

  const now = new Date().toISOString();
  const list: List = { id: generateId(), boardId, name: trimmed, createdAt: now, order: nextOrder };
  const writeResult = await writeCsv(csvPath, LIST_HEADER as unknown as string[], [...rows, toRow(list)]);
  if (!writeResult.ok) return err("csv_write_failed");
  return ok(list);
}

/**
 * Delete a list and cascade delete its tasks.
 */
export async function deleteList(id: string, boardId: string): Promise<Result<null>> {
  const csvPath = getListsCsvPath();
  const readResult = await readCsv(csvPath, LIST_HEADER as unknown as string[], true);
  if (!readResult.ok) return err("csv_read_failed");

  const rows = readResult.value as ListRow[];
  const filtered = rows.filter((row) => !(row.id === id && row.board_id === boardId));
  if (filtered.length === rows.length) return err("list_not_found");

  const writeResult = await writeCsv(csvPath, LIST_HEADER as unknown as string[], filtered);
  if (!writeResult.ok) return err("csv_write_failed");

  const tasksCleanup = await deleteTasksByList(id);
  if (!tasksCleanup.ok) {
    return err(tasksCleanup.error);
  }

  return ok(null);
}

/**
 * Return the lists CSV path (honors LISTS_CSV_PATH env override).
 */
export function getListsCsv(): string {
  return getListsCsvPath();
}
