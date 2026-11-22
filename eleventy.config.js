export default function (config) {
  config.setNunjucksEnvironmentOptions({ autoescape: true });
  config.addPassthroughCopy("src/assets");
  config.addPassthroughCopy("src/admin");
  config.addPassthroughCopy({ "src/_data/facebookFeed.json": "assets/facebook-feed.json" });
  const clubDate = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "America/New_York" });
  config.addFilter("clubDate", value => clubDate.format(new Date(value)));
  for (const [family, styles] of [["cormorant-garamond", ["normal", "italic"]], ["dm-sans", ["normal"]]]) {
    config.addPassthroughCopy({ ["node_modules/@fontsource-variable/" + family + "/LICENSE"]: "assets/" + family + "-LICENSE.txt" });
    for (const style of styles) {
      const file = family + "-latin-wght-" + style + ".woff2";
      config.addPassthroughCopy({ ["node_modules/@fontsource-variable/" + family + "/files/" + file]: "assets/" + file });
    }
  }
  config.addFilter("currentWeekends", (preview, club) => {
    if (!club.calendarId || preview?.calendarId !== club.calendarId || preview.zone !== club.calendarZone) return [];
    return preview.weekends.filter(weekend => Date.parse(weekend.until) > Date.now());
  });
  config.addFilter("query", value => encodeURIComponent(value));
  config.addFilter("facebookPage", value => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && ["facebook.com", "www.facebook.com"].includes(url.host) && url.pathname !== "/" ? url.href : "";
    } catch { return ""; }
  });
  return { dir: { input: "src", output: "_site" }, pathPrefix: process.env.PATH_PREFIX || "/" };
}
