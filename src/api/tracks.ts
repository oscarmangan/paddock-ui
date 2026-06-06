import type { Track } from "@/types";
import { API_BASE_URL } from "./client";

export async function fetchTracks(): Promise<Track[]> {
  const res = await fetch(`${API_BASE_URL}/tracks`);
  if (!res.ok) {
    throw new Error(`Failed to fetch tracks: ${res.status}`);
  }
  return res.json();
}
