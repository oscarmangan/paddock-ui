import type { Event } from "@/types";
import { API_BASE_URL } from "./client";

export async function fetchEventsForTrack(
  trackId: string,
  from: Date,
  to: Date,
): Promise<Event[]> {
  const params = new URLSearchParams({
    from: from.toISOString(),
    to: to.toISOString(),
  });

  const res = await fetch(
    `${API_BASE_URL}/events/track/${trackId}/range?${params}`,
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res.status}`);
  }
  return res.json();
}
