# Job Application Tracking System

A full-stack web application to manage job postings, applicants, applications, and interviews — built with React, Node.js, PostgreSQL, and Auth0.

## Live Demo

| Service | URL |
|---|---|
| Frontend | https://job-application-tracking-system-kry.vercel.app |
| Backend API | https://job-application-tracking-system-gamma.vercel.app |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + TypeScript |
| Backend | Node.js + Express 5 |
| Database | PostgreSQL (via Prisma 6 ORM) |
| Authentication | Auth0 (Single Page Application + JWT) |
| Validation | Zod (backend input validation) |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Deployment | Vercel (frontend + backend) |

---

## Project Structure

```
JobApplication-Tracking-System/
├── .github/
│   └── workflows/
│       └── deploy.yml       # CI pipeline (test + build on every push)
├── backend/
│   ├── config/              # Prisma client setup
│   ├── controllers/         # Business logic for each resource
│   ├── middleware/
│   │   ├── auth.js          # Auth0 JWT validation
│   │   └── validate.js      # Zod validation middleware
│   ├── prisma/
│   │   ├── schema.prisma    # Database models
│   │   ├── migrations/      # SQL migration history
│   │   └── seed.js          # Sample data seeder
│   ├── routes/              # API route definitions
│   ├── schemas/             # Zod input schemas
│   ├── index.js             # Server entry point
│   ├── Dockerfile           # Backend container
│   └── .env.example         # Environment variable template
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios client with Auth0 token injection
│   │   ├── components/      # Navbar
│   │   ├── pages/           # Dashboard, Jobs, Applicants, Applications, Interviews
│   │   └── styles/          # Split CSS files per component
│   ├── Dockerfile           # Multi-stage build (Node → nginx)
│   └── vercel.json          # React Router rewrites for Vercel
├── compose.yml              # Docker Compose orchestration
└── README.md
```

---

## API Endpoints

All routes except `/api/health` require a valid **Auth0 Bearer token** in the `Authorization` header.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check — no auth required |
| GET / POST | `/api/jobs` | List all / Create job |
| GET / PUT / DELETE | `/api/jobs/:id` | Get, update, delete job |
| GET / POST | `/api/applicants` | List all / Create applicant |
| GET / PUT / DELETE | `/api/applicants/:id` | Get, update, delete applicant |
| GET / POST | `/api/applications` | List all / Create application |
| GET / PUT / DELETE | `/api/applications/:id` | Get, update, delete application |
| GET / POST | `/api/interviews` | List all / Schedule interview |
| GET / PUT / DELETE | `/api/interviews/:id` | Get, update, delete interview |
| GET / POST | `/api/hiring-managers` | List all / Create hiring manager |
| GET / PUT / DELETE | `/api/hiring-managers/:id` | Get, update, delete hiring manager |

---

## Run Locally

### Prerequisites
- Node.js 20+
- Docker Desktop
- Auth0 account

### 1. Clone the repository
```bash
git clone https://github.com/your-username/JobApplication-Tracking-System.git
cd JobApplication-Tracking-System
```

### 2. Set up backend environment
```bash
cd backend
cp .env.example .env
```
Fill in your values:
```
DATABASE_URL=postgresql://...
AUTH0_AUDIENCE=https://your-api-identifier
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
FRONTEND_URL=http://localhost:5173
PORT=5001
```

### 3. Set up frontend environment
Create `frontend/.env`:
```
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://your-api-identifier
VITE_API_URL=http://localhost:5001
```

### 4. Install dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 5. Run database migration and seed
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

### 6. Start the servers
```bash
# Backend (port 5001)
cd backend && npm run dev

# Frontend (port 5173)
cd frontend && npm run dev
```

---

## Run with Docker

```bash
docker compose up --build
```

This starts three containers:
- **Backend** → http://localhost:5001
- **Frontend** → http://localhost:5173 (served by nginx)
- **PostgreSQL** → port 5432

```bash
# Stop containers
docker compose down

# Reset database volume
docker compose down -v
```

---

## Docker & Container Optimisation

### Frontend — Multi-Stage Build
The frontend Dockerfile uses two stages to keep the final image small:

```dockerfile
# Stage 1: Node.js builds the React app
FROM node:20-alpine AS builder
RUN npm run build

# Stage 2: nginx serves only the built files
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

**Why this matters:** The final image contains only nginx + static HTML/CSS/JS files. Node.js, source code, and `node_modules` are not included — making the image significantly smaller and safer.

### Backend Optimisation
- Uses `node:20-alpine` (minimal Linux base, ~5MB vs ~900MB for full Ubuntu)
- Uses `npm ci` instead of `npm install` — faster, reproducible installs using `package-lock.json` exactly
- `.dockerignore` excludes `node_modules`, `.env`, and `dist` from being copied into the image

---

## CI/CD Pipeline

Every push or pull request to `main` triggers two parallel GitHub Actions jobs:

```
Push to main
    ├── test-backend   → npm ci → vitest run (26 tests)
    └── build-frontend → npm ci → npm run build
```

- If tests fail, the pipeline fails and the code is blocked
- Vercel is connected to GitHub and **auto-deploys on every push to main** — no manual steps needed
- Frontend environment variables are passed as GitHub Secrets during the build step so Auth0 values are baked into the production bundle

---

## Tests

```bash
cd backend && npm test
```

**26 tests across 5 files:**

| File | Type | What it tests |
|---|---|---|
| `health.test.js` | Integration | Server responds 200, CORS headers present |
| `job.test.js` | Unit | Job controller — get, create, update, delete, error cases |
| `applicant.test.js` | Unit | Applicant controller — all CRUD operations |
| `jobs.integration.test.js` | Integration | Full HTTP request/response via Supertest |
| `applicants.integration.test.js` | Integration | Full HTTP request/response via Supertest |

---

## Security

### 1. Secrets never in code
All sensitive values (`DATABASE_URL`, `AUTH0_AUDIENCE`, client IDs) are stored in `.env` files locally and as environment variables on Vercel. `.env` is in `.gitignore`. A `.env.example` with placeholder values is committed so developers know what to configure.

### 2. JWT authentication on every route
Every API route (except `/api/health`) is protected by the `checkAuth` middleware which validates the Auth0 Bearer token on every request. Invalid or missing tokens receive a `401 Unauthorized` response immediately — no database query is made.

### 3. CORS locked to frontend URL only
```js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}))
```
CORS is restricted to the exact frontend URL — not `*`. This means only requests from the known frontend domain are accepted. Any other origin (e.g. a malicious site) is blocked by the browser.

### 4. No localStorage for tokens
Auth0's React SDK (`@auth0/auth0-react`) stores tokens **in memory only**, not in `localStorage` or `sessionStorage`.

**Why localStorage is avoided:** localStorage is accessible by any JavaScript running on the page. If the app had an XSS vulnerability, an attacker could read the token and impersonate the user. In-memory storage is cleared when the tab closes and cannot be accessed by injected scripts.

### 5. Input validation with Zod
Applicant routes use Zod schemas to validate request bodies before they reach the database. Invalid input (bad email format, missing required fields) returns a `400` with clear error messages — no raw database errors are exposed to the client.

### 6. Docker image does not contain secrets
`.dockerignore` excludes `.env` files from being copied into the Docker image. Secrets are passed at runtime via `env_file` in Docker Compose or as environment variables on Vercel.

### 7. HTTPS in production
Vercel enforces HTTPS automatically. All traffic between the browser, frontend, and backend is encrypted in transit.

---

## Reflections & Trade-offs

### 1. Why did you choose this deployment platform? What were the alternatives you considered?

We chose **Vercel** for both the frontend and backend because it connects directly to GitHub and deploys automatically on every push — no manual steps needed. Vercel provides a global CDN, automatic HTTPS, and a generous free tier, making it well suited for a course project. The backend runs as a serverless Node.js function on Vercel using `@vercel/node`.

**Alternatives considered:**
- **Railway** — can host both frontend and backend in one place, which simplifies setup, but gives less control over frontend performance optimisation.
- **Netlify** — similar to Vercel for static frontends but Vercel has better native support for React and Vite projects and also supports backend deployments.

---

### 2. What challenges did you face with Docker? How did you solve them?

The main challenge was configuring the frontend Dockerfile for production. The initial version used `npm run dev` which is only for development. We switched to a **multi-stage build** — Node.js builds the app, then nginx serves the output. This made the image smaller and production-ready.

We also added `.dockerignore` files to exclude `node_modules` and `.env` from Docker images, keeping them clean and secure.

---

### 3. How did you handle environment variables and secrets in production vs locally?

| Environment | How secrets are stored |
|---|---|
| Local development | `.env` file (listed in `.gitignore`, never committed) |
| GitHub Actions | GitHub repository Secrets (Settings → Secrets → Actions) |
| Vercel | Environment Variables set in the Vercel dashboard |

A `.env.example` file with placeholder values is committed to the repository so any developer knows exactly what variables to configure without exposing real values. No secrets are ever hardcoded in the codebase.

---

### 4. What would you do differently if you had one more week?

- **Add update (PUT) functionality** on the frontend — currently users can only add and delete records, not edit them
- **Add end-to-end tests** using Playwright to test the full user flow in a real browser
- **Add rate limiting** on the backend API to prevent abuse and protect against brute force attacks
- **Improve error messages** — show specific Zod validation errors from the backend directly in the frontend form fields

---

### 5. How did you ensure that authentication still works after deployment?

After deploying, we updated the **Auth0 dashboard** to include the production Vercel URL alongside the local development URL in three places:

- **Allowed Callback URLs** — where Auth0 redirects after login
- **Allowed Logout URLs** — where Auth0 redirects after logout
- **Allowed Web Origins** — which origins are allowed to request tokens

Both localhost and the Vercel URL are listed so login works in both environments:
```
http://localhost:5173, https://job-application-tracking-system-kry.vercel.app
```

On the backend, `AUTH0_AUDIENCE` and `AUTH0_ISSUER_BASE_URL` are read from environment variables, so the same code validates tokens correctly in both local and production environments without any code changes.
