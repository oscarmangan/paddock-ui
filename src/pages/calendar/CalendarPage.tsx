import { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  addMonths,
  isSameDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Track, Event } from "@/types";
import TrackSelector from "@/components/track-selector/TrackSelector";
import { fetchEventsForTrack } from "@/api/events";

const ORGANISER_COLOURS: Record<string, string> = {
  "MSV Track Days": "#F59E0B",
  "Javelin Trackdays": "#3B82F6",
  "Trackdays.co.uk": "#10B981",
  OpenTrack: "#EF4444",
};

const KNOWN_ORGANISERS = Object.entries(ORGANISER_COLOURS);

function getOrganiserColour(organiserName: string): string {
  return ORGANISER_COLOURS[organiserName] ?? "#6B7280";
}

function getEventsForDay(events: Event[], day: Date): Event[] {
  return events.filter((e) => isSameDay(new Date(e.startDatetime), day));
}

function buildCalendarGrid(month: Date): Date[][] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
}

export default function CalendarPage() {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() =>
    startOfMonth(new Date()),
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trackSvg, setTrackSvg] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedTrack) return;

    const trackId = selectedTrack.id;
    console.log(selectedTrack.id);
    console.log(`@/assets/tracks/${trackId}.svg`);
    import(`../../assets/tracks/${trackId}.svg`)
      .then((mod) => setTrackSvg(mod.default))
      .catch(() => setTrackSvg(null));

    return () => setTrackSvg(null);
  }, [selectedTrack]);

  useEffect(() => {
    if (!selectedTrack) return;

    const from = startOfMonth(currentMonth);
    const to = endOfMonth(currentMonth);

    const load = async () => {
      setIsLoading(true);
      try {
        const data = await fetchEventsForTrack(selectedTrack.id, from, to);
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [selectedTrack, currentMonth]);

  const weeks = buildCalendarGrid(currentMonth);

  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-lg font-mono font-bold tracking-widest uppercase mb-4">
        tracktime
      </h1>
      <div className="flex items-center justify-between mb-6">
        <TrackSelector onTrackChange={setSelectedTrack} />
        <div className="flex items-center gap-6">
          {KNOWN_ORGANISERS.map(([name, colour]) => (
            <div key={name} className="flex items-center gap-2">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: colour }}
              />
              <span className="text-xs font-mono text-muted-foreground">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {selectedTrack ? (
            <>
              <h2 className="text-2xl font-mono font-bold tracking-right">
                {selectedTrack.name}
              </h2>
              {trackSvg && (
                <img
                  src={trackSvg}
                  alt={`${selectedTrack.name} track map`}
                  className="h-10 w-auto opacity-85 bg-white"
                />
              )}
            </>
          ) : (
            <h2 className="text-2xl font-mono font-bold tracking-tight text-muted-foreground">
              [ Track ]
            </h2>
          )}
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm font-mono tracking-widest uppercase w-52 text-center">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <button
            onClick={() =>
              setCurrentMonth((m) => startOfMonth(addMonths(m, -1)))
            }
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={() =>
              setCurrentMonth((m) => startOfMonth(addMonths(m, 1)))
            }
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        {/* Day labels */}
        <div className="grid grid-cols-7 mb-2 mt-4">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div
              key={day}
              className="text-xs text-muted-foreground font-mono tracking-widest text-center pb-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-px bg-border">
          {weeks.flat().map((day) => {
            const dayEvents = getEventsForDay(events, day);
            const visibleEvents = dayEvents.slice(0, 2);
            const hasMore = dayEvents.length > 2;
            return (
              <div
                key={day.toISOString()}
                className={`min-h-28 p-2 ${
                  isLoading ? "bg-muted animate-pulse" : "bg-background"
                } ${!isSameMonth(day, currentMonth) ? "opacity-30" : ""}`}
              >
                {!isLoading && (
                  <>
                    <span className="text-xs font-mono text-muted-foreground">
                      {format(day, "d")}
                    </span>
                    <div className="mt-1 flex flex-col gap-1">
                      {visibleEvents.map((event) => {
                        const colour = getOrganiserColour(event.organiserName);
                        return (
                          <div
                            key={event.id}
                            className={`text-xs px-1.5 py-0.5 rounded-sm truncate ${event.isSoldOut ? "opacity-40 line-through" : ""}`}
                            style={{
                              border: `1px solid ${colour}`,
                              borderLeft: `5px solid ${colour}`,
                              background: `${colour}18`,
                            }}
                          >
                            {event.eventName}
                          </div>
                        );
                      })}
                      {hasMore && (
                        <div className="text-xs text-muted-foreground font-mono px-1.5">
                          ...
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
