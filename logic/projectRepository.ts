import path from "path";
import { err, ok, type Result } from "@/types/result";
import { readCsv } from "@/utils/csv/readCsv";
import { writeCsv } from "@/utils/csv/writeCsv";
import { generateId } from "@/utils/id";
import type { Project } from "@/types/project";

const PROJECT_HEADER = ["id", "user_id", "name", "created_at", "updated_at", "order"] as const;

type ProjectRow = Record<(typeof PROJECT_HEADER)[number], string>;

const ENV_PROJECTS_CSV = "PROJECTS_CSV_PATH";

function getProjectsCsvPath(): string {
  const custom = process.env[ENV_PROJECTS_CSV];
  if (custom) {
    return path.isAbsolute(custom) ? custom : path.join(process.cwd(), custom);
  }
  return path.join(process.cwd(), "db", "projects.csv");
}

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    order: Number(row.order) || 0
  };
}

function toRow(project: Project): ProjectRow {
  return {
    id: project.id,
    user_id: project.userId,
    name: project.name,
    created_at: project.createdAt,
    updated_at: project.updatedAt,
    order: project.order.toString()
  };
}

/**
 * List projects for a user ordered by `order` ascending.
 */
export async function listProjects(userId: string): Promise<Result<Project[]>> {
  const csvPath = getProjectsCsvPath();
  const result = await readCsv(csvPath, PROJECT_HEADER as unknown as string[], true);
  if (!result.ok) {
    return err("csv_read_failed");
  }

  const projects = result.value
    .filter((row) => row.user_id === userId)
    .map((row) => toProject(row as ProjectRow))
    .sort((a, b) => a.order - b.order);

  return ok(projects);
}

/**
 * Create project for a user and append to CSV.
 */
export async function createProject(name: string, userId: string): Promise<Result<Project>> {
  const trimmed = name.trim();
  if (!trimmed) {
    return err("project_name_required");
  }

  const csvPath = getProjectsCsvPath();
  const readResult = await readCsv(csvPath, PROJECT_HEADER as unknown as string[], true);
  if (!readResult.ok) {
    return err("csv_read_failed");
  }

  const existingRows = readResult.value as ProjectRow[];
  const nextOrder =
    existingRows
      .filter((row) => row.user_id === userId)
      .map((row) => Number(row.order) || 0)
      .reduce((max, val) => Math.max(max, val), 0) + 1;

  const now = new Date().toISOString();
  const project: Project = {
    id: generateId(),
    userId,
    name: trimmed,
    createdAt: now,
    updatedAt: now,
    order: nextOrder
  };

  const rows: ProjectRow[] = [...existingRows, toRow(project)];
  const writeResult = await writeCsv(csvPath, PROJECT_HEADER as unknown as string[], rows);
  if (!writeResult.ok) {
    return err("csv_write_failed");
  }

  return ok(project);
}

/**
 * Delete a project by id/userId.
 */
export async function deleteProject(id: string, userId: string): Promise<Result<null>> {
  const csvPath = getProjectsCsvPath();
  const readResult = await readCsv(csvPath, PROJECT_HEADER as unknown as string[], true);
  if (!readResult.ok) {
    return err("csv_read_failed");
  }

  const existingRows = readResult.value as ProjectRow[];
  const filtered = existingRows.filter((row) => !(row.id === id && row.user_id === userId));

  if (filtered.length === existingRows.length) {
    return err("project_not_found");
  }

  const writeResult = await writeCsv(csvPath, PROJECT_HEADER as unknown as string[], filtered);
  if (!writeResult.ok) {
    return err("csv_write_failed");
  }

  return ok(null);
}
