import {
  format,
  formatDistanceToNow,
  isAfter,
  isBefore,
  parseISO,
} from "date-fns";

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy");
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy h:mm a");
}

export function formatRelative(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function isExpired(date: Date | string | null | undefined): boolean {
  if (!date) return false;
  const d = typeof date === "string" ? parseISO(date) : date;
  return isBefore(d, new Date());
}

export function isExpiringSoon(
  date: Date | string | null | undefined,
  days: number = 30,
): boolean {
  if (!date) return false;
  const d = typeof date === "string" ? parseISO(date) : date;
  const now = new Date();
  const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return isAfter(d, now) && isBefore(d, threshold);
}
