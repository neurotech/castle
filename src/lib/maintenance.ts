import { addMonths, addWeeks, addYears, isBefore } from "date-fns";
import type { MaintenanceTask } from "@/db/schema";
import type { MaintenanceFrequency, MaintenanceTaskWithDueDate } from "@/types";

export function calculateDueDate(
  frequency: MaintenanceFrequency,
  lastCompleted: Date | null,
  createdAt: Date,
): Date | null {
  if (frequency === "one-time") {
    return lastCompleted ? null : createdAt;
  }

  const baseDate = lastCompleted || createdAt;

  switch (frequency) {
    case "weekly":
      return addWeeks(baseDate, 1);
    case "monthly":
      return addMonths(baseDate, 1);
    case "yearly":
      return addYears(baseDate, 1);
    default:
      return null;
  }
}

export function isTaskOverdue(dueDate: Date | null): boolean {
  if (!dueDate) return false;
  return isBefore(dueDate, new Date());
}

export function enrichTaskWithDueDate(
  task: MaintenanceTask,
): MaintenanceTaskWithDueDate {
  const dueDate = calculateDueDate(
    task.frequency as MaintenanceFrequency,
    task.lastCompleted,
    task.createdAt,
  );

  return {
    ...task,
    dueDate,
    isOverdue: isTaskOverdue(dueDate),
  };
}

export function sortTasksByDueDate(
  tasks: MaintenanceTaskWithDueDate[],
): MaintenanceTaskWithDueDate[] {
  return [...tasks].sort((a, b) => {
    // Overdue tasks first
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;

    // Then by due date (nulls last)
    if (a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;

    return 0;
  });
}

export function getFrequencyLabel(frequency: MaintenanceFrequency): string {
  switch (frequency) {
    case "one-time":
      return "One-time";
    case "weekly":
      return "Weekly";
    case "monthly":
      return "Monthly";
    case "yearly":
      return "Yearly";
    default:
      return frequency;
  }
}
