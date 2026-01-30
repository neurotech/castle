"use server";

import { db } from "@/db";
import { appliances, maintenance, manuals, rooms } from "@/db/schema";

export interface ExportData {
  exportedAt: string;
  version: string;
  rooms: Array<{
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    createdAt: Date;
    updatedAt: Date;
    manuals: Array<{
      id: string;
      title: string;
      description: string | null;
      filename: string;
      fileSize: number;
      createdAt: Date;
      updatedAt: Date;
    }>;
    appliances: Array<{
      id: string;
      name: string;
      brand: string | null;
      modelNumber: string | null;
      serialNumber: string | null;
      purchaseDate: Date | null;
      warrantyExpiration: Date | null;
      notes: string | null;
      createdAt: Date;
      updatedAt: Date;
    }>;
    maintenance: Array<{
      id: string;
      taskName: string;
      description: string | null;
      frequency: string;
      lastCompleted: Date | null;
      createdAt: Date;
      updatedAt: Date;
    }>;
  }>;
}

export async function exportAllData(): Promise<ExportData> {
  const allRooms = await db.select().from(rooms);
  const allManuals = await db.select().from(manuals);
  const allAppliances = await db.select().from(appliances);
  const allMaintenance = await db.select().from(maintenance);

  const roomsWithRelations = allRooms.map((room) => ({
    id: room.id,
    name: room.name,
    description: room.description,
    icon: room.icon,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    manuals: allManuals
      .filter((m) => m.roomId === room.id)
      .map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        filename: m.filename,
        fileSize: m.fileSize,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      })),
    appliances: allAppliances
      .filter((a) => a.roomId === room.id)
      .map((a) => ({
        id: a.id,
        name: a.name,
        brand: a.brand,
        modelNumber: a.modelNumber,
        serialNumber: a.serialNumber,
        purchaseDate: a.purchaseDate,
        warrantyExpiration: a.warrantyExpiration,
        notes: a.notes,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
    maintenance: allMaintenance
      .filter((t) => t.roomId === room.id)
      .map((t) => ({
        id: t.id,
        taskName: t.taskName,
        description: t.description,
        frequency: t.frequency,
        lastCompleted: t.lastCompleted,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      })),
  }));

  return {
    exportedAt: new Date().toISOString(),
    version: "1.0",
    rooms: roomsWithRelations,
  };
}
