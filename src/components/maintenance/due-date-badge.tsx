import { Badge } from "@/components/ui/badge";
import { formatRelative } from "@/lib/dates";

interface DueDateBadgeProps {
  dueDate: Date | null;
  isOverdue: boolean;
}

export function DueDateBadge({ dueDate, isOverdue }: DueDateBadgeProps) {
  if (!dueDate) {
    return <Badge variant="secondary">Completed</Badge>;
  }

  if (isOverdue) {
    return (
      <Badge variant="destructive">Overdue - {formatRelative(dueDate)}</Badge>
    );
  }

  return <Badge variant="outline">Due {formatRelative(dueDate)}</Badge>;
}
