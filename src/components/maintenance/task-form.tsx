"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  createMaintenanceTask,
  updateMaintenanceTask,
} from "@/actions/maintenance";
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
import type { MaintenanceTask } from "@/db/schema";

const frequencyOptions = [
  { value: "one-time", label: "One-time" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

interface TaskFormProps {
  roomId: string;
  task?: MaintenanceTask;
}

export function TaskForm({ roomId, task }: TaskFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      if (task) {
        const result = await updateMaintenanceTask(task.id, roomId, formData);
        if (result.success) {
          toast.success("Task updated successfully");
          router.push(`/rooms/${roomId}`);
        } else {
          toast.error(result.error);
        }
      } else {
        const result = await createMaintenanceTask(roomId, formData);
        if (result.success) {
          toast.success("Task added successfully");
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
        <Label htmlFor="taskName">Task Name *</Label>
        <Input
          id="taskName"
          name="taskName"
          defaultValue={task?.taskName}
          placeholder="e.g., Replace HVAC filter"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="frequency">Frequency *</Label>
        <Select name="frequency" defaultValue={task?.frequency || "monthly"}>
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            {frequencyOptions.map((option) => (
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
          defaultValue={task?.description || ""}
          placeholder="Additional details about this maintenance task"
          rows={3}
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : task ? "Update Task" : "Add Task"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
