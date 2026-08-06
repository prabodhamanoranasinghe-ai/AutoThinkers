import { format, parseISO } from "date-fns";

export function formatDate(date: string): string {
  try {
    return format(parseISO(date), "MMMM d, yyyy");
  } catch {
    return date;
  }
}

export function formatShortDate(date: string): string {
  try {
    return format(parseISO(date), "MMM d, yyyy");
  } catch {
    return date;
  }
}
