import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { deleteFile, getFile, getUploadsPath, isPathSafe } from "./files";

describe("isPathSafe", () => {
  let uploadsPath: string;

  beforeEach(() => {
    uploadsPath = getUploadsPath();
  });

  afterEach(() => {
    // Clean up any test files
  });

  it("returns true for paths within uploads directory", () => {
    const safePath = path.join(uploadsPath, "test-file.pdf");
    expect(isPathSafe(safePath)).toBe(true);
  });

  it("returns true for nested paths within uploads directory", () => {
    const safePath = path.join(uploadsPath, "subdir", "test-file.pdf");
    expect(isPathSafe(safePath)).toBe(true);
  });

  it("returns false for path traversal attempts", () => {
    const unsafePath = path.join(uploadsPath, "..", "etc", "passwd");
    expect(isPathSafe(unsafePath)).toBe(false);
  });

  it("returns false for paths outside uploads directory", () => {
    expect(isPathSafe("/etc/passwd")).toBe(false);
    expect(isPathSafe("/tmp/other-file.txt")).toBe(false);
  });

  it("returns false for relative path traversal", () => {
    const unsafePath = path.join(uploadsPath, "..", "..", "sensitive");
    expect(isPathSafe(unsafePath)).toBe(false);
  });
});

describe("getFile", () => {
  let uploadsPath: string;
  let testFilePath: string;

  beforeEach(() => {
    uploadsPath = getUploadsPath();
    testFilePath = path.join(uploadsPath, "test-getfile.txt");
  });

  afterEach(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  it("throws error for path traversal attempts", () => {
    const unsafePath = path.join(uploadsPath, "..", "etc", "passwd");
    expect(() => getFile(unsafePath)).toThrow("Invalid file path");
  });

  it("returns null for non-existent files", () => {
    const safePath = path.join(uploadsPath, "nonexistent-file.pdf");
    expect(getFile(safePath)).toBeNull();
  });

  it("returns file buffer for existing files", () => {
    fs.writeFileSync(testFilePath, "test content");

    const result = getFile(testFilePath);
    expect(result).not.toBeNull();
    expect(result?.toString()).toBe("test content");
  });
});

describe("deleteFile", () => {
  let uploadsPath: string;
  let testFilePath: string;

  beforeEach(() => {
    uploadsPath = getUploadsPath();
    testFilePath = path.join(uploadsPath, "test-delete.txt");
  });

  afterEach(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  it("throws error for path traversal attempts", () => {
    const unsafePath = path.join(uploadsPath, "..", "etc", "passwd");
    expect(() => deleteFile(unsafePath)).toThrow("Invalid file path");
  });

  it("does not throw for non-existent files within uploads", () => {
    const safePath = path.join(uploadsPath, "nonexistent-delete.pdf");
    expect(() => deleteFile(safePath)).not.toThrow();
  });

  it("deletes existing files", () => {
    fs.writeFileSync(testFilePath, "test content");
    expect(fs.existsSync(testFilePath)).toBe(true);

    deleteFile(testFilePath);
    expect(fs.existsSync(testFilePath)).toBe(false);
  });
});

describe("getUploadsPath", () => {
  it("returns a valid path string", () => {
    const result = getUploadsPath();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("creates uploads directory if it does not exist", () => {
    const result = getUploadsPath();
    expect(fs.existsSync(result)).toBe(true);
  });
});
