import {
  Bath,
  Bed,
  Briefcase,
  Car,
  Home,
  type LucideIcon,
  Sofa,
  TreePine,
  UtensilsCrossed,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RoomWithCounts } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  bedroom: Bed,
  bathroom: Bath,
  kitchen: UtensilsCrossed,
  living: Sofa,
  garage: Car,
  storage: Warehouse,
  outdoor: TreePine,
  office: Briefcase,
  default: Home,
};

interface RoomCardProps {
  room: RoomWithCounts;
}

export function RoomCard({ room }: RoomCardProps) {
  const IconComponent = iconMap[room.icon || "default"] || iconMap.default;

  return (
    <Link href={`/rooms/${room.id}`}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <IconComponent className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">{room.name}</CardTitle>
            </div>
          </div>
          {room.description && (
            <CardDescription className="mt-2 line-clamp-2">
              {room.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">
              {room.manualsCount} manual{room.manualsCount !== 1 ? "s" : ""}
            </Badge>
            <Badge variant="secondary">
              {room.appliancesCount} appliance
              {room.appliancesCount !== 1 ? "s" : ""}
            </Badge>
            <Badge variant="secondary">
              {room.maintenanceCount} task
              {room.maintenanceCount !== 1 ? "s" : ""}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
