import { notFound } from "next/navigation";
import { getRoom } from "@/actions/rooms";
import { ApplianceForm } from "@/components/appliances/appliance-form";
import { PageHeader } from "@/components/layout/page-header";

interface NewAppliancePageProps {
  params: Promise<{ roomId: string }>;
}

export default async function NewAppliancePage({
  params,
}: NewAppliancePageProps) {
  const { roomId } = await params;
  const room = await getRoom(roomId);

  if (!room) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title="Add Appliance"
        description={`Adding appliance to ${room.name}`}
      />
      <ApplianceForm roomId={roomId} />
    </>
  );
}
