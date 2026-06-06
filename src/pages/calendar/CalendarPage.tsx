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
};

function getOrganiserColour(organiserName: string): string {
  console.log(organiserName);
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

  useEffect(() => {
    if (!selectedTrack) return;

    const from = startOfMonth(currentMonth);
    const to = endOfMonth(currentMonth);

    const load = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-mono font-bold tracking-widest uppercase text-foreground">
            tracktime
          </h1>
          <TrackSelector
            selectedTrack={selectedTrack}
            onTrackChange={setSelectedTrack}
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              setCurrentMonth((m) => startOfMonth(addMonths(m, -1)))
            }
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-mono tracking-widest uppercase">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <button
            onClick={() =>
              setCurrentMonth((m) => startOfMonth(addMonths(m, 1)))
            }
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div
            key={d}
            className="text-xs text-muted-foreground font-mono tracking-widest text-center pb-2"
          >
            {d}
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
                          className={`text-xs px-1.5 py-0.5 rounded-r-sm truncate ${event.isSoldOut ? "opacity-40 line-through" : ""}`}
                          style={{
                            borderLeft: `3px solid ${colour}`,
                            background: `${colour}18`,
                          }}
                        >
                          {event.organiserName}
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
    </main>
  );
}
