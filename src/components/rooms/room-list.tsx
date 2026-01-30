import type { RoomWithCounts } from "@/types";
import { RoomCard } from "./room-card";

interface RoomListProps {
  rooms: RoomWithCounts[];
}

export function RoomList({ rooms }: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No rooms yet. Create your first room to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}
