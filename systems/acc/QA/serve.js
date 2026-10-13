const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 4191);
const host = '127.0.0.1';
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

const server = http.createServer((request, response) => {
  const requestPath = decodeURIComponent((request.url || '/').split('?')[0]);
  const relative = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
  const target = path.resolve(root, relative);

  if (!target.startsWith(`${root}${path.sep}`) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end('Nicht gefunden');
    return;
  }

  response.writeHead(200, {
    'Content-Type': mime[path.extname(target).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
  });
  fs.createReadStream(target).pipe(response);
});

server.listen(port, host, () => {
  console.log(`AMAVIO ACC local server: http://${host}:${port}/`);
});
