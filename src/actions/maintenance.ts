"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db";
import { maintenance, rooms } from "@/db/schema";
import {
  type ActionResult,
  createErrorResult,
  createSuccessResult,
} from "@/lib/action-result";
import { enrichTaskWithDueDate, sortTasksByDueDate } from "@/lib/maintenance";
import { maintenanceSchema, parseFormData } from "@/lib/validations";
import type { MaintenanceFrequency, MaintenanceTaskWithDueDate } from "@/types";

export async function getMaintenanceByRoom(roomId: string) {
  const tasks = await db.query.maintenance.findMany({
    where: eq(maintenance.roomId, roomId),
    orderBy: (maintenance, { asc }) => [asc(maintenance.taskName)],
  });

  return sortTasksByDueDate(tasks.map(enrichTaskWithDueDate));
}

export async function getAllMaintenance(): Promise<
  (MaintenanceTaskWithDueDate & { roomName: string })[]
> {
  const tasks = await db
    .select({
      id: maintenance.id,
      roomId: maintenance.roomId,
      taskName: maintenance.taskName,
      description: maintenance.description,
      frequency: maintenance.frequency,
      lastCompleted: maintenance.lastCompleted,
      createdAt: maintenance.createdAt,
      updatedAt: maintenance.updatedAt,
      roomName: rooms.name,
    })
    .from(maintenance)
    .innerJoin(rooms, eq(maintenance.roomId, rooms.id));

  const enrichedTasks = tasks.map((task) => ({
    ...enrichTaskWithDueDate({
      id: task.id,
      roomId: task.roomId,
      taskName: task.taskName,
      description: task.description,
      frequency: task.frequency as MaintenanceFrequency,
      lastCompleted: task.lastCompleted,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }),
    roomName: task.roomName,
  }));

  return sortTasksByDueDate(enrichedTasks) as (MaintenanceTaskWithDueDate & {
    roomName: string;
  })[];
}

export async function getMaintenanceTask(id: string) {
  return await db.query.maintenance.findFirst({
    where: eq(maintenance.id, id),
  });
}

export async function createMaintenanceTask(
  roomId: string,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    const validated = parseFormData(formData, maintenanceSchema);
    const id = uuidv4();
    const now = new Date();

    await db.insert(maintenance).values({
      id,
      roomId,
      taskName: validated.taskName,
      description: validated.description || null,
      frequency: validated.frequency as MaintenanceFrequency,
      lastCompleted: null,
      createdAt: now,
      updatedAt: now,
    });

    revalidatePath(`/rooms/${roomId}`);
    revalidatePath("/maintenance");
    return createSuccessResult({ id });
  } catch (error) {
    return createErrorResult(error);
  }
}

export async function updateMaintenanceTask(
  id: string,
  roomId: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const validated = parseFormData(formData, maintenanceSchema);

    await db
      .update(maintenance)
      .set({
        taskName: validated.taskName,
        description: validated.description || null,
        frequency: validated.frequency as MaintenanceFrequency,
        updatedAt: new Date(),
      })
      .where(eq(maintenance.id, id));

    revalidatePath(`/rooms/${roomId}`);
    revalidatePath("/maintenance");
    return createSuccessResult();
  } catch (error) {
    return createErrorResult(error);
  }
}

export async function completeMaintenanceTask(
  id: string,
  roomId: string,
): Promise<ActionResult> {
  try {
    await db
      .update(maintenance)
      .set({
        lastCompleted: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(maintenance.id, id));

    revalidatePath(`/rooms/${roomId}`);
    revalidatePath("/maintenance");
    return createSuccessResult();
  } catch (error) {
    return createErrorResult(error);
  }
}

export async function deleteMaintenanceTask(
  id: string,
  roomId: string,
): Promise<ActionResult> {
  try {
    await db.delete(maintenance).where(eq(maintenance.id, id));
    revalidatePath(`/rooms/${roomId}`);
    revalidatePath("/maintenance");
    return createSuccessResult();
  } catch (error) {
    return createErrorResult(error);
  }
}
