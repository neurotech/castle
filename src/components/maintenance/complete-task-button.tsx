"use client";

import { Check } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { completeMaintenanceTask } from "@/actions/maintenance";
import { Button } from "@/components/ui/button";

interface CompleteTaskButtonProps {
  taskId: string;
  roomId: string;
  isCompleted?: boolean;
}

export function CompleteTaskButton({
  taskId,
  roomId,
  isCompleted,
}: CompleteTaskButtonProps) {
  const [isPending, startTransition] = useTransition();

  if (isCompleted) {
    return null;
  }

  function handleComplete() {
    startTransition(async () => {
      const result = await completeMaintenanceTask(taskId, roomId);
      if (result.success) {
        toast.success("Task marked as complete");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleComplete}
      disabled={isPending}
    >
      <Check className="h-4 w-4 mr-1" />
      {isPending ? "..." : "Done"}
    </Button>
  );
}
