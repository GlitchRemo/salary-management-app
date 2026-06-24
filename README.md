**Live app:** https://salary-management-app-k786.onrender.com


## Local Setup

### Prerequisites

- [Node.js](https://nodejs.org) v18+
- [pnpm](https://pnpm.io) v8+

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Copy the example env file and set your database URL:

```bash
cp .env.example .env
```

The default `.env` uses a local SQLite file which requires no extra configuration:

```
DATABASE_URL="file:./dev.db"
```

### 3. Run database migrations

```bash
pnpm prisma migrate dev
```

This creates the SQLite database at `dev.db` and applies all migrations.

### 4. Seed the database

```bash
pnpm tsx prisma/seed.ts
```

This inserts 1 sample HR user, 5 employees, and audit records. The script uses `upsert` for HR user and employees, so it is safe to run multiple times without creating duplicates.

### 5. Start the development server

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Test Credentials

The seed inserts one HR user. Use these credentials to log in:

| Field    | Value          |
|----------|----------------|
| Email    | hr@acme.com    |
| Password | password       |

