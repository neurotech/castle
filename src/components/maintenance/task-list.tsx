"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { deleteMaintenanceTask } from "@/actions/maintenance";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/dates";
import { getFrequencyLabel } from "@/lib/maintenance";
import type { MaintenanceFrequency, MaintenanceTaskWithDueDate } from "@/types";
import { CompleteTaskButton } from "./complete-task-button";
import { DueDateBadge } from "./due-date-badge";

interface TaskListProps {
  tasks: MaintenanceTaskWithDueDate[];
  roomId?: string;
  showRoomName?: boolean;
}

export function TaskList({ tasks, showRoomName }: TaskListProps) {
  const [isPending, startTransition] = useTransition();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No maintenance tasks yet. Add your first task to get started.
      </div>
    );
  }

  function handleDelete(id: string, taskRoomId: string) {
    if (confirm("Are you sure you want to delete this task?")) {
      startTransition(async () => {
        await deleteMaintenanceTask(id, taskRoomId);
      });
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          {showRoomName && <TableHead>Room</TableHead>}
          <TableHead>Frequency</TableHead>
          <TableHead>Due</TableHead>
          <TableHead>Last Completed</TableHead>
          <TableHead className="w-[120px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => {
          const taskWithRoom = task as MaintenanceTaskWithDueDate & {
            roomName?: string;
          };
          return (
            <TableRow
              key={task.id}
              className={task.isOverdue ? "bg-red-50" : ""}
            >
              <TableCell>
                <div className="font-medium">{task.taskName}</div>
                {task.description && (
                  <div className="text-sm text-muted-foreground line-clamp-1">
                    {task.description}
                  </div>
                )}
              </TableCell>
              {showRoomName && (
                <TableCell>
                  <Link
                    href={`/rooms/${task.roomId}`}
                    className="text-primary hover:underline"
                  >
                    {taskWithRoom.roomName}
                  </Link>
                </TableCell>
              )}
              <TableCell>
                <Badge variant="secondary">
                  {getFrequencyLabel(task.frequency as MaintenanceFrequency)}
                </Badge>
              </TableCell>
              <TableCell>
                <DueDateBadge
                  dueDate={task.dueDate}
                  isOverdue={task.isOverdue}
                />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {task.lastCompleted ? formatDate(task.lastCompleted) : "Never"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <CompleteTaskButton
                    taskId={task.id}
                    roomId={task.roomId}
                    isCompleted={task.frequency === "one-time" && !task.dueDate}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={isPending}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/rooms/${task.roomId}/maintenance/${task.id}/edit`}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(task.id, task.roomId)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
