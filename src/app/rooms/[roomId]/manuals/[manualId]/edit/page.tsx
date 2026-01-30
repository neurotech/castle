import { notFound } from "next/navigation";
import { getManual } from "@/actions/manuals";
import { getRoom } from "@/actions/rooms";
import { PageHeader } from "@/components/layout/page-header";
import { ManualForm } from "@/components/manuals/manual-form";

interface EditManualPageProps {
  params: Promise<{ roomId: string; manualId: string }>;
}

export default async function EditManualPage({ params }: EditManualPageProps) {
  const { roomId, manualId } = await params;
  const [room, manual] = await Promise.all([
    getRoom(roomId),
    getManual(manualId),
  ]);

  if (!room || !manual) {
    notFound();
  }

  return (
    <>
      <PageHeader title="Edit Manual" description={`Editing ${manual.title}`} />
      <ManualForm roomId={roomId} manual={manual} />
    </>
  );
}
