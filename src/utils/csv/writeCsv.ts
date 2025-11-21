import fs from "fs";
import path from "path";
import { err, ok, type Result } from "@/types/result";

const ENCODING = "utf-8";

function ensureAbsolutePath(filePath: string): string {
  if (path.isAbsolute(filePath)) return filePath;
  return path.join(process.cwd(), filePath);
}

/**
 * Write rows to a CSV file with the provided header.
 * Replaces the entire content (header + rows).
 */
export async function writeCsv(
  filePath: string,
  header: string[],
  rows: Array<Record<string, string>>
): Promise<Result<null>> {
  try {
    const absPath = ensureAbsolutePath(filePath);
    fs.mkdirSync(path.dirname(absPath), { recursive: true });

    const lines: string[] = [];
    lines.push(header.join(","));
    rows.forEach((row) => {
      const values = header.map((key) => (row[key] ?? "").replace(/\n/g, " "));
      lines.push(values.join(","));
    });

    const content = lines.join("\n") + "\n";
    fs.writeFileSync(absPath, content, { encoding: ENCODING });
    return ok(null);
  } catch (error) {
    return err("csv_write_failed");
  }
}
