import { z } from "zod";

export const ROOM_ICONS = [
  "default",
  "bedroom",
  "bathroom",
  "kitchen",
  "living",
  "garage",
  "storage",
  "outdoor",
  "office",
] as const;

export const MAINTENANCE_FREQUENCIES = [
  "one-time",
  "weekly",
  "monthly",
  "yearly",
] as const;

export const roomSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  icon: z.enum(ROOM_ICONS).optional().default("default"),
});

export const applianceSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  brand: z.string().max(100, "Brand is too long").optional(),
  modelNumber: z.string().max(100, "Model number is too long").optional(),
  serialNumber: z.string().max(100, "Serial number is too long").optional(),
  purchaseDate: z.string().optional(),
  warrantyExpiration: z.string().optional(),
  notes: z.string().max(1000, "Notes are too long").optional(),
});

export const maintenanceSchema = z.object({
  taskName: z
    .string()
    .min(1, "Task name is required")
    .max(100, "Task name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  frequency: z.enum(MAINTENANCE_FREQUENCIES).default("monthly"),
});

export const manualSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().max(500, "Description is too long").optional(),
});

export function parseFormData<T extends z.ZodTypeAny>(
  formData: FormData,
  schema: T,
): z.infer<T> {
  const data: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) continue;
    const stringValue = value.toString();
    // Only add non-empty strings
    if (stringValue !== "") {
      data[key] = stringValue;
    }
  }

  return schema.parse(data);
}

export type RoomInput = z.infer<typeof roomSchema>;
export type ApplianceInput = z.infer<typeof applianceSchema>;
export type MaintenanceInput = z.infer<typeof maintenanceSchema>;
export type ManualInput = z.infer<typeof manualSchema>;
