# Issue Tracker

A full-stack issue tracking app built with React, Express, and MongoDB. Organizes issues on a Kanban board with drag-and-drop across four columns (Open, In Progress, Resolved, Closed). Each user sees only their own issues.

**Live demo:** [issue-tracker-seven-sigma.vercel.app](https://issue-tracker-seven-sigma.vercel.app/)

---

## Features

**Issue management**
- Create issues with a title, description, priority (Low / Medium / High / Urgent), and severity (Low / Medium / High / Critical)
- Auto-generated sequential IDs (IS-0001, IS-0002, …) for easy reference
- Drag and drop cards across Kanban columns to change status (Open → In Progress → Resolved → Closed)
- Edit or delete any issue you own
- Filter issues by status and priority
- Visual badges with color-coded priority and severity indicators

**Authentication**
- Register and log in with email and password
- Passwords are hashed with bcrypt (12 rounds) — plain-text is never stored
- Sessions are maintained with JWT tokens stored in localStorage
- Protected routes redirect unauthenticated users to login automatically
- Automatic logout when a token expires or becomes invalid

**Technical highlights**
- Optimistic UI updates on drag-and-drop with automatic rollback on server error
- API rate limiting (100 requests per 15 minutes)
- Input validation with Zod on both the frontend and backend
- DiceBear-generated avatars tied to each user's email

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS, Radix UI, shadcn/ui |
| State | Zustand (with localStorage persistence) |
| Drag & Drop | @dnd-kit/core, @dnd-kit/sortable |
| HTTP | Axios |
| Backend | Express, TypeScript, Node.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT + bcrypt |
| Validation | Zod (shared pattern, FE & BE) |
| Package manager | pnpm workspaces (monorepo) |
| Deployment | Vercel |

---

## Dependencies

Make sure you have these installed before anything else:

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) — `npm install -g pnpm`
- A MongoDB instance — local or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/himansaE/issue-tracker.git
cd issue-tracker
pnpm install
```

`pnpm install` at the root handles all three packages (root, backend, frontend) in one go.

### 2. Backend environment

```bash
cp backend/.env.example backend/.env
```

Then open `backend/.env` and fill in your values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/issue-tracker
JWT_SECRET=replace_with_something_long_and_random
JWT_EXPIRES_IN=7d
```

`JWT_SECRET` needs to be at least 16 characters — the server won't start otherwise.

### 3. Frontend environment

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Run

You'll need two terminals:

```bash
# backend
cd backend
pnpm dev
```

```bash
# frontend
cd frontend
pnpm dev
```

App runs at `http://localhost:5173`. Vite proxies `/api` calls to the backend on port 5000.

---

## Usage

1. Open the app and create an account with your email and password.
2. You'll land on the dashboard — a Kanban board with four columns.
3. Hit **New Issue** to create one. Give it a title, description, priority, and severity.
4. Drag cards between columns to move them through the workflow.
5. Click a card to view details, edit fields, or delete it.
6. Use the filter controls at the top to narrow down by status or priority.

---

## Deployment

The repo includes a `vercel.json` so you can deploy both the frontend and backend from one project.

1. Push to GitHub and import the repo on [Vercel](https://vercel.com/).
2. Add these environment variables under **Settings → Environment Variables**:

   | Variable | Description |
   |---|---|
   | `MONGO_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | A long random secret |
   | `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
   | `NODE_ENV` | `production` |

3. Deploy. Vercel routes `/api/*` to the backend function and everything else to the React SPA.

> If you're using Atlas, whitelist `0.0.0.0/0` in **Network Access** so Vercel's IPs can reach your cluster.
