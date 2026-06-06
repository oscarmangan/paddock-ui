import { useEffect, useState } from "react";
import type { Track } from "@/types";
import { fetchTracks } from "@/api/tracks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TrackSelectorProps {
  selectedTrack: Track | null;
  onTrackChange: (track: Track) => void;
}

export default function TrackSelector({
  selectedTrack,
  onTrackChange,
}: TrackSelectorProps) {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    fetchTracks().then(setTracks).catch(console.error);
  }, []);

  function handleChange(trackId: string | null) {
    if (!trackId) return;
    const track = tracks.find((t) => t.id === trackId);
    if (track) onTrackChange(track);
  }

  return (
    <Select
      value={selectedTrack?.id ?? ""}
      onValueChange={handleChange}
      items={tracks.map((track) => ({ label: track.name, value: track.id }))}
    >
      <SelectTrigger className="w-60">
        <SelectValue placeholder="Select a circuit..." />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {tracks.map((track) => (
          <SelectItem key={track.id} value={track.id}>
            {track.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
