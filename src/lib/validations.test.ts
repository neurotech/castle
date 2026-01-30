import { describe, expect, it } from "vitest";
import {
  applianceSchema,
  maintenanceSchema,
  manualSchema,
  parseFormData,
  roomSchema,
} from "./validations";

describe("roomSchema", () => {
  it("validates a valid room", () => {
    const result = roomSchema.safeParse({
      name: "Living Room",
      description: "Main living area",
      icon: "living",
    });
    expect(result.success).toBe(true);
  });

  it("requires name field", () => {
    const result = roomSchema.safeParse({
      description: "Some description",
    });
    expect(result.success).toBe(false);
  });

  it("requires name to be non-empty", () => {
    const result = roomSchema.safeParse({
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid icon values", () => {
    const result = roomSchema.safeParse({
      name: "Test Room",
      icon: "invalid-icon",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid icon values", () => {
    const validIcons = [
      "default",
      "bedroom",
      "bathroom",
      "kitchen",
      "living",
      "garage",
      "storage",
      "outdoor",
      "office",
    ];
    for (const icon of validIcons) {
      const result = roomSchema.safeParse({ name: "Test", icon });
      expect(result.success).toBe(true);
    }
  });

  it("enforces name max length", () => {
    const result = roomSchema.safeParse({
      name: "a".repeat(101),
    });
    expect(result.success).toBe(false);
  });
});

describe("applianceSchema", () => {
  it("validates a valid appliance", () => {
    const result = applianceSchema.safeParse({
      name: "Refrigerator",
      brand: "Samsung",
      modelNumber: "RF28R7351SR",
    });
    expect(result.success).toBe(true);
  });

  it("requires name field", () => {
    const result = applianceSchema.safeParse({
      brand: "Samsung",
    });
    expect(result.success).toBe(false);
  });

  it("allows optional fields to be omitted", () => {
    const result = applianceSchema.safeParse({
      name: "Toaster",
    });
    expect(result.success).toBe(true);
  });
});

describe("maintenanceSchema", () => {
  it("validates a valid maintenance task", () => {
    const result = maintenanceSchema.safeParse({
      taskName: "Replace HVAC filter",
      frequency: "monthly",
    });
    expect(result.success).toBe(true);
  });

  it("requires taskName field", () => {
    const result = maintenanceSchema.safeParse({
      frequency: "monthly",
    });
    expect(result.success).toBe(false);
  });

  it("validates frequency enum values", () => {
    const validFrequencies = ["one-time", "weekly", "monthly", "yearly"];
    for (const frequency of validFrequencies) {
      const result = maintenanceSchema.safeParse({
        taskName: "Test Task",
        frequency,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid frequency values", () => {
    const result = maintenanceSchema.safeParse({
      taskName: "Test Task",
      frequency: "daily",
    });
    expect(result.success).toBe(false);
  });
});

describe("manualSchema", () => {
  it("validates a valid manual", () => {
    const result = manualSchema.safeParse({
      title: "User Guide",
      description: "Instructions for the device",
    });
    expect(result.success).toBe(true);
  });

  it("requires title field", () => {
    const result = manualSchema.safeParse({
      description: "Some description",
    });
    expect(result.success).toBe(false);
  });

  it("requires title to be non-empty", () => {
    const result = manualSchema.safeParse({
      title: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("parseFormData", () => {
  it("parses FormData into validated object", () => {
    const formData = new FormData();
    formData.set("name", "Kitchen");
    formData.set("description", "Main cooking area");
    formData.set("icon", "kitchen");

    const result = parseFormData(formData, roomSchema);
    expect(result.name).toBe("Kitchen");
    expect(result.description).toBe("Main cooking area");
    expect(result.icon).toBe("kitchen");
  });

  it("ignores empty string values", () => {
    const formData = new FormData();
    formData.set("name", "Kitchen");
    formData.set("description", "");

    const result = parseFormData(formData, roomSchema);
    expect(result.name).toBe("Kitchen");
    expect(result.description).toBeUndefined();
  });

  it("ignores File entries", () => {
    const formData = new FormData();
    formData.set("name", "Test");
    formData.set("file", new File(["content"], "test.pdf"));

    const result = parseFormData(formData, roomSchema);
    expect(result.name).toBe("Test");
    expect(result).not.toHaveProperty("file");
  });
});
