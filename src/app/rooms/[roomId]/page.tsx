import { Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppliancesByRoom } from "@/actions/appliances";
import { getMaintenanceByRoom } from "@/actions/maintenance";
import { getManualsByRoom } from "@/actions/manuals";
import { getRoom } from "@/actions/rooms";
import { ApplianceList } from "@/components/appliances/appliance-list";
import { PageHeader } from "@/components/layout/page-header";
import { TaskList } from "@/components/maintenance/task-list";
import { ManualList } from "@/components/manuals/manual-list";
import { DeleteRoomDialog } from "@/components/rooms/delete-room-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RoomDetailPageProps {
  params: Promise<{ roomId: string }>;
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const { roomId } = await params;
  const room = await getRoom(roomId);

  if (!room) {
    notFound();
  }

  const [manuals, appliances, maintenance] = await Promise.all([
    getManualsByRoom(roomId),
    getAppliancesByRoom(roomId),
    getMaintenanceByRoom(roomId),
  ]);

  return (
    <>
      <PageHeader
        title={room.name}
        description={room.description || undefined}
        action={
          <div className="flex gap-2">
            <Link href={`/rooms/${roomId}/edit`}>
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <DeleteRoomDialog roomId={roomId} roomName={room.name} />
          </div>
        }
      />

      <Tabs defaultValue="manuals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="manuals">Manuals ({manuals.length})</TabsTrigger>
          <TabsTrigger value="appliances">
            Appliances ({appliances.length})
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            Maintenance ({maintenance.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manuals" className="space-y-4">
          <div className="flex justify-end">
            <Link href={`/rooms/${roomId}/manuals/new`}>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Manual
              </Button>
            </Link>
          </div>
          <ManualList manuals={manuals} roomId={roomId} />
        </TabsContent>

        <TabsContent value="appliances" className="space-y-4">
          <div className="flex justify-end">
            <Link href={`/rooms/${roomId}/appliances/new`}>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Appliance
              </Button>
            </Link>
          </div>
          <ApplianceList appliances={appliances} roomId={roomId} />
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <div className="flex justify-end">
            <Link href={`/rooms/${roomId}/maintenance/new`}>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </Link>
          </div>
          <TaskList tasks={maintenance} roomId={roomId} />
        </TabsContent>
      </Tabs>
    </>
  );
}
