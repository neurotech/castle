import fs from "node:fs";
import path from "node:path";

const uploadsPath = process.env.UPLOADS_PATH || "./data/uploads";

export function getUploadsPath(): string {
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
  return uploadsPath;
}

export function isPathSafe(filePath: string): boolean {
  const uploadsDir = path.resolve(getUploadsPath());
  const resolvedPath = path.resolve(filePath);
  return (
    resolvedPath.startsWith(uploadsDir + path.sep) ||
    resolvedPath === uploadsDir
  );
}

export async function saveFile(file: File, filename: string): Promise<string> {
  const uploadDir = getUploadsPath();
  const filePath = path.join(uploadDir, filename);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  fs.writeFileSync(filePath, buffer);
  return filePath;
}

export function deleteFile(filePath: string): void {
  if (!isPathSafe(filePath)) {
    throw new Error("Invalid file path");
  }
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export function getFile(filePath: string): Buffer | null {
  if (!isPathSafe(filePath)) {
    throw new Error("Invalid file path");
  }
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath);
  }
  return null;
}
