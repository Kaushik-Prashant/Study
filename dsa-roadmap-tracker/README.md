# 100-Day Learning Command Center

Angular app tracking a 100-day study plan (DSA in C#, Python, SQL, AZ-900, AI-200,
Agentic AI & MCP, and .NET/Docker/Kubernetes/DevOps deep-dive topics). Progress is
saved in the browser's `localStorage`, so it stays on the device you check items on.

## Current Study Day (not calendar-based)

There is no date logic anywhere. `ProgressService.currentDay` starts at 1 and only
advances once **every** task scheduled for that day is checked off — completing
Day 1 moves you to Day 2, and so on, up to Day 100. All 100 days stay visible and
clickable at all times (no lock/unlock); only the "Current" highlight moves.
Un-checking a task never moves the current day backward.

## Pages

- **Dashboard** (`/`) — overall %, Current Study Day's tasks, streak, hours, certification progress, weekly chart, next milestone.
- **Roadmap** (`/roadmap`) — the 100 days grouped into 17 weeks, each week with an objective/outcome/practice/interview-prep/revision summary. The current day is marked "CURRENT", already-finished days "COMPLETED".
- **Topic Library** (`/topics`) — the same content grouped by subject instead of by day (Azure, Agentic AI & MCP, Python, .NET, DSA, SQL, Docker, Kubernetes, DevOps).
- **Topic Detail** (`/topics/:categoryId/:topicId`) — checklist, prerequisites, practice items, interview questions, resources, notes, Mark Complete.
- **Revision** (`/revision`) — built-in DSA revision checkpoints, topics due for a 7-day refresh, completed topics, and interview questions to revisit.
- **Milestones** (`/milestones`) — auto-computed from topic completion (nothing to update by hand).
- **Search** — `Ctrl/Cmd+K` from anywhere, searches topics and weeks.

## Data model — single source of truth

All content lives in `src/assets/learning-data.json`: a **flat** array of
`LearningItem` records (`{ id, day, week, categoryId, topicId, title, minutes, ... }`).

- The **Roadmap** page groups these by `day`.
- The **Topic Library** groups the exact same records by `categoryId` → `topicId`.
- Progress is a single `Record<itemId, boolean>` in `localStorage`
  (`ProgressService`), read and written by every page. Checking an item
  anywhere updates it everywhere — there's no separate progress state to
  keep in sync.

To edit the plan (topics, pacing, minutes, categories), edit the source
lists in `scripts/generate-data.mjs` and regenerate:

```bash
node scripts/generate-data.mjs
```

Or edit `src/assets/learning-data.json` directly — just keep each item's
`id` unique.

## Development server

```bash
npm install
ng serve
```

Navigate to `http://localhost:4200/`. Reloads automatically on file changes.

## Build

```bash
ng build
```

Output goes to `dist/dsa-roadmap-tracker/browser`.

## Deploy to Vercel (free)

1. Push this folder to a GitHub repo.
2. Go to [vercel.com](https://vercel.com) → New Project → import the repo.
3. Set **Root Directory** to `dsa-roadmap-tracker` if the repo root isn't the app itself.
4. `vercel.json` already sets the build command (`npm run build`) and output
   directory (`dist/dsa-roadmap-tracker/browser`), so defaults otherwise work.

Or with the Vercel CLI, from this folder: `npx vercel`
