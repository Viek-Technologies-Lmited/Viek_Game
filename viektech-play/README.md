# ViekPlay

ViekPlay is a monorepo (npm workspaces) for a quiz/game platform. It contains a NestJS API, a web frontend (Next.js), and shared TypeScript packages.

## Structure

```
viektech-play/
├── apps/
│   ├── api/                    # NestJS API (TypeScript)
│   │   ├── prisma/
│   │   │   └── schema.prisma   # Prisma schema (PostgreSQL)
│   │   └── src/
│   │       ├── main.ts         # Entry point (port 3000, /api prefix)
│   │       ├── app.module.ts   # Root module
│   │       ├── admin/          # Admin module (controller + service)
│   │       ├── auth/           # Auth module (JWT + Passport)
│   │       ├── games/          # Game sessions module
│   │       ├── gateway/        # WebSocket gateway (Socket.IO)
│   │       ├── leaderboard/    # Leaderboard module
│   │       ├── organizations/  # Organizations module
│   │       ├── payments/       # Payments module
│   │       ├── prisma/         # Prisma service wrapper
│   │       ├── questions/      # Questions & categories module
│   │       └── users/          # Users module
│   └── web/                    # Next.js frontend (coming soon)
├── packages/
│   └── shared-types/           # Shared TypeScript types
├── .gitignore
├── package.json                # Monorepo root
└── README.md
```

## Getting Started

### 1. Install dependencies

From the repository root:

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in `apps/api` by copying the example file:

```bash
cp apps/api/.env.example apps/api/.env
```

Make sure you have a PostgreSQL database running, and update the `DATABASE_URL` and `JWT_SECRET` in your `apps/api/.env` file.

### 3. Database Setup

Run the Prisma migrations to set up your database schema:

```bash
cd apps/api
npx prisma migrate dev
```

### 4. Generate Prisma client (after schema changes)

```bash
npm run prisma:generate -w @viekplay/api
```

### 5. Run the API (development mode with hot-reload)

```bash
npm run dev:api
```

The API starts on **http://localhost:3000** with the `/api` prefix.

**Available endpoints** (empty placeholders for now):
| Method | Endpoint                     | Module         |
|--------|------------------------------|----------------|
| GET    | `/api/auth`                  | Auth           |
| GET    | `/api/users`                 | Users          |
| GET    | `/api/organizations`         | Organizations  |
| GET    | `/api/questions`             | Questions      |
| GET    | `/api/games`                 | Games          |
| GET    | `/api/leaderboard`           | Leaderboard    |
| GET    | `/api/payments`              | Payments       |
| GET    | `/api/admin`                 | Admin          |

**WebSocket**: Socket.IO gateway available at `ws://localhost:3000` (CORS enabled for all origins).

### 4. Run the web frontend (when ready)

```bash
npm run dev:web
```

### 5. Run both together

```bash
npm run dev
```

## Prisma database

The schema uses PostgreSQL. Configure your database URL in `apps/api/.env`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/viekplay?schema=public"
```

Push the schema to your database:

```bash
npm run prisma:push -w @viekplay/api
```

## Environment variables

Copy `apps/api/.env` and adjust values:

| Variable         | Description                        | Default                              |
|------------------|------------------------------------|--------------------------------------|
| `DATABASE_URL`   | PostgreSQL connection string       | `postgresql://postgres:postgres@localhost:5432/viekplay` |
| `JWT_SECRET`     | Secret key for JWT signing         | `super-secret-key-change-in-production` |
| `JWT_EXPIRATION` | JWT token expiry duration          | `1d`                                 |

## Tech stack

- **Runtime**: Node.js, TypeScript
- **API framework**: NestJS
- **Database ORM**: Prisma (PostgreSQL)
- **Auth**: JWT via `@nestjs/jwt` + `passport-jwt`
- **Real-time**: WebSocket via `@nestjs/websockets` + Socket.IO
- **Validation**: `class-validator` + `class-transformer` (global `ValidationPipe`)
- **Configuration**: `@nestjs/config` (`.env` file)