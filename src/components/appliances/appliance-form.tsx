"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { createAppliance, updateAppliance } from "@/actions/appliances";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Appliance } from "@/db/schema";

interface ApplianceFormProps {
  roomId: string;
  appliance?: Appliance;
}

function formatDateForInput(date: Date | null): string {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
}

export function ApplianceForm({ roomId, appliance }: ApplianceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      if (appliance) {
        const result = await updateAppliance(appliance.id, roomId, formData);
        if (result.success) {
          toast.success("Appliance updated successfully");
          router.push(`/rooms/${roomId}`);
        } else {
          toast.error(result.error);
        }
      } else {
        const result = await createAppliance(roomId, formData);
        if (result.success) {
          toast.success("Appliance added successfully");
          router.push(`/rooms/${roomId}`);
        } else {
          toast.error(result.error);
        }
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          name="name"
          defaultValue={appliance?.name}
          placeholder="e.g., Refrigerator"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            name="brand"
            defaultValue={appliance?.brand || ""}
            placeholder="e.g., Samsung"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="modelNumber">Model Number</Label>
          <Input
            id="modelNumber"
            name="modelNumber"
            defaultValue={appliance?.modelNumber || ""}
            placeholder="e.g., RF28R7351SR"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="serialNumber">Serial Number</Label>
        <Input
          id="serialNumber"
          name="serialNumber"
          defaultValue={appliance?.serialNumber || ""}
          placeholder="e.g., ABC123456789"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <Input
            id="purchaseDate"
            name="purchaseDate"
            type="date"
            defaultValue={formatDateForInput(appliance?.purchaseDate || null)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="warrantyExpiration">Warranty Expiration</Label>
          <Input
            id="warrantyExpiration"
            name="warrantyExpiration"
            type="date"
            defaultValue={formatDateForInput(
              appliance?.warrantyExpiration || null,
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={appliance?.notes || ""}
          placeholder="Additional notes about the appliance"
          rows={3}
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Saving..."
            : appliance
              ? "Update Appliance"
              : "Add Appliance"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
