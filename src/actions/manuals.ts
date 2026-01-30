"use server";

import path from "node:path";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db";
import { manuals } from "@/db/schema";
import {
  type ActionResult,
  createErrorResult,
  createSuccessResult,
} from "@/lib/action-result";
import { deleteFile, saveFile } from "@/lib/files";
import { manualSchema, parseFormData } from "@/lib/validations";

const ALLOWED_MIME_TYPES = ["application/pdf"];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

function validateFile(file: File): void {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(
      `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    );
  }
}

export async function getManualsByRoom(roomId: string) {
  return await db.query.manuals.findMany({
    where: eq(manuals.roomId, roomId),
    orderBy: (manuals, { desc }) => [desc(manuals.createdAt)],
  });
}

export async function getManual(id: string) {
  return await db.query.manuals.findFirst({
    where: eq(manuals.id, id),
  });
}

export async function createManual(
  roomId: string,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    const validated = parseFormData(formData, manualSchema);
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
      throw new Error("File is required");
    }

    validateFile(file);

    const id = uuidv4();
    const ext = path.extname(file.name);
    const filename = `${id}${ext}`;
    const filePath = await saveFile(file, filename);
    const now = new Date();

    await db.insert(manuals).values({
      id,
      roomId,
      title: validated.title,
      description: validated.description || null,
      filename: file.name,
      filePath,
      fileSize: file.size,
      createdAt: now,
      updatedAt: now,
    });

    revalidatePath(`/rooms/${roomId}`);
    return createSuccessResult({ id });
  } catch (error) {
    return createErrorResult(error);
  }
}

export async function updateManual(
  id: string,
  roomId: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const validated = parseFormData(formData, manualSchema);
    const file = formData.get("file") as File | null;

    const existing = await getManual(id);
    if (!existing) {
      throw new Error("Manual not found");
    }

    let filePath = existing.filePath;
    let filename = existing.filename;
    let fileSize = existing.fileSize;

    if (file && file.size > 0) {
      validateFile(file);
      // Delete old file
      deleteFile(existing.filePath);

      // Save new file
      const ext = path.extname(file.name);
      const newFilename = `${id}${ext}`;
      filePath = await saveFile(file, newFilename);
      filename = file.name;
      fileSize = file.size;
    }

    await db
      .update(manuals)
      .set({
        title: validated.title,
        description: validated.description || null,
        filename,
        filePath,
        fileSize,
        updatedAt: new Date(),
      })
      .where(eq(manuals.id, id));

    revalidatePath(`/rooms/${roomId}`);
    return createSuccessResult();
  } catch (error) {
    return createErrorResult(error);
  }
}

export async function deleteManual(
  id: string,
  roomId: string,
): Promise<ActionResult> {
  try {
    const manual = await getManual(id);
    if (manual) {
      deleteFile(manual.filePath);
    }

    await db.delete(manuals).where(eq(manuals.id, id));
    revalidatePath(`/rooms/${roomId}`);
    return createSuccessResult();
  } catch (error) {
    return createErrorResult(error);
  }
}
