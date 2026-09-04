# ResumeIQ

**Build a resume that gets noticed.**

ResumeIQ is a full-stack, premium-feel resume analyzer. Upload a PDF resume, optionally paste
a job description, and get an ATS-style score, a section-by-section breakdown, job-match
percentage, keyword gaps, and prioritized recommendations — plus a downloadable PDF report.

Built as a portfolio-quality project: real authentication, a real (rule-based) scoring engine,
and a UI aimed at Linear/Notion/Stripe-level polish rather than a typical college CRUD app.

**MongoDB is not used anywhere in this project.**

---

## Screenshots

*(add screenshots of the landing page, dashboard, and results page here before publishing)*

---

## Features

- Landing page: hero, feature grid, how-it-works, ATS explainer, job-match demo, pricing, FAQ
- Auth: email/password sign up & sign in, Google OAuth, password reset, demo fallback mode
- Resume upload with drag-and-drop, PDF parsing (contact info, sections, skills, experience)
- Rule-based ATS scoring engine — transparent, weighted breakdown (no black box)
- Job description matching — match %, matching/missing keywords
- Prioritized recommendations (HIGH/MEDIUM/LOW) with explanations
- Downloadable PDF analysis report
- Standalone job matcher, resume template gallery, career tips
- Analysis history with search/sort/delete (local storage, or Supabase when configured)
- Full dark/light/system theme support, persisted across sessions
- Fully responsive, from 375px to desktop

## Tech stack

**Frontend:** React 18, Vite, React Router, Tailwind CSS, Framer Motion, Lucide icons, Supabase JS client
**Backend:** Node.js, Express, Multer (uploads), pdf-parse (or equivalent PDF text extraction)
**Auth & data:** Supabase (Auth + Postgres) — optional; a local/demo fallback keeps the app fully
usable without any Supabase project configured
**No MongoDB, Mongoose, or MongoDB Atlas anywhere in this stack.**

## Architecture

```
resumeiq/
├── client/                 React + Vite frontend
│   └── src/
│       ├── components/     Reusable UI (landing, auth, dashboard, analyze)
│       ├── pages/          Route-level views
│       ├── layouts/        DashboardLayout (sidebar + outlet)
│       ├── context/        AuthContext, ThemeContext
│       ├── services/       api.js — talks to the Express backend
│       └── lib/            supabaseClient.js, history.js (local history store)
│
├── server/                 Node + Express backend
│   ├── controllers/        Request handlers
│   ├── routes/             /api/* route definitions
│   ├── services/           atsEngine, jobMatcher, resumeParser, reportGenerator
│   └── utils/               skills.js — skill/keyword dictionaries
│
└── .env.example
```

Frontend and backend are separate npm workspaces so either can be deployed independently.

## Installation

```bash
npm run install:all
```

This installs dependencies for both `client/` and `server/`.

## Environment variables

Copy `.env.example` to `.env` in the project root (and/or `server/.env`, depending on your
deployment setup) and fill in what you need:

```env
PORT=5000
CLIENT_URL=http://localhost:5173

# Supabase — leave blank to run in local/demo fallback mode
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Client (Vite requires the VITE_ prefix)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_URL=/api
```

**Without Supabase configured**, the app runs in demo mode: sign up/sign in accept any
credentials and store a demo user + analysis history in the browser's local storage, so the
whole product remains fully previewable.

### Supabase setup (optional)

1. Create a project at [supabase.com](https://supabase.com).
2. Copy your Project URL and anon key into `SUPABASE_URL` / `SUPABASE_ANON_KEY` (server) and
   `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (client).
3. In Authentication settings, enable Email and (optionally) Google as a provider.
4. No custom tables are required for the app to function in its current state — resume
   history is stored client-side. Add a `history` table plus row-level security policies if
   you want to persist history server-side per user.

## Running locally

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health

The Vite dev server proxies `/api/*` to the Express backend, so the frontend never hardcodes
`localhost:5000` — this also means the same frontend code works unmodified in production
behind a reverse proxy or when `VITE_API_URL` is set.

## API reference

| Method | Path                | Description                                              |
|--------|---------------------|------------------------------------------------------------|
| GET    | `/api/health`       | Service health check                                      |
| POST   | `/api/parse-resume` | Upload a PDF (`resume` field), get parsed sections back    |
| POST   | `/api/analyze`      | Upload a PDF + optional `jobDescription`, get full analysis|
| POST   | `/api/job-match`    | JSON `{ resumeText, jobDescription }` → match score        |
| GET    | `/api/templates`    | List of resume template metadata                           |
| POST   | `/api/report`       | JSON analysis payload → streamed PDF report                |

All endpoints return JSON errors as `{ "error": "human-readable message" }` — the frontend
surfaces these directly instead of a generic "Failed to fetch."

## Troubleshooting

- **"Unable to connect to the ResumeIQ server"** — the backend isn't running; run `npm run dev`
  from the project root, or `npm run dev:server` on its own.
- **PDF fails to parse** — the PDF is likely image-only (scanned) rather than text-based;
  export your resume as a text-based PDF (most Word/Google Docs exports are fine).
- **CORS errors in the browser console** — check that `CLIENT_URL` in the server's `.env`
  matches the URL you're actually loading the frontend from.
- **Auth doesn't persist across refresh** — confirm both `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_ANON_KEY` are set; partially-configured Supabase falls back to demo mode.

## Deployment

### Option A — single service (recommended, simplest)

The Express server can serve the built React app itself, so the whole project deploys as
**one service** — no separate frontend host needed.

1. Push this repo to GitHub.
2. On [Render](https://render.com) (or Railway): New → Web Service → connect the repo.
3. **Root directory:** leave as the repo root (not `client` or `server`).
4. **Build command:** `npm run install:all && npm run build`
5. **Start command:** `npm start`
6. Add environment variables: `CLIENT_URL` (set it to the same URL Render gives this
   service, once deployed — needed so CORS allows same-origin requests), plus your
   `SUPABASE_*` variables if you're using Supabase.
7. Deploy. Render builds the React app into `client/dist`, and the server automatically
   serves it alongside the API on the same URL and port.

No `VITE_API_URL` is needed with this approach — the frontend calls `/api` on its own origin,
which is exactly where the server is listening.

### Option B — two services (Vercel + Render)

Split hosting, useful if you want the frontend on a CDN-backed static host separately from
the API.

- **Frontend** → Vercel. Root directory `client`, build command `npm run build`, output
  directory `dist`. Set `VITE_API_URL` to your deployed backend's URL + `/api`.
- **Backend** → Render or Railway. Root directory `server`. Set `PORT`, `CLIENT_URL` (your
  Vercel URL), and the `SUPABASE_*` variables.
- Add your production frontend URL to Supabase's allowed redirect URLs for OAuth, if used.

No URLs are hardcoded to `localhost` in the client — all API calls go through `/api`, resolved
via `VITE_API_URL` when set, or the current origin otherwise.

## Security notes

- Passwords are never stored in local storage or anywhere in the frontend — only Supabase
  session tokens (or a demo user object, in fallback mode) are persisted client-side.
- File uploads are validated for MIME type (PDF only) and size (8 MB max) both client- and
  server-side, and temp files are deleted from disk immediately after parsing.
- The API applies basic rate limiting (`express-rate-limit`) to `/api/*`.
- No third-party API keys or secrets are ever sent to or exposed in the frontend bundle.

## Future improvements

- Persist analysis history to Supabase (currently local-storage only)
- Real payment integration behind the pricing tiers (currently UI-only, as specified)
- Swap the rule-based recommendation engine for an LLM-backed one (architecture is ready —
  `atsEngine.js` is a drop-in replacement point)
- Server-side resume template rendering/export
- Account deletion flow wired to Supabase
