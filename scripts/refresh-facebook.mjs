// Run during publication. Only the public projection below goes into the Pages artifact.
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { parseDocument, DomUtils } from "htmlparser2";

const pageId = "431613724250812";
const pageUrl = "https://www.facebook.com/ShillelaghPub";
const path = new URL("../src/_data/facebookFeed.json", import.meta.url);
const publishedFeed = "https://codehtmai.github.io/shillelaghpub_eleventy/assets/facebook-feed.json";

const mediaDir = new URL("../src/assets/facebook/", import.meta.url);
const localFeed = JSON.parse(await readFile(path, "utf8"));
await mkdir(mediaDir, { recursive: true });

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

// Store the image itself. Provider CDN URLs can expire between deployments.
async function mirrorPhoto(source) {
  const url = new URL(source);
  const published = new URL("./facebook/", publishedFeed);
  const fromArchive = url.origin === published.origin && url.pathname.startsWith(published.pathname);
  if (url.protocol !== "https:" || url.username || url.password ||
      !(fromArchive || url.hostname.endsWith(".fbcdn.net") || url.hostname === "shillelaghpub.com")) {
    throw new Error("Unexpected photo host");
  }
  const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error("Photo HTTP " + response.status);
  const bytes = Buffer.from(await response.arrayBuffer());
  let extension;
  if (bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]))) extension = "jpg";
  else if (bytes.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"))) extension = "png";
  else if (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") extension = "webp";
  else throw new Error("Unsupported photo format");
  const filename = createHash("sha256").update(bytes).digest("hex") + "." + extension;
  await writeFile(new URL(filename, mediaDir), bytes);
  return "/assets/facebook/" + filename;
}

async function withPhotos(post, sources) {
  const result = publicPost(post);
  result.photos = [];
  const previous = localFeed.posts.find(item => item.url === result.url);
  for (const [index, source] of [...new Set(sources.filter(Boolean))].entries()) {
    try {
      result.photos.push(await mirrorPhoto(source));
    } catch {
      const cached = previous?.photos?.[index];
      if (cached) result.photos.push(cached);
      console.warn("::warning::Could not refresh a photo for " + result.url);
    }
  }
  return result;
}

async function graphPosts(token) {
  const endpoint = new URL("https://graph.facebook.com/v24.0/" + pageId + "/published_posts");
  endpoint.search = new URLSearchParams({ fields: "message,created_time,permalink_url,full_picture,attachments{media,subattachments{media}}", limit: "5" });
  const response = await request(endpoint, { Authorization: "Bearer " + token });
  const { data } = await response.json();
  return Promise.all(data.map(post => {
    const attachments = (post.attachments?.data || []).flatMap(item => item.subattachments?.data || [item]);
    const images = attachments.map(item => item.media?.image?.src).filter(Boolean);
    return withPhotos({ date: post.created_time, text: post.message, url: post.permalink_url },
      images.length ? images : [post.full_picture]);
  }));
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
    const photos = DomUtils.findAll(node => node.name === "img" && node.attribs["data-orig-source"], row.children)
      .map(node => node.attribs["data-orig-source"]);
    if ((text || photos.length) && link) {
      posts.push(await withPhotos({ url: link.attribs.href, text, date: Number(row.attribs["data-cff-timestamp"]) * 1000 }, photos));
    }
  }
  if (!posts.length) throw new Error("No published pub feed entries found");
  return posts.slice(0, 5);
}

async function save(posts) {
  await writeFile(path, JSON.stringify({ pageUrl, posts }, null, 2) + "\n");
}

try {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const posts = token ? await graphPosts(token) : await clubPosts();
  await save(posts);
  console.log("Refreshed " + posts.length + " public pub posts.");
} catch (error) {
  console.warn("::warning::Facebook refresh failed (" + error.message + "). Keeping the last published feed.");
  try {
    const feed = await (await request(publishedFeed)).json();
    if (feed.pageUrl !== pageUrl || !Array.isArray(feed.posts)) throw new Error("Unexpected feed");
    const restored = [];
    for (const post of feed.posts.slice(0, 5)) {
      const sources = (post.photos || []).filter(photo => /^\/assets\/facebook\/[a-f0-9]{64}\.(jpg|png|webp)$/.test(photo))
        .map(photo => new URL("./" + photo.slice("/assets/".length), publishedFeed).href);
      restored.push(await withPhotos(post, sources));
    }
    await save(restored);
  } catch {
    // The checked-in snapshot also supports first deployments and offline builds.
    await readFile(path);
    console.warn("Using the repository's dated feed snapshot.");
  }
}
