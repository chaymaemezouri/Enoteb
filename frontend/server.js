/**
 * Point d'entrée Phusion Passenger pour Next.js (Option A — SSR).
 *
 * Passenger injecte process.env.PORT. Ne jamais hardcoder un port.
 * Exécuter `npm run build` avant le premier démarrage.
 */
const http = require('http');
const { parse } = require('url');
const next = require('next');

const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

const app = next({
  dev: false,
  hostname,
  port,
});

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    http
      .createServer(async (req, res) => {
        try {
          const parsedUrl = parse(req.url, true);
          await handle(req, res, parsedUrl);
        } catch (error) {
          console.error('Erreur Next.js:', error);
          res.statusCode = 500;
          res.end('Erreur interne du serveur');
        }
      })
      .listen(port, hostname, () => {
        console.log(`Next.js prêt sur le port ${port}`);
      });
  })
  .catch((error) => {
    console.error('Échec du démarrage Next.js:', error);
    process.exit(1);
  });
