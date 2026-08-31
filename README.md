# Smart Todo

A full-stack todo application with a public landing page and an authenticated app
where each user manages their own todos, including **rich-text content** stored as
structured JSON. It's built as a portfolio project to demonstrate real full-stack
engineering: authentication, authorization/ownership, API design, validation,
MongoDB, a structured Next.js frontend, and a rich-text editor.

> Status: local development project. No public deployment URL, screenshots, or
> usage metrics are claimed here — everything described below maps to code in this
> repository.

## Key Features

- **Secure authentication** — register/login with JWT access tokens; passwords
  hashed with bcrypt.
- **Rich-text todo editor** — Tiptap editor supporting bold, italic, headings,
  bullet lists, ordered lists, task/checkbox lists, text color, and font weight.
- **Structured content** — todo notes are stored as **Tiptap JSON** (not HTML),
  validated on the backend against a controlled schema.
- **Full Todo CRUD** — create, read, edit, and delete.
- **Completion status** — mark todos complete/incomplete.
- **Filtering** — All / Active / Completed (done via the backend query).
- **Pagination** — database-level pagination with Previous/Next controls.
- **Per-user ownership** — every todo is scoped to the authenticated user.
- **Responsive UI** with a system-aware **light/dark theme**.

_Not implemented (intentionally out of scope): image upload, search,
collaboration, notifications, analytics, AI features._

## Tech Stack

**Frontend** — Next.js (App Router), TypeScript, Tailwind CSS, Tiptap, React Hook
Form, Zod, next-themes.

**Backend** — Node.js, Express.js, TypeScript, MongoDB, Mongoose, Zod, JWT,
bcrypt.

## Architecture Overview

The frontend and backend are independent apps. The frontend calls the backend over
HTTP through a single centralized API client (`frontend/src/lib/api-client.ts`).

```
Browser
  → Next.js frontend (React components & pages)
  → Central API client (src/lib/api-client.ts — attaches the JWT)
  → Express.js API (REST routes)
  → Auth middleware (verifies the JWT → req.user.id)
  → Zod validation (checks the request data)
  → MongoDB / Mongoose (owner-scoped queries)
```

### Authentication

Login returns a short-lived JWT access token (sent to the API as a
`Bearer` token) plus a longer-lived refresh token stored in an HttpOnly cookie on
the backend. The frontend uses simple access-token auth: it stores the access
token and attaches it to API requests; the auth state lives in a small React
context.

### Rich-text editor

Todo notes are edited with Tiptap and stored as a JSON document. A shared editor
configuration is reused by both the editor and the read-only preview. Because
Tiptap can emit `null` attributes that the strict backend schema rejects, the
frontend runs a small `cleanContent()` step before saving:

```
Tiptap editor → editor.getJSON() → cleanContent() → API client → Express → Zod → MongoDB
```

### Todo ownership

Ownership is always enforced on the **backend**. Every read/update/delete query is
scoped to `{ _id, userId }` using the ID from the verified token — the client never
sends or chooses an owner. Another user's todo returns `404`.

### Pagination / filtering / sorting

Listing is done at the database level (`skip`/`limit`, a `completed` filter, and a
whitelisted `sort`), and the API returns pagination metadata (`total`,
`totalPages`, `hasNextPage`, `hasPreviousPage`).

## API Overview (high level)

| Method | Route            | Purpose                                   |
| ------ | ---------------- | ----------------------------------------- |
| POST   | `/auth/register` | Create an account                         |
| POST   | `/auth/login`    | Log in, receive an access token           |
| POST   | `/auth/refresh`  | Rotate the refresh token                  |
| POST   | `/auth/logout`   | Invalidate the session                    |
| GET    | `/auth/me`       | Current user (protected)                  |
| GET    | `/todos`         | List own todos (page/limit/completed/sort)|
| POST   | `/todos`         | Create a todo                             |
| GET    | `/todos/:id`     | Get one of your todos                     |
| PATCH  | `/todos/:id`     | Update a todo (partial)                   |
| DELETE | `/todos/:id`     | Delete a todo                             |

All `/todos` routes and `/auth/me` require a valid access token.

## Project Structure

```
smart-todo/
├── frontend/                Next.js app (App Router)
│   └── src/
│       ├── app/             routes: /, /login, /register, /todos
│       ├── components/      ui/, shared/, home/ (landing sections)
│       ├── features/        auth/ and todos/ (api, components, schemas, types)
│       ├── lib/             api-client.ts, token.ts
│       └── providers/       theme + auth providers
├── backend/                 Express + TypeScript REST API
│   └── src/
│       ├── config/          env, db, cookie
│       ├── controllers/     auth, todo
│       ├── middleware/       requireAuth, errorHandler
│       ├── models/          user, todo, authSession
│       ├── routes/          auth, todo
│       └── schemas/         Zod schemas (auth, todo, richText)
└── README.md
```

## Running Locally

Run the two apps in separate terminals.

**Backend**

```bash
cd backend
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

The API starts on `http://localhost:5000`.

**Frontend**

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

The app starts on `http://localhost:3000`.

## Environment Variables

**Backend** (`backend/.env`)

| Variable      | Description                          |
| ------------- | ------------------------------------ |
| `PORT`        | API port (default 5000)              |
| `NODE_ENV`    | `development` / `production`         |
| `MONGODB_URI` | MongoDB connection string           |
| `JWT_SECRET`  | Secret used to sign access tokens    |

**Frontend** (`frontend/.env.local`)

| Variable              | Description                 |
| --------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API |

Real secrets live only in `.env` files, which are git-ignored. Only
`.env.example` templates are committed.

## Engineering Highlights

- JWT authentication with bcrypt-hashed passwords and env-based secrets.
- Zod validation at every API boundary.
- Centralized frontend API client; feature-based folder structure.
- Express middleware guarding protected routes.
- User-specific ownership enforced in the database query.
- Database-level pagination/filtering with a whitelisted sort field and an index
  on the todo owner.
- Tiptap JSON as the single source of truth for rich text, with one shared editor
  configuration reused by the editor and preview.
- Strict TypeScript across the whole project.

## Current Scope / Limitations

- No image upload or image nodes (intentionally removed from scope).
- No search, collaboration, notifications, or analytics.
- Simple access-token auth on the frontend (no automatic refresh flow yet).
- Local development only; no deployment is configured in this repo.
