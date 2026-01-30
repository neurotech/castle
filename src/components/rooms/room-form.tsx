"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { createRoom, updateRoom } from "@/actions/rooms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Room } from "@/db/schema";
import type { ROOM_ICONS } from "@/lib/validations";

const iconOptions = [
  { value: "bedroom", label: "Bedroom" },
  { value: "bathroom", label: "Bathroom" },
  { value: "kitchen", label: "Kitchen" },
  { value: "living", label: "Living Room" },
  { value: "garage", label: "Garage" },
  { value: "storage", label: "Storage" },
  { value: "outdoor", label: "Outdoor" },
  { value: "office", label: "Office" },
  { value: "default", label: "Other" },
];

interface RoomFormProps {
  room?: Room;
}

export function RoomForm({ room }: RoomFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      icon: formData.get("icon") as (typeof ROOM_ICONS)[number],
    };

    startTransition(async () => {
      if (room) {
        const result = await updateRoom(room.id, data);
        if (result.success) {
          toast.success("Room updated successfully");
          router.push(`/rooms/${room.id}`);
        } else {
          toast.error(result.error);
        }
      } else {
        const result = await createRoom(data);
        if (result.success && result.data) {
          toast.success("Room created successfully");
          router.push(`/rooms/${result.data.id}`);
        } else if (!result.success) {
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
          defaultValue={room?.name}
          placeholder="e.g., Master Bedroom"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Room Type</Label>
        <Select name="icon" defaultValue={room?.icon || "default"}>
          <SelectTrigger>
            <SelectValue placeholder="Select a room type" />
          </SelectTrigger>
          <SelectContent>
            {iconOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={room?.description || ""}
          placeholder="Optional description of the room"
          rows={3}
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : room ? "Update Room" : "Create Room"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
