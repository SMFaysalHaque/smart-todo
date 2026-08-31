# Smart Todo — Full-Stack Rich-Text Task Manager

A production-style todo application: a public landing page plus an authenticated
app where each user manages their own todos. Todo notes are written in a
**rich-text editor** and stored as structured JSON (not HTML), validated on the
server. Built to demonstrate real full-stack engineering — authentication,
per-user authorization, API design, schema validation, and a clean, typed
frontend architecture.

**Live backend API:** https://smart-todo-2o4n.onrender.com (health check at
`/health`)
**Frontend:** Next.js app deployed on Vercel (configure `NEXT_PUBLIC_API_URL` to
point at the API).

---

## Features

- **Authentication** — email/password register and login with JWT access tokens;
  passwords hashed with bcrypt.
- **Rich-text notes** — Tiptap editor: bold, italic, headings, bullet lists,
  ordered lists, task/checkbox lists, text color, and font weight.
- **Structured storage** — note content is stored as Tiptap JSON and validated on
  the backend against a controlled node/mark allow-list.
- **Full CRUD** — create, read, edit, and delete todos.
- **Completion** — mark todos complete/incomplete; completing a todo ticks its
  checklists and renders the note as "done".
- **Filtering** — All / Active / Completed, resolved by the backend query.
- **Pagination** — database-level pagination with Previous/Next controls.
- **Per-user ownership** — a user can only ever see and modify their own todos.
- **Responsive UI** with a system-aware light/dark theme.

### Scope

The feature set is intentionally focused. There is **no** image upload, search,
collaboration, notifications, or analytics — each was deliberately left out to
keep the surface small and every line of code meaningful.

---

## Tech Stack

**Frontend**

| Concern         | Choice                                  |
| --------------- | --------------------------------------- |
| Framework       | Next.js (App Router)                    |
| Language        | TypeScript (strict)                     |
| Styling         | Tailwind CSS                            |
| Rich-text       | Tiptap v2 (ProseMirror)                 |
| Forms & schema  | React Hook Form + Zod                   |
| Theme           | next-themes (light / dark / system)     |
| HTTP            | Native `fetch`, one centralized client  |

**Backend**

| Concern         | Choice                                  |
| --------------- | --------------------------------------- |
| Runtime         | Node.js                                 |
| Framework       | Express.js                              |
| Language        | TypeScript (strict)                     |
| Database        | MongoDB + Mongoose                      |
| Validation      | Zod (at every request boundary)         |
| Auth            | JWT (jsonwebtoken) + bcrypt (bcryptjs)  |
| Sessions        | Opaque refresh tokens, SHA-256 hashed   |

### Why these choices

- **Tiptap + JSON, not HTML.** Storing structured JSON keeps content easy to
  validate and safe to render, and avoids storing arbitrary HTML. The backend only
  accepts a small, explicit set of nodes and marks.
- **Zod on both sides.** The same validation philosophy runs on the client (form
  UX) and the server (trust boundary). The server never trusts client input.
- **One API client.** All HTTP lives in `frontend/src/lib/api-client.ts` — typed
  helpers, automatic `Bearer` injection, and normalized errors — so no component
  ever calls `fetch` directly.
- **Feature-based frontend.** Code is grouped by feature (`auth`, `todos`) rather
  than by file type, so a feature is easy to find and change in one place.

---

## Getting Started

**Prerequisites:** Node.js 18+ and a MongoDB connection string (local or Atlas).

Run the two apps in separate terminals.

**Backend**

```bash
cd backend
npm install
cp .env.example .env      # fill in the values below
npm run dev               # http://localhost:5000
```

`backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/smart-todo
JWT_SECRET=<a-long-random-secret>
```

**Frontend**

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev               # http://localhost:3000
```

`frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Secrets live only in `.env` / `.env.local` (git-ignored). Only `.env.example`
templates are committed. In production, set `NEXT_PUBLIC_API_URL` in the Vercel
dashboard to the deployed API URL.

---

## Architecture

The frontend and backend are independent apps that communicate over HTTP. A single
request flows through clearly separated layers:

```
Browser
  → Next.js frontend (React components & pages)
  → API client        (src/lib/api-client.ts — attaches the JWT, normalizes errors)
  → Express routes    (/auth, /todos)
  → Auth middleware   (verifies the JWT → req.user.id)
  → Zod validation    (checks the request body / query)
  → Controller        (owner-scoped logic)
  → MongoDB / Mongoose
```

**Project layout**

```
smart-todo/
├── frontend/                         Next.js app (App Router)
│   └── src/
│       ├── app/                      routes: /, /login, /register, /todos
│       ├── components/               ui/, shared/ (navbar), home/ (landing)
│       ├── features/
│       │   ├── auth/                 api, components, schemas, types
│       │   └── todos/                api, components, editor config, utils, types
│       ├── lib/                      api-client.ts, token.ts
│       └── providers/                theme + auth (React context)
└── backend/                          Express + TypeScript REST API
    └── src/
        ├── config/                   env, db, cookie
        ├── controllers/              auth, todo
        ├── middleware/               requireAuth, errorHandler
        ├── models/                   user, todo, authSession
        ├── routes/                   auth, todo
        └── schemas/                  Zod schemas (auth, todo, richText)
```

**Authentication.** Login verifies the password with `bcrypt.compare`, returns a
short-lived (15 min) JWT access token in the response body, and sets a longer-lived
(7 day) **opaque** refresh token in an HttpOnly, SameSite=Strict, `Path=/auth`
cookie. Only the SHA-256 hash of the refresh token is stored; refresh rotates the
token and detects reuse of a rotated token. The frontend uses simple access-token
auth — it stores the access token and sends it as a `Bearer` header; auth state
lives in a small React context.

**Ownership.** Every todo read/update/delete query is scoped to
`{ _id, userId }` using the id from the verified token — the client never sends or
chooses an owner. Another user's todo returns `404` (not `403`) so the API never
reveals that a given id exists.

**Rich text.** Notes are edited with Tiptap and saved as a JSON document; a shared
editor configuration is reused by both the editor and the read-only preview.
Because Tiptap can emit `null` attributes that the strict backend schema rejects,
the frontend runs a small `cleanContent()` step before saving:

```
Tiptap editor → editor.getJSON() → cleanContent() → API client → Express → Zod → MongoDB
```

**Pagination / filtering / sorting.** Listing is done in the database
(`skip`/`limit`, an optional `completed` filter, and a whitelisted `sort`), and the
API returns pagination metadata alongside the page of results.

---

## API Reference

Base URL: `http://localhost:5000` (local) or the deployed API URL. All `/todos`
routes and `GET /auth/me` require an `Authorization: Bearer <accessToken>` header.

### Auth

**`POST /auth/register`**

```json
// request
{ "email": "user@example.com", "password": "at-least-8-chars" }
// 201
{ "id": "665f...", "email": "user@example.com" }
```

**`POST /auth/login`**

```json
// request
{ "email": "user@example.com", "password": "at-least-8-chars" }
// 200 (also sets an HttpOnly refreshToken cookie)
{ "accessToken": "<jwt>", "user": { "id": "665f...", "email": "user@example.com" } }
```

**`POST /auth/refresh`** — rotates the refresh cookie, returns a fresh access token.
**`POST /auth/logout`** — invalidates the session and clears the cookie.
**`GET /auth/me`** — returns `{ "user": { "id", "email" } }` for the current user.

### Todos

**`GET /todos`** — query: `page`, `limit` (max 50), `completed` (`true|false`),
`sort` (`createdAt|-createdAt`).

```json
// 200
{
  "data": [
    {
      "id": "6661...",
      "userId": "665f...",
      "title": "Read the docs",
      "content": { "type": "doc", "content": [ /* ... */ ] },
      "completed": false,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1, "limit": 10, "total": 1, "totalPages": 1,
    "hasNextPage": false, "hasPreviousPage": false
  }
}
```

**`POST /todos`**

```json
// request (content optional; defaults to an empty document)
{ "title": "Read the docs", "content": { "type": "doc", "content": [] } }
// 201
{ "todo": { "id": "6661...", "title": "Read the docs", "completed": false, /* ... */ } }
```

**`GET /todos/:id`** — `{ "todo": { ... } }`, or `404` if not yours.
**`PATCH /todos/:id`** — partial update, e.g. `{ "completed": true }` or
`{ "title": "...", "content": { ... } }`. Returns the updated todo.
**`DELETE /todos/:id`** — `204 No Content`, or `404` if not yours.

Validation failures return `400` with a list of field errors; a missing/invalid
token returns `401`.

---

## Quirks & Gotchas

Real issues encountered while building this, and how they're handled:

1. **Tiptap emits `null` attributes.** `editor.getJSON()` can produce
   `color: null`, `fontWeight: null`, or an ordered list `type: null`. The backend
   schema is strict and rejects these, so `cleanContent()` drops null/undefined
   attributes before every save. (Verified: raw output → `400`, cleaned → `201`.)
2. **`data-checked` vs strikethrough.** A checked Tiptap task item renders as
   `<li data-checked="true">`, but a plain bullet/ordered list item has no such
   attribute. Completing a todo therefore strikes out the *whole* note (via a
   `.preview-completed` class) so lists without checkboxes still read as done.
3. **Cross-origin refresh cookies.** The backend sets an HttpOnly, `Path=/auth`
   refresh cookie, but the frontend runs on a different origin (Vercel vs Render)
   and does not rely on it. The frontend uses simple access-token auth; a full
   cookie-based refresh flow is deferred.
4. **Base-URL trailing slashes.** `NEXT_PUBLIC_API_URL` may end in `/`. The API
   client strips trailing slashes so a path like `/todos` never becomes
   `//todos`, and never falls back to `localhost` in production.
5. **404, not 403, for other users' todos.** Returning `403` would confirm an id
   exists. Owner-scoped queries return `404` for both "missing" and "not yours".
6. **Whitelisted sort.** Only `createdAt` / `-createdAt` are accepted, so the
   client can't sort by arbitrary internal fields.

---

## Design Decisions & Trade-offs

- **Simplicity over cleverness.** Small components, obvious data flow, plain
  `useState`/`useEffect`, and a re-fetch after each mutation instead of a
  data-fetching library — the code is meant to be read and modified easily.
- **Access token in `localStorage`.** Convenient and works cross-origin, but less
  XSS-hardened than an HttpOnly cookie. Acceptable for this project's scope; see
  below.
- **Images removed from scope.** Image upload/storage was intentionally cut to
  avoid the added complexity (storage, sanitization) without enough value here.

### What I'd improve with more time

- Move the frontend to a cookie-based session with automatic token refresh.
- Add automated tests (unit + a few end-to-end flows).
- Add search and tags for todos.
- Server-render the authenticated area behind a proper session.

---

## Status

Backend deployed on Render; frontend deploys to Vercel. This is a portfolio
project — no fabricated metrics, screenshots, or third-party integrations are
claimed; everything documented here maps to code in this repository.
