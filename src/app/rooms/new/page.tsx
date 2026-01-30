import { PageHeader } from "@/components/layout/page-header";
import { RoomForm } from "@/components/rooms/room-form";

export default function NewRoomPage() {
  return (
    <>
      <PageHeader
        title="Add Room"
        description="Create a new room in your home"
      />
      <RoomForm />
    </>
  );
}
