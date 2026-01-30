import { notFound } from "next/navigation";
import { getAppliance } from "@/actions/appliances";
import { getRoom } from "@/actions/rooms";
import { ApplianceForm } from "@/components/appliances/appliance-form";
import { PageHeader } from "@/components/layout/page-header";

interface EditAppliancePageProps {
  params: Promise<{ roomId: string; applianceId: string }>;
}

export default async function EditAppliancePage({
  params,
}: EditAppliancePageProps) {
  const { roomId, applianceId } = await params;
  const [room, appliance] = await Promise.all([
    getRoom(roomId),
    getAppliance(applianceId),
  ]);

  if (!room || !appliance) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title="Edit Appliance"
        description={`Editing ${appliance.name}`}
      />
      <ApplianceForm roomId={roomId} appliance={appliance} />
    </>
  );
}
