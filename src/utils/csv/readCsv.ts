import fs from "fs";
import path from "path";
import { err, ok, type Result } from "@/types/result";

const ENCODING = "utf-8";

function ensureAbsolutePath(filePath: string): string {
  if (path.isAbsolute(filePath)) return filePath;
  return path.join(process.cwd(), filePath);
}

/**
 * Read a CSV file and return rows split by header.
 * If file is missing, initialize it with the provided header when createIfMissing is true.
 */
export async function readCsv(
  filePath: string,
  header: string[],
  createIfMissing = false
): Promise<Result<Array<Record<string, string>>>> {
  try {
    const absPath = ensureAbsolutePath(filePath);
    const exists = fs.existsSync(absPath);
    if (!exists) {
      if (!createIfMissing) {
        return err("csv_not_found");
      }
      const headerLine = header.join(",") + "\n";
      fs.mkdirSync(path.dirname(absPath), { recursive: true });
      fs.writeFileSync(absPath, headerLine, { encoding: ENCODING });
      return ok([]);
    }

    const content = fs.readFileSync(absPath, { encoding: ENCODING });
    const lines = content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      return ok([]);
    }

    const fileHeader = lines[0].split(",");
    if (fileHeader.length !== header.length || !fileHeader.every((h, i) => h === header[i])) {
      return err("csv_header_mismatch");
    }

    const rows = lines.slice(1).map((line) => {
      const values = line.split(",");
      const record: Record<string, string> = {};
      header.forEach((key, idx) => {
        record[key] = values[idx] ?? "";
      });
      return record;
    });

    return ok(rows);
  } catch (error) {
    return err("csv_read_failed");
  }
}
