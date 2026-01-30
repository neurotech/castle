import { notFound } from "next/navigation";
import { getRoom } from "@/actions/rooms";
import { PageHeader } from "@/components/layout/page-header";
import { RoomForm } from "@/components/rooms/room-form";

interface EditRoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default async function EditRoomPage({ params }: EditRoomPageProps) {
  const { roomId } = await params;
  const room = await getRoom(roomId);

  if (!room) {
    notFound();
  }

  return (
    <>
      <PageHeader title="Edit Room" description={`Editing ${room.name}`} />
      <RoomForm room={room} />
    </>
  );
}
