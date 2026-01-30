import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const rooms = sqliteTable("rooms", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const manuals = sqliteTable("manuals", {
  id: text("id").primaryKey(),
  roomId: text("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  filename: text("filename").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const appliances = sqliteTable("appliances", {
  id: text("id").primaryKey(),
  roomId: text("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  brand: text("brand"),
  modelNumber: text("model_number"),
  serialNumber: text("serial_number"),
  purchaseDate: integer("purchase_date", { mode: "timestamp" }),
  warrantyExpiration: integer("warranty_expiration", { mode: "timestamp" }),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const maintenance = sqliteTable("maintenance", {
  id: text("id").primaryKey(),
  roomId: text("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "cascade" }),
  taskName: text("task_name").notNull(),
  description: text("description"),
  frequency: text("frequency", {
    enum: ["one-time", "weekly", "monthly", "yearly"],
  }).notNull(),
  lastCompleted: integer("last_completed", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Relations
export const roomsRelations = relations(rooms, ({ many }) => ({
  manuals: many(manuals),
  appliances: many(appliances),
  maintenance: many(maintenance),
}));

export const manualsRelations = relations(manuals, ({ one }) => ({
  room: one(rooms, {
    fields: [manuals.roomId],
    references: [rooms.id],
  }),
}));

export const appliancesRelations = relations(appliances, ({ one }) => ({
  room: one(rooms, {
    fields: [appliances.roomId],
    references: [rooms.id],
  }),
}));

export const maintenanceRelations = relations(maintenance, ({ one }) => ({
  room: one(rooms, {
    fields: [maintenance.roomId],
    references: [rooms.id],
  }),
}));

// Types
export type Room = typeof rooms.$inferSelect;
export type NewRoom = typeof rooms.$inferInsert;
export type Manual = typeof manuals.$inferSelect;
export type NewManual = typeof manuals.$inferInsert;
export type Appliance = typeof appliances.$inferSelect;
export type NewAppliance = typeof appliances.$inferInsert;
export type MaintenanceTask = typeof maintenance.$inferSelect;
export type NewMaintenanceTask = typeof maintenance.$inferInsert;
