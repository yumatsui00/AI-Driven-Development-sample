import path from "path";
import { err, ok, type Result } from "@/types/result";
import { readCsv } from "@/utils/csv/readCsv";
import { writeCsv } from "@/utils/csv/writeCsv";
import { generateId } from "@/utils/id";
import type { Board } from "@/types/board";

const BOARD_HEADER = ["id", "project_id", "name", "created_at", "updated_at", "order"] as const;
type BoardRow = Record<(typeof BOARD_HEADER)[number], string>;

const ENV_BOARDS_CSV = "BOARDS_CSV_PATH";

function getBoardsCsvPath(): string {
  const custom = process.env[ENV_BOARDS_CSV];
  if (custom) {
    return path.isAbsolute(custom) ? custom : path.join(process.cwd(), custom);
  }
  return path.join(process.cwd(), "db", "boards.csv");
}

function toBoard(row: BoardRow): Board {
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    order: Number(row.order) || 0
  };
}

function toRow(board: Board): BoardRow {
  return {
    id: board.id,
    project_id: board.projectId,
    name: board.name,
    created_at: board.createdAt,
    updated_at: board.updatedAt,
    order: board.order.toString()
  };
}

export async function listBoards(projectId: string): Promise<Result<Board[]>> {
  const csvPath = getBoardsCsvPath();
  const result = await readCsv(csvPath, BOARD_HEADER as unknown as string[], true);
  if (!result.ok) {
    return err("csv_read_failed");
  }
  const boards = (result.value as BoardRow[])
    .filter((row) => row.project_id === projectId)
    .map((row) => toBoard(row))
    .sort((a, b) => a.order - b.order);
  return ok(boards);
}

export async function createBoard(name: string, projectId: string): Promise<Result<Board>> {
  const trimmed = name.trim();
  if (!trimmed) {
    return err("board_name_required");
  }

  const csvPath = getBoardsCsvPath();
  const readResult = await readCsv(csvPath, BOARD_HEADER as unknown as string[], true);
  if (!readResult.ok) {
    return err("csv_read_failed");
  }

  const rows = readResult.value as BoardRow[];
  const nextOrder =
    rows
      .filter((row) => row.project_id === projectId)
      .map((row) => Number(row.order) || 0)
      .reduce((max, val) => Math.max(max, val), 0) + 1;

  const now = new Date().toISOString();
  const board: Board = {
    id: generateId(),
    projectId,
    name: trimmed,
    createdAt: now,
    updatedAt: now,
    order: nextOrder
  };

  const newRows = [...rows, toRow(board)];
  const writeResult = await writeCsv(csvPath, BOARD_HEADER as unknown as string[], newRows);
  if (!writeResult.ok) {
    return err("csv_write_failed");
  }

  return ok(board);
}

export async function deleteBoard(id: string): Promise<Result<null>> {
  const csvPath = getBoardsCsvPath();
  const readResult = await readCsv(csvPath, BOARD_HEADER as unknown as string[], true);
  if (!readResult.ok) {
    return err("csv_read_failed");
  }
  const rows = readResult.value as BoardRow[];
  const filtered = rows.filter((row) => row.id !== id);
  if (filtered.length === rows.length) {
    return err("board_not_found");
  }
  const writeResult = await writeCsv(csvPath, BOARD_HEADER as unknown as string[], filtered);
  if (!writeResult.ok) {
    return err("csv_write_failed");
  }
  return ok(null);
}

export async function getBoardById(id: string): Promise<Result<Board | null>> {
  const csvPath = getBoardsCsvPath();
  const readResult = await readCsv(csvPath, BOARD_HEADER as unknown as string[], true);
  if (!readResult.ok) return err("csv_read_failed");
  const rows = readResult.value as BoardRow[];
  const found = rows.find((row) => row.id === id);
  return ok(found ? toBoard(found) : null);
}

export function getBoardsCsv(): string {
  return getBoardsCsvPath();
}
