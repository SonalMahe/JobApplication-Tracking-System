# Job Application Tracking System

A full-stack web application to track job applications, applicants, interviews, and hiring managers.

## Live Demo

| Service | URL |
|---|---|
| Frontend | _coming soon_ |
| Backend API | _coming soon_ |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TypeScript |
| Backend | Node.js + Express |
| Database | PostgreSQL (Prisma ORM) |
| Authentication | Auth0 |
| Containerization | Docker + Docker Compose |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
JobApplication-Tracking-System/
├── backend/
│   ├── config/          # Prisma client
│   ├── controllers/     # Business logic (CRUD)
│   ├── middleware/       # Auth0 JWT validation
│   ├── prisma/          # Schema + migrations + seed
│   ├── routes/          # API endpoints
│   ├── index.js         # Server entry point
│   └── .env.example     # Environment variable template
├── frontend/
│   └── src/             # React components
├── compose.yml          # Docker Compose config
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET/POST | `/api/jobs` | Get all / Create job |
| GET/PUT/DELETE | `/api/jobs/:id` | Get, update, delete job |
| GET/POST | `/api/applicants` | Get all / Create applicant |
| GET/PUT/DELETE | `/api/applicants/:id` | Get, update, delete applicant |
| GET/POST | `/api/applications` | Get all / Create application |
| GET/PUT/DELETE | `/api/applications/:id` | Get, update, delete application |
| GET/POST | `/api/interviews` | Get all / Create interview |
| GET/PUT/DELETE | `/api/interviews/:id` | Get, update, delete interview |
| GET/POST | `/api/hiring-managers` | Get all / Create manager |
| GET/PUT/DELETE | `/api/hiring-managers/:id` | Get, update, delete manager |

All routes except `/api/health` require a valid Auth0 JWT token.

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
Fill in your values in `.env`:
```
DATABASE_URL=postgresql://...
AUTH0_AUDIENCE=https://your-api-identifier
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
FRONTEND_URL=http://localhost:5173
```

### 3. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Run database migration and seed
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

### 5. Start the servers
```bash
# Backend (port 5000)
cd backend
npm run dev

# Frontend (port 5173)
cd frontend
npm run dev
```

---

## Run with Docker

### Build and start all services
```bash
docker compose up --build
```

This starts:
- **Backend** → http://localhost:5000
- **Frontend** → http://localhost:5173
- **PostgreSQL** → port 5432

### Stop containers
```bash
docker compose down
```

### Reset database
```bash
docker compose down -v
```

---

## Security Checklist

| # | Check | Status |
|---|---|---|
| 1 | No secrets committed — all in `.env` or GitHub Secrets | ✅ |
| 2 | CORS restricted to frontend URL only (not `*`) | ✅ |
| 3 | Tokens not stored in localStorage | ✅ |
| 4 | `credentials: true` set on all authenticated requests | ✅ |
| 5 | Docker image does not contain `.env` or `node_modules` | ✅ |
| 6 | Deployed backend uses HTTPS (provided by Render) | ✅ |
| 7 | Auth0 callbacks use deployed URL, not localhost | ✅ |

---

## Reflections

**1. Why did you choose Vercel + Render?**
Vercel is the best platform for deploying React/Vite frontends — zero config, instant deploys from GitHub. Render was chosen for the backend because it supports Docker containers and has a free managed PostgreSQL database. Together they cover the full stack with generous free tiers.

**2. What challenges did you face with Docker?**
The main challenge was that Prisma 7 had breaking changes that removed the `url` field from `schema.prisma`. We solved this by downgrading to Prisma 6 which uses the standard configuration. We also had to ensure the frontend Vite server was accessible inside Docker by passing the `--host` flag.

**3. How did you handle environment variables and secrets?**
Locally we use a `.env` file which is listed in `.gitignore` so it is never committed. A `.env.example` file with placeholder values is committed so other developers know what to configure. In production, all secrets are set as environment variables directly in the Render and Vercel dashboards, never hardcoded in the code.

**4. What would you do differently with one more week?**
We would add more comprehensive tests including integration tests that run against the deployed API, set up automated deployment via GitHub Actions so every push to main deploys automatically, and add input validation on all API routes.

**5. How did you ensure authentication works after deployment?**
We updated the Auth0 dashboard to include the deployed frontend URL in the Allowed Callback URLs, Allowed Logout URLs, and Allowed Web Origins. The backend reads `AUTH0_AUDIENCE` and `AUTH0_ISSUER_BASE_URL` from environment variables, so the same code works in both local and production environments.
