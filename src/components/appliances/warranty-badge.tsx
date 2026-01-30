import { Badge } from "@/components/ui/badge";
import { formatDate, isExpired, isExpiringSoon } from "@/lib/dates";

interface WarrantyBadgeProps {
  warrantyExpiration: Date | null;
}

export function WarrantyBadge({ warrantyExpiration }: WarrantyBadgeProps) {
  if (!warrantyExpiration) {
    return null;
  }

  if (isExpired(warrantyExpiration)) {
    return (
      <Badge variant="destructive">
        Warranty expired {formatDate(warrantyExpiration)}
      </Badge>
    );
  }

  if (isExpiringSoon(warrantyExpiration, 30)) {
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        Warranty expires {formatDate(warrantyExpiration)}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="bg-green-100 text-green-800">
      Warranty until {formatDate(warrantyExpiration)}
    </Badge>
  );
}
