import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT) || 4173;
const host = process.env.HOST || '0.0.0.0';

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const requestedPath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const safePath = normalize(requestedPath).replace(/^(\.\.(\/|\\|$))+/, '');
  let filePath = join(root, safePath);

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    filePath = join(root, 'index.html');
  }

  response.writeHead(200, {
    'Content-Type': contentTypes[extname(filePath).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`NEON RIFT prêt sur http://${host}:${port}`);
});
