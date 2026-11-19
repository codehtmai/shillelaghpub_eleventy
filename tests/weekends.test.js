import assert from "node:assert/strict";
import test from "node:test";
import { weekendListings } from "../scripts/weekend-listings.mjs";

process.env.TZ = "America/New_York";
function event(uid, summary, dates) {
  return ["BEGIN:VEVENT", "UID:" + uid, "SUMMARY:" + summary, ...dates, "END:VEVENT"];
}
const feed = ["BEGIN:VCALENDAR", "VERSION:2.0",
  ...event("music", "Friday session", ["DTSTART;TZID=America/New_York:20260306T200000", "DTEND;TZID=America/New_York:20260306T220000", "RRULE:FREQ=WEEKLY;COUNT=4", "EXDATE;TZID=America/New_York:20260313T200000"]),
  ...event("drive", "Blood drive", ["DTSTART;VALUE=DATE:20260308", "DTEND;VALUE=DATE:20260309"]),
  ...event("midweek", "Thursday practice", ["DTSTART;TZID=America/New_York:20260305T200000", "DTEND;TZID=America/New_York:20260305T210000"]),
  ...event("cancel", "Cancelled", ["DTSTART;TZID=America/New_York:20260307T150000", "STATUS:CANCELLED"]),
  ...event("continuing", "Exhibit", ["DTSTART;VALUE=DATE:20260312", "DTEND;VALUE=DATE:20260315"]),
  "END:VCALENDAR"].join("\r\n");

test("retains the current weekend on Sunday and handles DST, exceptions and all-day events", () => {
  const [first, second] = weekendListings(feed, new Date("2026-03-08T16:00:00Z"));
  assert.equal(first.until, "2026-03-09T04:00:00.000Z");
  assert.deepEqual(first.events.map(e => [e.title, e.time]), [["Friday session", "8:00 PM"], ["Blood drive", "All day"]]);
  assert.deepEqual(second.events.map(e => [e.title, e.time]), [["Exhibit", "Continuing"]]);
});

test("advances to the next Friday on Monday and preserves local recurring event times", () => {
  const weekends = weekendListings(feed, new Date("2026-03-09T04:00:00Z"));
  assert.equal(weekends[0].until, "2026-03-16T04:00:00.000Z");
  assert.deepEqual(weekends[1].events, [{title: "Friday session", day: "Fri, Mar 20", time: "8:00 PM"}]);
});
