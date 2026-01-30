import { notFound } from "next/navigation";
import { getMaintenanceTask } from "@/actions/maintenance";
import { getRoom } from "@/actions/rooms";
import { PageHeader } from "@/components/layout/page-header";
import { TaskForm } from "@/components/maintenance/task-form";

interface EditMaintenancePageProps {
  params: Promise<{ roomId: string; taskId: string }>;
}

export default async function EditMaintenancePage({
  params,
}: EditMaintenancePageProps) {
  const { roomId, taskId } = await params;
  const [room, task] = await Promise.all([
    getRoom(roomId),
    getMaintenanceTask(taskId),
  ]);

  if (!room || !task) {
    notFound();
  }

  return (
    <>
      <PageHeader title="Edit Task" description={`Editing ${task.taskName}`} />
      <TaskForm roomId={roomId} task={task} />
    </>
  );
}
