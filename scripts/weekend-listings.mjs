import { sync, expandRecurringEvent } from "node-ical";

// The refresh process runs in the calendar's time zone. Calendar-day arithmetic
// preserves local midnight across both daylight-saving transitions.
function midnight(date, offset) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
}

export function weekendListings(ics, today = new Date()) {
  if (!ics.startsWith("BEGIN:VCALENDAR")) throw new Error("Expected a public iCalendar feed");
  const events = Object.values(sync.parseICS(ics)).filter(event =>
    event.type === "VEVENT" && event.start && event.status !== "CANCELLED");
  const day = today.getDay() || 7;
  const friday = midnight(today, 5 - day);
  const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  const dayFormat = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
  const timeFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

  return [0, 7].map(offset => {
    const from = midnight(friday, offset);
    const monday = midnight(from, 3);
    const options = { from, to: new Date(+monday - 1), expandOngoing: true };
    const occurrences = events.flatMap(event => expandRecurringEvent(event, options))
      .filter(item => item.event.status !== "CANCELLED" && item.start < monday &&
        (item.start >= from || item.end > from))
      .sort((a, b) => a.start - b.start);
    return {
      until: monday.toISOString(),
      label: dateFormat.formatRange(from, midnight(from, 2)),
      events: occurrences.map(item => {
        const continued = item.start < from;
        const date = continued ? from : item.start;
        const time = continued ? "Continuing" : item.isFullDay ? "All day" : timeFormat.format(date);
        let title = String(item.summary?.val ?? item.summary ?? "").trim() || "Club event";
        const dateTimePrefix = (date.getMonth() + 1) + "/" + date.getDate() + " " + time + " ";
        if (title.startsWith(dateTimePrefix)) title = title.slice(dateTimePrefix.length);
        return { title, day: dayFormat.format(date), time };
      })
    };
  });
}
