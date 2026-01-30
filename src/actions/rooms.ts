"use server";

import { eq, like, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db";
import { rooms } from "@/db/schema";
import {
  type ActionResult,
  createErrorResult,
  createSuccessResult,
} from "@/lib/action-result";
import { type RoomInput, roomSchema } from "@/lib/validations";
import type { RoomWithCounts } from "@/types";

export async function getRooms(): Promise<RoomWithCounts[]> {
  const result = await db
    .select({
      id: rooms.id,
      name: rooms.name,
      description: rooms.description,
      icon: rooms.icon,
      createdAt: rooms.createdAt,
      updatedAt: rooms.updatedAt,
      manualsCount: sql<number>`(SELECT COUNT(*) FROM manuals WHERE manuals.room_id = rooms.id)`,
      appliancesCount: sql<number>`(SELECT COUNT(*) FROM appliances WHERE appliances.room_id = rooms.id)`,
      maintenanceCount: sql<number>`(SELECT COUNT(*) FROM maintenance WHERE maintenance.room_id = rooms.id)`,
    })
    .from(rooms)
    .orderBy(rooms.name);

  return result;
}

export async function searchRooms(query: string): Promise<RoomWithCounts[]> {
  const result = await db
    .select({
      id: rooms.id,
      name: rooms.name,
      description: rooms.description,
      icon: rooms.icon,
      createdAt: rooms.createdAt,
      updatedAt: rooms.updatedAt,
      manualsCount: sql<number>`(SELECT COUNT(*) FROM manuals WHERE manuals.room_id = rooms.id)`,
      appliancesCount: sql<number>`(SELECT COUNT(*) FROM appliances WHERE appliances.room_id = rooms.id)`,
      maintenanceCount: sql<number>`(SELECT COUNT(*) FROM maintenance WHERE maintenance.room_id = rooms.id)`,
    })
    .from(rooms)
    .where(like(rooms.name, `%${query}%`))
    .orderBy(rooms.name);

  return result;
}

export async function getRoom(id: string) {
  const result = await db.query.rooms.findFirst({
    where: eq(rooms.id, id),
    with: {
      manuals: true,
      appliances: true,
      maintenance: true,
    },
  });

  return result;
}

export async function createRoom(
  data: RoomInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    const validated = roomSchema.parse(data);
    const id = uuidv4();
    const now = new Date();

    await db.insert(rooms).values({
      id,
      name: validated.name,
      description: validated.description || null,
      icon: validated.icon || null,
      createdAt: now,
      updatedAt: now,
    });

    revalidatePath("/");
    return createSuccessResult({ id });
  } catch (error) {
    return createErrorResult(error);
  }
}

export async function updateRoom(
  id: string,
  data: RoomInput,
): Promise<ActionResult> {
  try {
    const validated = roomSchema.parse(data);

    await db
      .update(rooms)
      .set({
        name: validated.name,
        description: validated.description || null,
        icon: validated.icon || null,
        updatedAt: new Date(),
      })
      .where(eq(rooms.id, id));

    revalidatePath("/");
    revalidatePath(`/rooms/${id}`);
    return createSuccessResult();
  } catch (error) {
    return createErrorResult(error);
  }
}

export async function deleteRoom(id: string): Promise<ActionResult> {
  try {
    await db.delete(rooms).where(eq(rooms.id, id));
    revalidatePath("/");
    return createSuccessResult();
  } catch (error) {
    return createErrorResult(error);
  }
}
