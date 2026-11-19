import { readFile, writeFile } from "node:fs/promises";
import { weekendListings } from "./weekend-listings.mjs";

const club = JSON.parse(await readFile(new URL("../src/_data/club.json", import.meta.url)));
if (club.calendarId) {
  process.env.TZ = club.calendarZone;
  const id = encodeURIComponent(club.calendarId);
  try {
    const response = await fetch("https://calendar.google.com/calendar/ical/" + id + "/public/basic.ics", {
      signal: AbortSignal.timeout(20000)
    });
    if (!response.ok) throw new Error("HTTP " + response.status);
    const weekends = weekendListings(await response.text());
    const data = { calendarId: club.calendarId, zone: club.calendarZone, weekends };
    await writeFile(new URL("../src/_data/calendarPreview.json", import.meta.url), JSON.stringify(data, null, 2) + "\n");
    console.log("Refreshed weekend listings for " + weekends.map(weekend => weekend.label).join(" and "));
  } catch (error) {
    console.warn("::warning::Could not refresh the weekend calendar: " + error.message);
  }
}
