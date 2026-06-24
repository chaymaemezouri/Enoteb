# Déploiement eNoteb sur HeberFacile (cPanel + Phusion Passenger)

Guide pour héberger le **backend API** (`api.enoteb.ma`) et le **frontend Next.js SSR** (`enoteb.ma` / `www.enoteb.ma`) sur un hébergement mutualisé cPanel.

> **Option retenue : A (SSR)** — deux applications Node.js distinctes.  
> L’export statique (`output: 'export'`) n’est **pas** utilisé (middleware admin, SSR, `generateMetadata`, etc.).

---

## Architecture cible

| Composant | Domaine | Dossier cPanel (exemple) | Fichier de démarrage |
|-----------|---------|--------------------------|----------------------|
| Frontend Next.js 14 | `enoteb.ma` | `/home/USER/enoteb-frontend` | `server.js` |
| Backend NestJS 10 | `api.enoteb.ma` | `/home/USER/enoteb-api` | `server.js` |
| MySQL | localhost | Base dédiée | — |
| Fichiers uploadés | — | `/home/USER/enoteb-api/uploads` | servis par l’API sur `/uploads/` |

**Prérequis :** Node.js **20+** (vérifier dans cPanel → *Setup Node.js App*).

---

## 1. Base de données MySQL

### 1.1 Créer la base et l’utilisateur

1. Connexion à **cPanel** HeberFacile.
2. Ouvrir **Bases de données MySQL** (*MySQL® Databases*).
3. **Créer une base** : ex. `enoteb` → nom complet `cpaneluser_enoteb`.
4. **Créer un utilisateur** : ex. `enoteb_app` → `cpaneluser_enoteb_app` avec un mot de passe fort.
5. **Associer** l’utilisateur à la base avec **tous les privilèges**.

### 1.2 Chaîne de connexion

Format Prisma / `DATABASE_URL` :

```text
mysql://cpaneluser_enoteb_app:MOT_DE_PASSE@localhost:3306/cpaneluser_enoteb
```

> Sur l’hébergement mutualisé, l’hôte est presque toujours `localhost`.

---

## 2. Backend API (`api.enoteb.ma`)

### 2.1 Structure du build

```bash
cd backend
npm ci
npm run build          # génère dist/main.js (autonome, CommonJS)
```

Le dossier `dist/` contient l’application compilée. Le point d’entrée Passenger est **`server.js`** à la racine du backend, qui charge `dist/main.js`.

**Important :** l’application écoute **`process.env.PORT`** (injecté par Passenger). Aucun port n’est hardcodé.

### 2.2 Upload du code

**Option A — Git (recommandé si disponible)**

1. cPanel → **Git Version Control** → cloner le dépôt.
2. Spécifier le répertoire cible : `/home/USER/enoteb-api`.
3. Après clone : terminal SSH ou *Terminal* cPanel :

```bash
cd ~/enoteb-api/backend
npm ci
npm run build
npx prisma migrate deploy
# Seed initial (une seule fois) :
SEED_ADMIN_PASSWORD="votre-mot-de-passe-admin" npx prisma db seed
```

**Option B — FTP / Gestionnaire de fichiers**

1. En local : `npm ci && npm run build` dans `backend/`.
2. Uploader **tout le dossier `backend/`** (sauf `node_modules` si vous préférez installer sur le serveur).
3. Sur le serveur (SSH) :

```bash
cd ~/enoteb-api/backend
npm ci --omit=dev    # ou npm ci complet si vous compilez sur le serveur
npm run build        # si build local non uploadé
npx prisma generate
npx prisma migrate deploy
```

> **Sharp** (optimisation images) : exécuter `npm ci` **sur le serveur Linux**, ne pas copier `node_modules` depuis Windows.

### 2.3 Prisma — commandes de déploiement

| Étape | Commande | Quand |
|-------|----------|-------|
| Générer le client | `npx prisma generate` | Après chaque `npm install` (automatique via `postinstall`) |
| Appliquer les migrations | `npx prisma migrate deploy` | À chaque déploiement avec nouvelles migrations |
| Données initiales | `SEED_ADMIN_PASSWORD="..." npx prisma db seed` | **Une seule fois** après la première migration |

Script npm raccourci :

```bash
npm run deploy:db
```

### 2.4 Setup Node.js App (backend)

cPanel → **Setup Node.js App** → **Create Application** :

| Champ | Valeur |
|-------|--------|
| Node.js version | 20.x ou supérieur |
| Application mode | Production |
| Application root | `/home/USER/enoteb-api/backend` |
| Application URL | `api.enoteb.ma` (sous-domaine) |
| Application startup file | `server.js` |
| Passenger log file | (laisser par défaut ou personnaliser) |

Cliquer **Run NPM Install**, puis **Restart**.

### 2.5 Variables d’environnement backend (cPanel)

Dans *Setup Node.js App* → votre app API → **Environment variables** (ou fichier `.env` à la racine `backend/`) :

| Variable | Exemple / description |
|----------|----------------------|
| `NODE_ENV` | `production` |
| `PORT` | **Ne pas définir** — Passenger l’injecte |
| `DATABASE_URL` | `mysql://cpaneluser_enoteb_app:XXX@localhost:3306/cpaneluser_enoteb` |
| `JWT_SECRET` | Secret long aléatoire (`openssl rand -base64 48`) |
| `JWT_REFRESH_SECRET` | Autre secret long aléatoire |
| `JWT_EXPIRES_IN` | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | `7d` |
| `SMTP_HOST` | `mail.enoteb.ma` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `contact@enoteb.ma` |
| `SMTP_PASS` | Mot de passe de la boîte mail cPanel |
| `CONTACT_EMAIL` | `contact@enoteb.ma` |
| `CORS_ORIGIN` | `https://enoteb.ma` |
| `UPLOAD_DIR` | `/home/USER/enoteb-api/backend/uploads` (chemin absolu) |
| `MAX_FILE_SIZE` | `5242880` |
| `UPLOAD_IMAGE_MAX_WIDTH` | `1920` |
| `UPLOAD_IMAGE_MAX_HEIGHT` | `1920` |
| `UPLOAD_THUMBNAIL_WIDTH` | `640` |
| `UPLOAD_IMAGE_QUALITY` | `82` |
| `SEED_ADMIN_PASSWORD` | Uniquement pour la commande seed (pas obligatoire en runtime) |

Créer le dossier uploads et droits d’écriture :

```bash
mkdir -p ~/enoteb-api/backend/uploads
chmod 755 ~/enoteb-api/backend/uploads
```

### 2.6 Vérification backend

```bash
curl https://api.enoteb.ma/health
# → {"status":"ok",...}
```

---

## 3. Frontend Next.js SSR (`enoteb.ma`)

### 3.1 Build

```bash
cd frontend
npm ci
npm run build        # génère .next/
```

Le démarrage production utilise **`server.js`** (compatible Passenger), qui lance Next.js en mode SSR sur `process.env.PORT`.

> **Middleware** (`middleware.ts` pour `/admin/*`) : compatible SSR, pas compatible export statique.

> **Images** : optimisation Next.js active (pas de `output: 'export'`). Les images distantes (`api.enoteb.ma/uploads`) sont autorisées dans `next.config.mjs`.

### 3.2 Upload du code

Même logique que le backend : Git clone ou FTP du dossier `frontend/`.

Sur le serveur :

```bash
cd ~/enoteb-frontend/frontend
npm ci
npm run build
```

### 3.3 Setup Node.js App (frontend)

| Champ | Valeur |
|-------|--------|
| Application root | `/home/USER/enoteb-frontend/frontend` |
| Application URL | `enoteb.ma` (domaine principal) |
| Application startup file | `server.js` |
| Application mode | Production |

Répéter pour `www.enoteb.ma` si nécessaire (redirection ou 2ᵉ app — souvent une redirection cPanel suffit).

### 3.4 Variables d’environnement frontend

| Variable | Valeur |
|----------|--------|
| `NODE_ENV` | `production` |
| `PORT` | **Ne pas définir** (Passenger) |
| `NEXT_PUBLIC_API_URL` | `https://api.enoteb.ma` |
| `NEXT_PUBLIC_SITE_URL` | `https://enoteb.ma` |

Après modification des variables `NEXT_PUBLIC_*`, **rebuild obligatoire** :

```bash
npm run build
```

Puis redémarrer l’app Node dans cPanel.

### 3.5 Vérification frontend

- `https://enoteb.ma` — page d’accueil
- `https://enoteb.ma/sitemap.xml`
- `https://enoteb.ma/robots.txt`
- `https://enoteb.ma/admin/login` — espace admin

---

## 4. Sous-domaine `api.enoteb.ma`

1. cPanel → **Sous-domaines** (*Subdomains*).
2. Créer `api` pour le domaine `enoteb.ma`.
3. Document root : pointer vers le dossier de l’app Node backend (souvent géré automatiquement par *Setup Node.js App*).
4. Associer l’application Node.js créée à l’étape 2.4 à ce sous-domaine.

---

## 5. Certificat SSL (Let’s Encrypt)

1. cPanel → **SSL/TLS Status** ou **Let’s Encrypt™ SSL**.
2. Cocher **`enoteb.ma`**, **`www.enoteb.ma`** et **`api.enoteb.ma`**.
3. Cliquer **Run AutoSSL** / **Install** pour chaque domaine.
4. Activer la redirection HTTPS : cPanel → **Domains** → redirection **Always use HTTPS** (ou règle dans `.htaccess`).

Le backend force déjà la redirection HTTPS en production (`HttpsRedirectMiddleware`).

---

## 6. Email SMTP (formulaire de contact)

### 6.1 Créer la boîte mail

1. cPanel → **Comptes de messagerie** (*Email Accounts*).
2. Créer `contact@enoteb.ma` avec un mot de passe fort.

### 6.2 Paramètres SMTP (backend)

| Paramètre | Valeur typique HeberFacile |
|-----------|---------------------------|
| Hôte | `mail.enoteb.ma` |
| Port | `587` (STARTTLS) ou `465` (SSL) |
| Utilisateur | `contact@enoteb.ma` |
| Mot de passe | Mot de passe de la boîte |
| Destinataire (`CONTACT_EMAIL`) | `contact@enoteb.ma` |

Si le port 587 est bloqué, tester `465` avec `secure: true` (adapter `SMTP_PORT` dans la config).

### 6.3 Test

Soumettre le formulaire sur `https://enoteb.ma/contact` et vérifier la réception sur `contact@enoteb.ma`.

---

## 7. Checklist de déploiement

```text
[ ] Base MySQL créée + utilisateur associé
[ ] Backend uploadé dans ~/enoteb-api/backend
[ ] npm ci && npm run build (backend, sur le serveur Linux)
[ ] npx prisma migrate deploy
[ ] npx prisma db seed (première fois uniquement)
[ ] Dossier uploads créé et accessible en écriture
[ ] Variables d'environnement backend configurées
[ ] App Node backend : startup server.js, restart OK
[ ] https://api.enoteb.ma/health répond
[ ] Frontend uploadé dans ~/enoteb-frontend/frontend
[ ] npm ci && npm run build (frontend)
[ ] Variables NEXT_PUBLIC_* configurées + rebuild
[ ] App Node frontend : startup server.js, restart OK
[ ] SSL actif sur enoteb.ma, www, api.enoteb.ma
[ ] Formulaire contact testé
[ ] Connexion admin /admin/login testée
[ ] Upload d'image admin testé
```

---

## 8. Mises à jour ultérieures

**Backend :**

```bash
cd ~/enoteb-api/backend
git pull origin main          # si Git
npm ci
npm run build
npx prisma migrate deploy
# Redémarrer l'app Node dans cPanel
```

**Frontend :**

```bash
cd ~/enoteb-frontend/frontend
git pull origin main
npm ci
npm run build
# Redémarrer l'app Node dans cPanel
```

---

## 9. Dépannage courant

| Symptôme | Cause probable | Action |
|---------|----------------|--------|
| 502 Bad Gateway | Build manquant ou crash au démarrage | Vérifier logs Passenger dans cPanel ; `npm run build` ; `server.js` présent |
| Erreur Prisma | `DATABASE_URL` incorrect ou migrations non appliquées | `npx prisma migrate deploy` ; tester la connexion MySQL |
| CORS bloqué | `CORS_ORIGIN` ne correspond pas au frontend | Mettre `https://enoteb.ma` (sans slash final) |
| Images admin 404 | `UPLOAD_DIR` incorrect ou non writable | Chemin absolu + `chmod` |
| Contact email échoue | SMTP incorrect | Vérifier identifiants boîte cPanel, port 587/465 |
| `next build` échoue (Prettier CRLF) | Fins de ligne Windows | `npm run lint:fix` ou convertir en LF avant upload |
| Sharp / modules natifs | `node_modules` copiés depuis Windows | `rm -rf node_modules && npm ci` sur le serveur Linux |

---

## 10. Fichiers clés du projet

| Fichier | Rôle |
|---------|------|
| `backend/server.js` | Entrée Passenger → `dist/main.js` |
| `backend/dist/main.js` | Application NestJS compilée |
| `backend/.env.example` | Modèle variables backend |
| `frontend/server.js` | Entrée Passenger → Next.js SSR |
| `frontend/.env.example` | Modèle variables frontend |
| `backend/prisma/migrations/` | Migrations SQL à déployer |

---

## 11. Sécurité production

- Ne **jamais** committer `.env` / `.env.local` (utiliser `.env.example` comme modèle).
- Générer des `JWT_SECRET` et `JWT_REFRESH_SECRET` uniques et longs.
- `NODE_ENV=production` sur les deux apps.
- Changer le mot de passe admin seedé après la première connexion.
- Sauvegardes régulières de la base MySQL via cPanel (*Backup*).
