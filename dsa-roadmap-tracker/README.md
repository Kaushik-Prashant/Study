# 90-Day Study Roadmap Tracker

Angular app that tracks a 90-day study plan (DSA in C#, Python, SQL, AZ-900, AI-102, and
.NET deep-dive topics) day by day with checkboxes. Progress is saved in the browser's
`localStorage`, so it stays on the device you check items on.

## Roadmap data

All day/topic content lives in [`src/assets/roadmap-data.json`](src/assets/roadmap-data.json)
— a plain JSON array of 90 days, each with a list of `{ id, subject, topic, minutes }` items.
This file is what the app loads and displays.

To edit the plan itself (change topics, pacing, minutes), edit the source lists in
[`scripts/generate-roadmap.mjs`](scripts/generate-roadmap.mjs) and regenerate:

```bash
node scripts/generate-roadmap.mjs
```

Or edit `src/assets/roadmap-data.json` directly — it's plain JSON, no rebuild logic required,
just keep each day's `items[].id` unique.

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
3. Vercel auto-detects Angular; `vercel.json` in this repo already sets the build command
   (`npm run build`) and output directory (`dist/dsa-roadmap-tracker/browser`), so defaults work.
4. Deploy — you'll get a URL you can open on your phone and add to your home screen.

Or with the Vercel CLI, from this folder:

```bash
npx vercel
```
