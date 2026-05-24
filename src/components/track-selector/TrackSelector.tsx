import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import tracks from "@/data/tracks.json";

export default function TrackSelector() {
  return (
    <Select>
      <SelectTrigger className="w-60">
        <SelectValue placeholder="Select a circuit..." />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {tracks.map((track) => (
          <SelectItem key={track.id} value={track.name}>
            {track.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
