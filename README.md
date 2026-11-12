# Sahm Prospector

MVP SaaS de prospection de commerçants du Golfe (restaurants, dentistes, boutiques, services) avec faible présence web/social.

## Variables d'environnement
- DATABASE_URL (SQLite: file:./dev.db ou URL Postgres)
- OPENAI_API_KEY
- APIFY_TOKEN
- APP_PASSWORD

## Dev local
npm install
npx prisma generate
npx prisma db push
npm run dev

## Déploiement Vercel
Importer le repo GitHub sur Vercel, définir les env vars, déployer. Pour Postgres, passer DATABASE_URL en URL Postgres et provider prisma en postgresql.