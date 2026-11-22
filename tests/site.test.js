import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cp, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const cli = path.resolve("node_modules/.bin/eleventy");
async function build(t, settings, prefix, notice = "") {
  const directory = await mkdtemp(path.join(os.tmpdir(), "club-site-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const input = path.join(directory, "src");
  const output = path.join(directory, "_site");
  await cp("src", input, { recursive: true });
  if (notice) await writeFile(path.join(input, "news", "sample.md"), notice);
  const settingsFile = path.join(input, "_data", "club.json");
  const club = JSON.parse(await readFile(settingsFile));
  await writeFile(settingsFile, JSON.stringify({ ...club, ...settings }));
  await cp("eleventy.config.js", path.join(directory, "eleventy.config.js"));
  await cp("package.json", path.join(directory, "package.json"));
  await symlink(path.resolve("node_modules"), path.join(directory, "node_modules"), "dir");
  execFileSync(cli, [], {
    cwd: directory,
    env: { ...process.env, PATH_PREFIX: prefix }
  });
  return route => readFile(path.join(output, route, "index.html"), "utf8");
}

test("renders six public pages and handles unconfigured services on a project subpath", async t => {
  const page = await build(t, { facebookUrl: "", address: "", calendarId: "" }, "/club/");
  for (const route of ["", "story", "menus", "news", "events", "visit"]) {
    const html = await page(route);
    assert.match(html, /<h1>/);
    assert.match(html, /href="\/club\/assets\/style.css"/);
    assert.match(html, /href="\/club\/visit\/"/);
    assert.doesNotMatch(html, /<iframe/);
  }
});

test("renders provider URLs and direct links from editor settings", async t => {
  const page = await build(t, {
    calendarId: "test+club@example.org", calendarZone: "America/New_York",
    facebookUrl: "https://www.facebook.com/exampleclub", address: "1 Test Street, Example"
  }, "/");
  const events = await page("events");
  assert.match(events, /calendar.google.com\/calendar\/embed\?src=test%2Bclub%40example.org&amp;ctz=America%2FNew_York/);
  assert.match(events, /mode=AGENDA/);
  const news = await page("news");
  assert.match(news, /href="https:\/\/www.facebook.com\/exampleclub"/);
  assert.doesNotMatch(news, /facebook.com\/plugins|View post on Facebook/);
  const visit = await page("visit");
  assert.match(visit, /maps.google.com\/maps\?q=1%20Test%20Street%2C%20Example/);
  assert.match(visit, /destination=1%20Test%20Street%2C%20Example/);
});

test("publishing a CMS notice creates a linked article", async t => {
  const notice = "---\ntitle: Club gathering\ndate: 2026-01-02\n---\nAn **editorial test** notice.\n\n![Club band](/assets/uploads/band.jpg)";
  const page = await build(t, {}, "/club/", notice);
  assert.match(await page("news"), /href="\/club\/news\/sample\/">Club gathering/);
  assert.match(await page("community"), /http-equiv="refresh" content="0; url=\/club\/news\/"/);
  const article = await page("news/sample");
  assert.ok(article.includes('src="/club/assets/uploads/band.jpg"'), "Notice uploads use the project path");
  assert.match(article, /<h1>Club gathering<\/h1>/);
  assert.match(article, /<strong>editorial test<\/strong>/);
});

test("renders club Facebook posts as dated HTML with direct permalinks", async t => {
  const page = await build(t, { facebookUrl: "https://www.facebook.com/ShillelaghPub" }, "/club/");
  const html = await page("news");
  assert.match(html, /<time datetime="/);
  assert.match(html, /View post on Facebook/);
  const snapshot = JSON.parse(await readFile("src/_data/facebookFeed.json", "utf8"));
  for (const post of snapshot.posts) {
    for (const photo of post.photos || []) {
      assert.ok(html.includes('src="/club' + photo + '"'), "Missing project-relative photo: " + photo);
      assert.ok((await readFile(path.join("src", photo))).length > 0);
    }
  }
  assert.doesNotMatch(html, /<iframe/);
});
