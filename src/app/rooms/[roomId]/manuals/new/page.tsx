import { notFound } from "next/navigation";
import { getRoom } from "@/actions/rooms";
import { PageHeader } from "@/components/layout/page-header";
import { ManualForm } from "@/components/manuals/manual-form";

interface NewManualPageProps {
  params: Promise<{ roomId: string }>;
}

export default async function NewManualPage({ params }: NewManualPageProps) {
  const { roomId } = await params;
  const room = await getRoom(roomId);

  if (!room) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title="Add Manual"
        description={`Adding manual to ${room.name}`}
      />
      <ManualForm roomId={roomId} />
    </>
  );
}
