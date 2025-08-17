This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

On Vercel, set an Environment Variable `DATABASE_URL` with your managed Postgres connection string (e.g. Neon/Supabase). Add a Postgres add-on or external DB. Then add a post-deploy hook to run `npm run db:migrate`.

## Database (PostgreSQL + Prisma)

This project uses Prisma as an ORM with a PostgreSQL database.

### 1. Spin up PostgreSQL locally (Docker)

If you have Docker installed, the easiest way is to use the bundled `docker-compose.yml` file:

```bash
docker compose up -d db
```

This will start a PostgreSQL 15 instance listening on `localhost:5432` with the following credentials:

```
user:     postgres
password: password
database: turaco_db
```

### 2. Configure the connection string

Create a `.env` file in the root of the project (if you don’t already have one) and add:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/turaco_db"
```

### 3. Run migrations & generate client

```bash
# Install deps
npm install

# Apply migrations + generate Prisma client
npm run db:migrate
npm run db:generate
```

> The Prisma schema now has an index on `shopifyOrderId` to speed up look-ups by order.

### 4. Verify everything works

With the database up and migrations applied, the `app/api/shopify/webhook/order/route.ts` endpoint will now persist **each Heartlink line-item** it receives. The response contains the generated `slug`(s):

```json
{
  "success": true,
  "slugs": ["1234-1-abc123", "1234-2-def456"]
}
```

You can inspect the `Heartlink` table in PostgreSQL to confirm the records were written (e.g. `SELECT slug, shopifyOrderId FROM "Heartlink";`).

### Production setup checklist

- Set `DATABASE_URL` to your managed Postgres instance (Neon, Supabase, RDS). Include SSL params if required.
- Run `npm run db:migrate` during deploy (CI/CD step or build hook).
- API routes run on Node.js runtime (`export const runtime = 'nodejs'`).
- Never commit secrets. Use `.env`/hosted secrets.
- Consider connection pooling (PgBouncer) for serverless platforms.

### Supabase (Production) Setup

1. Create a Supabase project and Postgres database.

2. Get connection strings from: Project Settings → Database → Connection Info

- `DATABASE_URL` (pooled, for app):

```
postgresql://postgres:[YOUR_PASSWORD]@db.[PROJECT_REF].supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require
```

- `DIRECT_URL` (direct, for migrations):

```
postgresql://postgres:[YOUR_PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?sslmode=require
```

3. In your prod environment variables, set:

- `DATABASE_URL` = pooled URL above
- `DIRECT_URL` = direct URL above

4. On deploy, run migrations (CI/CD step or platform hook):

```
npm run db:migrate:prod
```

5. Verify:

- Use Supabase SQL editor to run: `SELECT slug, "shopifyOrderId" FROM "Heartlink" LIMIT 10;`
- Or connect locally with psql using the direct URL.
