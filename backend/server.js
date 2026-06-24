/**
 * Point d'entrée Phusion Passenger (cPanel « Setup Node.js App »).
 *
 * Passenger fournit le port via process.env.PORT — ne jamais le hardcoder.
 * Exécuter `npm run build` avant le premier démarrage.
 */
require('./dist/main.js');
