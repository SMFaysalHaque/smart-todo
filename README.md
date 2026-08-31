# Smart Todo

A full-stack todo application with a public landing page and an authenticated app
where each user manages their own todos, including rich-text content and per-user
history. The project is built incrementally, one milestone at a time. The current
state is the project foundation: the frontend and backend are set up and run, with
features to follow.

## Tech Stack

**Frontend** — Next.js (App Router), TypeScript, Tailwind CSS, React Hook Form,
Zod, Tiptap (rich-text editor), next-themes (light/dark).

**Backend** — Express.js, TypeScript, MongoDB, Zod.

## Project Structure

```
smart-todo/
├── frontend/     Next.js app (UI, landing page, authenticated todo app)
├── backend/      Express + TypeScript REST API
└── README.md
```

The frontend and backend are independent apps. The frontend renders the UI and
calls the backend over HTTP using the native `fetch` API (through a single
`src/lib/api-client.ts`), so each app can be developed, run, and deployed on its
own.

The frontend currently implements: register/login with JWT access tokens, a
client-protected todo area, and full per-user todo management — create, list,
edit, mark complete/incomplete, and delete — with backend-driven filtering (all /
active / completed) and pagination. Todo notes use a Tiptap rich-text editor
(headings, bold, italic, text color, font weight, bullet/ordered lists, and
task-list checkboxes); the editor's structured JSON is saved to and rendered from
the backend. A light/dark theme toggle is available in the navbar.

## Running Locally

Run the two apps in separate terminals.

**Backend**
```bash
cd backend
npm install
cp .env.example .env
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

## Roadmap

1. Project foundation
2. Database connection & data models (MongoDB)
3. Authentication
4. Todo CRUD + validation
5. Rich-text editor & per-user history
6. Landing page & UI polish
7. Deployment
