import type { MaintenanceTask } from "@/db/schema";

export type MaintenanceFrequency = "one-time" | "weekly" | "monthly" | "yearly";

export interface MaintenanceTaskWithDueDate extends MaintenanceTask {
  dueDate: Date | null;
  isOverdue: boolean;
}

export interface RoomWithCounts {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date;
  manualsCount: number;
  appliancesCount: number;
  maintenanceCount: number;
}
