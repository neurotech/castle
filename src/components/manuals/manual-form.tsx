"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { createManual, updateManual } from "@/actions/manuals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Manual } from "@/db/schema";

interface ManualFormProps {
  roomId: string;
  manual?: Manual;
}

export function ManualForm({ roomId, manual }: ManualFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      if (manual) {
        const result = await updateManual(manual.id, roomId, formData);
        if (result.success) {
          toast.success("Manual updated successfully");
          router.push(`/rooms/${roomId}`);
        } else {
          toast.error(result.error);
        }
      } else {
        const result = await createManual(roomId, formData);
        if (result.success) {
          toast.success("Manual added successfully");
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
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          name="title"
          defaultValue={manual?.title}
          placeholder="e.g., Refrigerator User Manual"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={manual?.description || ""}
          placeholder="Optional description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">
          PDF File {manual ? "(leave empty to keep current)" : "*"}
        </Label>
        <Input
          id="file"
          name="file"
          type="file"
          accept=".pdf"
          required={!manual}
        />
        {manual && (
          <p className="text-sm text-muted-foreground">
            Current file: {manual.filename}
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : manual ? "Update Manual" : "Add Manual"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
