"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db";
import { appliances } from "@/db/schema";
import {
  type ActionResult,
  createErrorResult,
  createSuccessResult,
} from "@/lib/action-result";
import { applianceSchema, parseFormData } from "@/lib/validations";

export async function getAppliancesByRoom(roomId: string) {
  return await db.query.appliances.findMany({
    where: eq(appliances.roomId, roomId),
    orderBy: (appliances, { asc }) => [asc(appliances.name)],
  });
}

export async function getAppliance(id: string) {
  return await db.query.appliances.findFirst({
    where: eq(appliances.id, id),
  });
}

export async function createAppliance(
  roomId: string,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    const validated = parseFormData(formData, applianceSchema);
    const id = uuidv4();
    const now = new Date();

    await db.insert(appliances).values({
      id,
      roomId,
      name: validated.name,
      brand: validated.brand || null,
      modelNumber: validated.modelNumber || null,
      serialNumber: validated.serialNumber || null,
      purchaseDate: validated.purchaseDate
        ? new Date(validated.purchaseDate)
        : null,
      warrantyExpiration: validated.warrantyExpiration
        ? new Date(validated.warrantyExpiration)
        : null,
      notes: validated.notes || null,
      createdAt: now,
      updatedAt: now,
    });

    revalidatePath(`/rooms/${roomId}`);
    return createSuccessResult({ id });
  } catch (error) {
    return createErrorResult(error);
  }
}

export async function updateAppliance(
  id: string,
  roomId: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const validated = parseFormData(formData, applianceSchema);

    await db
      .update(appliances)
      .set({
        name: validated.name,
        brand: validated.brand || null,
        modelNumber: validated.modelNumber || null,
        serialNumber: validated.serialNumber || null,
        purchaseDate: validated.purchaseDate
          ? new Date(validated.purchaseDate)
          : null,
        warrantyExpiration: validated.warrantyExpiration
          ? new Date(validated.warrantyExpiration)
          : null,
        notes: validated.notes || null,
        updatedAt: new Date(),
      })
      .where(eq(appliances.id, id));

    revalidatePath(`/rooms/${roomId}`);
    return createSuccessResult();
  } catch (error) {
    return createErrorResult(error);
  }
}

export async function deleteAppliance(
  id: string,
  roomId: string,
): Promise<ActionResult> {
  try {
    await db.delete(appliances).where(eq(appliances.id, id));
    revalidatePath(`/rooms/${roomId}`);
    return createSuccessResult();
  } catch (error) {
    return createErrorResult(error);
  }
}
