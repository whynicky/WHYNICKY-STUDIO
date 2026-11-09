import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sitePath } from './src/site-path.js';

const directory = resolve(dirname(fileURLToPath(import.meta.url)), 'dist');
const host = '127.0.0.1';
const port = Number(process.env.PORT || 4173);
const base = sitePath('/');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
};

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!pathname.startsWith(base)) throw new Error('Path outside the site.');
    let path = resolve(directory, pathname.slice(base.length));
    if (path !== directory && !path.startsWith(directory + sep)) {
      response.writeHead(403).end();
      return;
    }
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    const content = await readFile(path);
    response.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : await readFile(resolve(directory, '404.html')));
  }
}).listen(port, host, () => console.log(`Local: http://${host}:${port}${base}`));
