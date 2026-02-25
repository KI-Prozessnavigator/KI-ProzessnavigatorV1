const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

// Saubere URLs -> .html Dateien (wie auf dem Live-Server)
const SLUGS = {
  '/': 'index.html',
  '/impressum': 'impressum.html',
  '/datenschutz': 'datenschutz.html',
  '/agb': 'agb.html',
  '/ueber-uns': 'ueber-uns.html'
};

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function send(res, status, body, contentType) {
  res.writeHead(status, { 'Content-Type': contentType || 'text/plain' });
  res.end(body);
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') return send(res, 404, 'Not Found', 'text/plain');
      return send(res, 500, 'Server Error', 'text/plain');
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  let urlPath = req.url?.split('?')[0] || '/';
  if (urlPath.endsWith('/') && urlPath !== '/') urlPath = urlPath.slice(0, -1);

  // Saubere URL -> .html
  if (SLUGS[urlPath] !== undefined) {
    return serveFile(res, path.join(ROOT, SLUGS[urlPath]));
  }

  // Statische Datei (z. B. /css/style.css, /js/main.js, /sitemap.xml)
  const filePath = path.join(ROOT, path.normalize(urlPath).replace(/^(\.\.(\/|\\))+/, ''));
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      return send(res, 404, 'Not Found', 'text/plain');
    }
    serveFile(res, filePath);
  });
});

server.listen(PORT, () => {
  console.log(`Dev-Server: http://localhost:${PORT}/`);
});
