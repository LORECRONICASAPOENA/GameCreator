"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const host = "127.0.0.1";
const port = Number(process.env.APOENA_TEST_PORT || 4173);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://" + host).pathname);
  } catch (_) {
    res.writeHead(400).end("Bad request");
    return;
  }

  const requested = path.resolve(root, "." + pathname);
  if (requested !== root && !requested.startsWith(root + path.sep)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  let file = requested;
  try {
    if (fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  } catch (_) {
    res.writeHead(404).end("Not found");
    return;
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(error.code === "ENOENT" ? 404 : 500).end("Unable to read file");
      return;
    }
    res.writeHead(200, {
      "Content-Type": mime[path.extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    });
    res.end(data);
  });
});

server.listen(port, host, () => {
  process.stdout.write("APOENA_TEST_SERVER_READY http://" + host + ":" + port + "\n");
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
