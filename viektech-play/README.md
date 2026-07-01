# ViekPlay — by ViekEngr Dept

Interactive quiz gaming platform built with NestJS (API) + Next.js (Web) + PostgreSQL.

> **Built by Viek engr** — Full-stack quiz gaming experience with real-time multiplayer support.

---

##  Quick Start (How to View on Localhost)

### Step 1: Install all dependencies
```bash
npm install
```

### Step 2: Set up the API environment
Create `apps/api/.env` with your database settings:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/viekplay?schema=public"
JWT_SECRET="super-secret-key-change-in-production"
JWT_EXPIRATION="1d"
```

### Step 3: Set up the database
```bash
npm run prisma:push -w @viekplay/api
```

### Step 4: Start the backend API
```bash
npm run dev:api
```
The API starts on → **http://localhost:3000/api**
Swagger Docs → **http://localhost:3000/api/docs**

### Step 5: Start the frontend (in a separate terminal)
```bash
npm run dev:web
```
The Web app starts on → **http://localhost:3001**

### Step 6: Or run both together
```bash
npm run dev
```

---

## 📍 Where to View

| App        | URL                        |
|------------|----------------------------|
| Frontend   | http://localhost:3001       |
| API        | http://localhost:3000/api   |
| Swagger    | http://localhost:3000/api/docs |
| WebSocket  | ws://localhost:3000         |

---

## 🗂️ Project Structure

```
viektech-play/
├── apps/
│   ├── api/                    # NestJS API (TypeScript)
│   │   ├── prisma/
│   │   │   └── schema.prisma   # Prisma schema (PostgreSQL)
│   │   └── src/
│   │       ├── main.ts         # Entry point (port 3000, /api prefix)
│   │       ├── app.module.ts   # Root module
│   │       ├── admin/          # Admin module
│   │       ├── auth/           # Auth module (JWT + Passport)
│   │       ├── games/          # Game sessions module
│   │       ├── gateway/        # WebSocket gateway (Socket.IO)
│   │       ├── leaderboard/    # Leaderboard module
│   │       ├── organizations/  # Organizations module
│   │       ├── payments/       # Payments module (Paystack)
│   │       ├── prisma/         # Prisma service wrapper
│   │       ├── questions/      # Questions & categories module
│   │       └── users/          # Users module
│   └── web/                    # Next.js 16 Frontend
│       ├── app/
│       │   ├── page.tsx              # Landing / Home page
│       │   ├── login/page.tsx        # Login page
│       │   ├── register/page.tsx     # Register page
│       │   ├── games/page.tsx        # Game lobby
│       │   ├── games/[id]/page.tsx   # Real-time game room
│       │   ├── leaderboard/page.tsx  # Leaderboards
│       │   ├── profile/page.tsx      # User profile
│       │   ├── admin/page.tsx        # Admin dashboard
│       │   ├── layout.tsx            # Root layout + Navbar
│       │   ├── globals.css           # Game-theme styles
│       │   └── lib/
│       │       ├── api-client.ts     # API client for all endpoints
│       │       ├── auth-context.tsx   # Auth state management
│       │       └── use-socket.ts     # WebSocket real-time hook
│       └── components/
│           └── navbar.tsx            # Navigation bar
├── packages/
│   └── shared-types/           # Shared TypeScript types
└── package.json                # Monorepo root
```

---

## 🌐 Frontend Pages & API Connections

| Page              | Route              | Auth Required | API Endpoints Used                              |
|-------------------|--------------------|:------------:|-------------------------------------------------|
| **Home**          | `/`                | ❌ No        | — (static)                                      |
| **Login**         | `/login`           | ❌ No        | `POST /api/auth/login`                          |
| **Register**      | `/register`        | ❌ No        | `POST /api/auth/register`                       |
| **Game Lobby**    | `/games`           | ✅ Yes       | `GET /api/games/modes`, `GET /api/games/sessions`, `POST /api/games/sessions`, `GET /api/questions/categories` |
| **Game Room**     | `/games/[id]`      | ✅ Yes       | WebSocket (`joinGame`, `submitAnswer`, `nextQuestion`, `gameEnded`) |
| **Leaderboard**   | `/leaderboard`     | ✅ Yes       | `GET /api/leaderboard/global`, `GET /api/leaderboard/organization/:id` |
| **Profile**       | `/profile`         | ✅ Yes       | `GET /api/auth/me`, `PATCH /api/users/:id`, `DELETE /api/users/:id` |
| **Admin**         | `/admin`           | ✅ Admin     | `GET /api/admin`, `GET /api/users`, `POST /api/games/modes`, `POST /api/questions/categories` |

---

## 🎮 Features

- **User Authentication** — Register/Login with JWT tokens
- **Game Modes** — Multiple quiz formats (Rapid Fire, Timed Challenges, etc.)
- **Game Sessions** — Create or join live game sessions
- **Real-time Gameplay** — Socket.IO powered quiz with timer, scoring, and answer validation
- **Leaderboards** — Global and organization-based rankings
- **Player Profiles** — Stats, achievements, score tracking
- **Admin Dashboard** — Manage game modes, categories, users
- **Payments (Paystack)** — Subscription and payment processing
- **Organizations** — Team-based gameplay and rankings
- **Swagger Docs** — Auto-generated API documentation

---

## 🛠️ Tech Stack

| Category       | Technology                               |
|----------------|------------------------------------------|
| **Runtime**    | Node.js, TypeScript                      |
| **API**        | NestJS 11                                |
| **Frontend**   | Next.js 16 + React 19 + Tailwind CSS 4   |
| **Database**   | PostgreSQL via Prisma ORM                |
| **Auth**       | JWT + Passport + bcrypt                  |
| **Real-time**  | Socket.IO (WebSocket + polling fallback) |
| **Validation** | class-validator + class-transformer      |
| **Payments**   | Paystack integration                     |
| **Docs**       | Swagger (OpenAPI)                        |

---

## 🔧 Useful Commands

```bash
# Development
npm run dev          # Run both API + Web
npm run dev:api      # Run API only
npm run dev:web      # Run Web only

# Database
npm run prisma:push -w @viekplay/api          # Push schema to DB
npm run prisma:generate -w @viekplay/api      # Generate Prisma client

# Build
npm run build -w @viekplay/web                # Build frontend
npm run build -w @viekplay/api                # Build API
```

---

*Built with ❤️ by Kenny for Viek Technologies*