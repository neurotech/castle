import { Plus } from "lucide-react";
import Link from "next/link";
import { getRooms, searchRooms } from "@/actions/rooms";
import { PageHeader } from "@/components/layout/page-header";
import { RoomList } from "@/components/rooms/room-list";
import { RoomSearch } from "@/components/rooms/room-search";
import { Button } from "@/components/ui/button";

interface HomePageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q } = await searchParams;
  const rooms = q ? await searchRooms(q) : await getRooms();

  return (
    <>
      <PageHeader
        title="Rooms"
        description="Manage your home room by room"
        action={
          <Link href="/rooms/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </Link>
        }
      />
      <div className="mb-6">
        <RoomSearch />
      </div>
      <RoomList rooms={rooms} />
    </>
  );
}
