/**
 * Point d'entrée Phusion Passenger pour Next.js (cPanel « Setup Node.js App »).
 *
 * Passenger injecte process.env.PORT — ne jamais hardcoder un port.
 * Exécuter `npm run build:deploy` avant le déploiement.
 */
const fs = require('fs');
const http = require('http');
const path = require('path');
const { parse } = require('url');
const next = require('next');

const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';
const isPassenger = typeof PhusionPassenger !== 'undefined';
const rootDir = __dirname;

const MIME_TYPES = {
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

const PUBLIC_STATIC_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.svg',
  '.ico',
  '.mp4',
  '.webm',
  '.woff',
  '.woff2',
  '.pdf',
]);

function sendStaticFile(res, filePath, cacheControl) {
  const ext = path.extname(filePath).toLowerCase();
  res.statusCode = 200;
  res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
  res.setHeader('Cache-Control', cacheControl);
  fs.createReadStream(filePath).pipe(res);
  return true;
}

function tryServePublicFile(req, res, pathname) {
  if (pathname.startsWith('/_next/') || pathname.includes('..')) {
    return false;
  }

  let decodedPathname;
  try {
    decodedPathname = decodeURIComponent(pathname);
  } catch {
    return false;
  }

  const ext = path.extname(decodedPathname).toLowerCase();
  if (!PUBLIC_STATIC_EXTENSIONS.has(ext)) {
    return false;
  }

  const publicDir = path.join(rootDir, 'public');
  const relativePath = decodedPathname.replace(/^\/+/, '');
  const filePath = path.join(publicDir, relativePath);

  if (!filePath.startsWith(publicDir) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return false;
  }

  return sendStaticFile(res, filePath, 'public, max-age=86400');
}

function tryServeNextStatic(req, res, pathname) {
  if (!pathname.startsWith('/_next/static/')) {
    return false;
  }

  const relativePath = pathname.slice('/_next/static/'.length);
  if (!relativePath || relativePath.includes('..')) {
    return false;
  }

  const candidates = [path.join(rootDir, '.next', 'static', relativePath)];

  for (const filePath of candidates) {
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      continue;
    }

    const ext = path.extname(filePath).toLowerCase();
    return sendStaticFile(res, filePath, 'public, max-age=31536000, immutable');
  }

  return false;
}

const app = next({
  dev: false,
  hostname,
  port,
});

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = http.createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        const pathname = parsedUrl.pathname ?? '/';

        if (tryServeNextStatic(req, res, pathname)) {
          return;
        }

        if (tryServePublicFile(req, res, pathname)) {
          return;
        }

        await handle(req, res, parsedUrl);
      } catch (error) {
        console.error('Erreur Next.js:', error);
        res.statusCode = 500;
        res.end('Erreur interne du serveur');
      }
    });

    if (isPassenger) {
      PhusionPassenger.configure({ autoInstall: false });
      server.listen('passenger', () => {
        console.log('Next.js prêt (Phusion Passenger)');
      });
    } else {
      server.listen(port, hostname, () => {
        console.log(`Next.js prêt sur le port ${port}`);
      });
    }
  })
  .catch((error) => {
    console.error('Échec du démarrage Next.js:', error);
    process.exit(1);
  });
