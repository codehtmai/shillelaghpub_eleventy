// Run during publication. Only the public projection below goes into the Pages artifact.
import { readFile, writeFile } from "node:fs/promises";
import { parseDocument, DomUtils } from "htmlparser2";

const pageId = "431613724250812";
const pageUrl = "https://www.facebook.com/ShillelaghPub";
const path = new URL("../src/_data/facebookFeed.json", import.meta.url);
const publishedFeed = "https://codehtmai.github.io/shillelaghpub_eleventy/assets/facebook-feed.json";

async function request(url, headers = {}) {
  const response = await fetch(url, { headers, redirect: headers.Authorization ? "error" : "follow", signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error("HTTP " + response.status);
  return response;
}

function publicPost(post) {
  const link = new URL(post.url);
  if (link.origin !== "https://www.facebook.com" || link.username || link.password) {
    throw new Error("Unexpected post permalink");
  }
  return {
    date: new Date(post.date).toISOString(),
    text: String(post.text || "").trim(),
    url: link.href
  };
}

async function graphPosts(token) {
  const endpoint = new URL("https://graph.facebook.com/v24.0/" + pageId + "/published_posts");
  endpoint.search = new URLSearchParams({ fields: "message,created_time,permalink_url", limit: "5" });
  const response = await request(endpoint, { Authorization: "Bearer " + token });
  const { data } = await response.json();
  return data.map(post => publicPost({ date: post.created_time, text: post.message, url: post.permalink_url }));
}

async function clubPosts() {
  const html = await (await request("https://shillelaghpub.com/")).text();
  const doc = parseDocument(html);
  const rows = DomUtils.findAll(node => node.attribs["data-cff-from"] === pageId, doc.children);
  const posts = [];
  for (const row of rows) {
    const message = DomUtils.findOne(node => node.attribs.class?.split(/\s+/).includes("cff-text"), row.children);
    const link = DomUtils.findOne(node => node.attribs.class?.split(/\s+/).includes("cff-viewpost-facebook"), row.children);
    const text = message && DomUtils.textContent(message).trim();
    if (text && link) {
      posts.push(publicPost({ url: link.attribs.href, text, date: Number(row.attribs["data-cff-timestamp"]) * 1000 }));
    }
  }
  if (!posts.length) throw new Error("No published club feed entries found");
  return posts.slice(0, 5);
}

async function save(posts) {
  await writeFile(path, JSON.stringify({ pageUrl, posts }, null, 2) + "\n");
}

try {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const posts = token ? await graphPosts(token) : await clubPosts();
  await save(posts);
  console.log("Refreshed " + posts.length + " public club posts.");
} catch (error) {
  console.warn("::warning::Facebook refresh failed (" + error.message + "). Keeping the last published feed.");
  try {
    const feed = await (await request(publishedFeed)).json();
    if (feed.pageUrl !== pageUrl || !Array.isArray(feed.posts)) throw new Error("Unexpected feed");
    await save(feed.posts.slice(0, 5).map(publicPost));
  } catch {
    // The checked-in snapshot also supports first deployments and offline builds.
    await readFile(path);
    console.warn("Using the repository's dated feed snapshot.");
  }
}
