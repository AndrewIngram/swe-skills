const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < MINUTE) return "just now";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} minutes ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)} hours ago`;
  if (diff < 30 * DAY) return `${Math.floor(diff / DAY)} days ago`;
  return `${Math.floor(diff / (30 * DAY))} months ago`;
}
