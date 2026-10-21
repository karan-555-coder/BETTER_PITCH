// Tiny static server for running the BetterPitch site locally: node server.mjs [port]
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.argv[2] || process.env.PORT || 8080);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon",
  ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".json": "application/json",
};

http.createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  let file = path.join(ROOT, path.normalize(p));
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  if (!path.extname(file)) file += ".html"; // allow /pricing as well as /pricing.html
  try {
    const body = await fs.readFile(file);
    // no-store so edits show up on a normal refresh while developing
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" }).end(body);
  } catch {
    res.writeHead(404, { "Content-Type": TYPES[".html"] }).end(await fs.readFile(path.join(ROOT, "404.html")));
  }
}).listen(PORT, () => console.log(`BetterPitch running at http://localhost:${PORT}`));
