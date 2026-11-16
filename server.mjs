import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import service from './service.mjs';

// Serves the static build output that ships with this file: `react-scripts
// build` writes index.html, manifest.json and the hashed assets of
// static/ next to it, and the build script copies this server and its
// service declaration into the same folder.
const root = fileURLToPath(new URL('.', import.meta.url));
const port = service.port();

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.webmanifest': 'application/manifest+json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.pdf': 'application/pdf',
};

function sendFile(res, filePath, method) {
  const type = mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
  stat(filePath)
    .then((stats) => {
      if (!stats.isFile()) throw new Error('not a file');
      res.writeHead(200, {
        'Content-Type': type,
        'Content-Length': stats.size,
        'Cache-Control': filePath.includes(`${path.sep}static${path.sep}`)
          ? 'public, max-age=31536000, immutable'
          : 'no-cache',
      });
      if (method === 'HEAD') {
        res.end();
        return;
      }
      createReadStream(filePath).pipe(res);
    })
    .catch(() => {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
    });
}

function serveIndex(res, method) {
  sendFile(res, path.join(root, 'index.html'), method);
}

const server = createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method not allowed');
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad request');
    return;
  }

  const segments = pathname.split('/').filter((segment) => segment !== '' && segment !== '.');
  if (segments.includes('..')) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad request');
    return;
  }

  const filePath = path.join(root, ...segments);
  stat(filePath)
    .then((stats) => {
      if (stats.isDirectory()) {
        serveIndex(res, req.method);
      } else {
        sendFile(res, filePath, req.method);
      }
    })
    .catch(() => {
      // Single-page app: unknown routes render the app, unknown assets 404.
      const lastSegment = segments[segments.length - 1] || '';
      if (lastSegment.includes('.')) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
      } else {
        serveIndex(res, req.method);
      }
    });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`nomadisa-booking-app web service listening on 0.0.0.0:${port}`);
});

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
    // Fall back to a hard exit if open connections keep the server alive.
    setTimeout(() => process.exit(0), 5000).unref();
  });
}
