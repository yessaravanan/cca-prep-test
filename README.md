# CCA Prep

A progressive web app (PWA) to track your 9-week study journey toward the **Claude Certified Architect (CCA)** exam.

🔗 **Live app:** https://cca-prep-sable.vercel.app

---

## What's inside

| Stage | Weeks | Focus |
|-------|-------|-------|
| Prerequisites | 1–3 | AI Fluency, Claude Power Use, API & RAG Basics |
| Phase 1 – Foundations | 4–5 | Agentic Loops, Multi-Agent Orchestration |
| Phase 2 – Applied Knowledge | 6–7 | Tool Design, MCP Integration, Prompt Engineering |
| Phase 3 – Exam Prep | 8–9 | Production Builds, Mock Exams |

**Features**
- Per-week task checklists with progress tracking
- Materials tab with links (free & paid resources clearly labelled)
- Key concepts per week
- Domain-based quiz (22 questions across 7 domains)
- Progress dashboard with streak tracking
- Onboarding + settings (exam date, name)
- PWA — installable on mobile, works offline
- Data export / import via JSON

---

## Tech stack

- React 19 + Vite 6
- Tailwind CSS v4
- react-router-dom v7
- vite-plugin-pwa (Workbox)
- localStorage for persistence
- Deployed on Vercel

---

## Local development

```bash
npm install --legacy-peer-deps
npm run dev
```

Open http://localhost:5173

## Build & deploy

```bash
npm run build
# then deploy dist/ to Vercel (see .vercel/project.json for project config)
```

---

## Project structure

```
src/
  lib/
    data.js          # All static data: weeks, domains, quiz questions
    storage.js       # localStorage helpers + export/import
    useProgress.js   # Progress computation hook
  pages/             # One file per route
  components/        # Layout, ProgressRing
```
