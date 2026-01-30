import { notFound } from "next/navigation";
import { getRoom } from "@/actions/rooms";
import { PageHeader } from "@/components/layout/page-header";
import { TaskForm } from "@/components/maintenance/task-form";

interface NewMaintenancePageProps {
  params: Promise<{ roomId: string }>;
}

export default async function NewMaintenancePage({
  params,
}: NewMaintenancePageProps) {
  const { roomId } = await params;
  const room = await getRoom(roomId);

  if (!room) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title="Add Maintenance Task"
        description={`Adding task to ${room.name}`}
      />
      <TaskForm roomId={roomId} />
    </>
  );
}
