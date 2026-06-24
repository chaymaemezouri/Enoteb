# enoteb

Monorepo avec :
- `frontend/` : Next.js 14 (App Router, TypeScript strict, Tailwind, ESLint + Prettier)
- `backend/` : NestJS (TypeScript strict, structure modulaire, Prisma + MySQL, validation d'env)

## Prérequis

- Node.js (LTS recommandé)
- npm
- MySQL (local ou Docker)

## Installation

À la racine :

```bash
npm install
```

## Frontend (Next.js)

```bash
cd frontend
npm run dev
```

Par défaut : http://localhost:3000

## Backend (NestJS)

1) Copier l'exemple d'environnement :

```bash
cd backend
copy .env.example .env
```

2) Renseigner `DATABASE_URL` et les autres variables dans `backend/.env`.

3) (Optionnel) Initialiser la base via Prisma quand vous ajouterez des modèles :

```bash
npx prisma migrate dev
```

4) Lancer l'API :

```bash
npm run start:dev
```

Par défaut : http://localhost:3000 (configurable via `PORT`).

