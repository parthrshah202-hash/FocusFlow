# Instructions for Antigravity — FocusFlow Hackathon

> Read this entire file before writing a single line of code.  
> This is a team project with 3 members working in parallel.  
> Your output will be integrated with code written by other members.  
> Integration issues cost time we do not have. Follow this plan exactly.

---

## Your Role in This Project

You are assisting one member of a 3-person hackathon team building **FocusFlow** — an AI-powered Pomodoro productivity timer. Each member is building a different part of the app. Your job is to build **only the components assigned to the member you are working with**, following the shared plan precisely.

Do not deviate from this plan unless the user explicitly says:
> *"Deviate from the plan"* or *"Ignore the plan for this"*

If the user asks for something that contradicts the plan, point out the conflict and ask for confirmation before proceeding.

---

## Project Overview

**FocusFlow** is a web app where users:
1. Enter their tasks (name, deadline, estimated Pomodoros, priority)
2. Select their energy level for the day
3. Receive an AI-generated session plan (via Gemini 2.0 Flash)
4. Run a Pomodoro timer through their tasks
5. Get an AI end-of-day reflection summary

**Tech Stack:**
- Frontend: React (Vite) + Tailwind CSS + Axios
- Backend: FastAPI (Python)
- AI: Gemini 2.0 Flash API
- Storage: localStorage only (no database)

---

## Absolute Rules — Never Violate These

### File Names
Use ONLY the file names listed below. Do not create new files without asking the user first.

```
frontend/src/components/TaskInput.jsx
frontend/src/components/TaskQueue.jsx
frontend/src/components/Timer.jsx
frontend/src/components/EnergyCheckIn.jsx
frontend/src/components/SessionSummary.jsx
frontend/src/context/AppContext.jsx
frontend/src/api/client.js
frontend/src/utils/storage.js
frontend/src/hooks/useTimer.js
frontend/src/App.jsx
frontend/src/main.jsx
backend/main.py
backend/routes/plan.py
backend/routes/summary.py
backend/services/gemini.py
backend/models/schemas.py
backend/.env
```

### Data Contracts — Do Not Change Field Names

**Task object shape:**
```json
{
  "id": "string (uuid)",
  "name": "string",
  "deadline": "string (YYYY-MM-DD)",
  "estimatedPomodoros": "number",
  "priority": "high | medium | low",
  "completedPomodoros": "number",
  "status": "pending | in-progress | done"
}
```

**POST /api/plan Request:**
```json
{
  "tasks": [],
  "energyLevel": "high | medium | low",
  "availableMinutes": "number"
}
```

**POST /api/plan Response:**
```json
{
  "orderedTasks": [],
  "reasoning": "string",
  "totalPomodoros": "number"
}
```

**POST /api/summary Request:**
```json
{
  "completedSessions": [
    {
      "taskId": "string",
      "taskName": "string",
      "estimatedPomodoros": "number",
      "actualPomodoros": "number",
      "reflections": ["string"]
    }
  ]
}
```

**POST /api/summary Response:**
```json
{
  "summary": "string",
  "insights": ["string", "string", "string"]
}
```

### API Endpoints — Do Not Change Routes

| Method | Route | File |
|---|---|---|
| GET | `/` | `backend/main.py` |
| POST | `/api/plan` | `backend/routes/plan.py` |
| POST | `/api/summary` | `backend/routes/summary.py` |

Backend runs on: `http://localhost:8000`  
Frontend runs on: `http://localhost:5173`

### localStorage Keys — Use Exactly These

| Key | Type |
|---|---|
| `ff_tasks` | `Task[]` |
| `ff_plan` | `PlanResponse` |
| `ff_active_task_id` | `string` |
| `ff_session_log` | `SessionLog[]` |
| `ff_energy` | `string` |

### AppContext Fields — Do Not Rename

```js
{
  tasks, setTasks,
  plan, setPlan,
  activeTaskId, setActiveTaskId,
  sessionLog, addToSessionLog,
  energyLevel, setEnergyLevel,
  currentView, setCurrentView   // "input" | "checkin" | "timer" | "summary"
}
```

### View Names — Use Exactly These Strings

```
"input"    → TaskInput screen
"checkin"  → EnergyCheckIn screen
"timer"    → Timer + TaskQueue screen
"summary"  → SessionSummary screen
```

All view transitions happen via `setCurrentView(...)` from AppContext. This is controlled by `App.jsx` only.

---

## API Calls Rule

**All API calls must go through `frontend/src/api/client.js`.**  
Components must never call `fetch` or `axios` directly.  
Components either import from `client.js` or receive handlers via AppContext.

---

## What Each Member Builds

### Member A (Parth) — Backend + AppContext + API client + Integration
- `backend/main.py`, `backend/routes/plan.py`, `backend/routes/summary.py`
- `backend/services/gemini.py`, `backend/models/schemas.py`
- `frontend/src/context/AppContext.jsx`
- `frontend/src/api/client.js`
- `frontend/src/utils/storage.js`
- `frontend/src/App.jsx`

### Member B — Timer + Task Queue
- `frontend/src/hooks/useTimer.js`
- `frontend/src/components/Timer.jsx`
- `frontend/src/components/TaskQueue.jsx`

### Member C — Task Input + Energy Check-in + Session Summary
- `frontend/src/components/TaskInput.jsx`
- `frontend/src/components/EnergyCheckIn.jsx`
- `frontend/src/components/SessionSummary.jsx`

---

## How to Handle AppContext in Components (Member B and C)

Since `AppContext.jsx` is built by Member A, use it like this in your components:

```jsx
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const MyComponent = () => {
  const { tasks, setTasks, currentView, setCurrentView, ... } = useContext(AppContext);
  // your code
};
```

If AppContext is not yet ready when you're building, create a local mock at the top of your component file and replace it with the real import later:

```jsx
// TEMP MOCK — replace with real AppContext before integration
const tasks = [];
const setCurrentView = (v) => console.log("navigate to:", v);
```

---

## Gemini API Usage (Member A / Backend only)

- Model: `gemini-2.0-flash`
- API key loaded from `backend/.env` as `GEMINI_API_KEY`
- Gemini must be prompted to return **only JSON** — no markdown backticks, no explanation outside the JSON object
- Parse the response as a string and use `json.loads()` in Python

---

## CORS Configuration (Backend)

`backend/main.py` must allow requests from `http://localhost:5173`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Feature Priority

Build in this order. Do NOT start a lower tier before the tier above it works.

**Tier 1 — Must demo (non-negotiable):**
- Task input form with all 4 fields
- Energy check-in with 3 options
- AI plan generation via Gemini
- Pomodoro timer (25/5) with start/pause
- Task queue showing AI-ordered tasks
- Active task display during timer

**Tier 2 — Build if Tier 1 is solid:**
- Post-Pomodoro reflection input
- Estimated vs actual Pomodoro tracker
- AI end-of-day summary with insights
- 50/10 mode toggle

**Tier 3 — Only if Tier 2 is done:**
- Distraction log button
- "Chat with your planner" feature to reschedule tasks
- Streak / focus score display

---

## Code Style Conventions

- Use functional components with hooks only — no class components
- Use Tailwind for all styling — no inline styles, no separate CSS files unless absolutely necessary
- Use `async/await` for all async operations — no `.then()` chains
- Validate all API responses before using them — always handle loading and error states
- Keep each component under 200 lines — extract logic into hooks if needed

---

## What to Do If You're Unsure

1. Check this README first
2. Check the project plan (`FOCUSFLOW_PROJECT_PLAN.md`)
3. If still unsure, ask the user before writing code
4. Never assume a field name, route, or file name — look it up in this document

---

## What NOT to Do

- Do not add a database (no SQLite, no Supabase, no MongoDB)
- Do not add user authentication
- Do not create new API routes beyond `/api/plan` and `/api/summary`
- Do not use any state management library (no Redux, no Zustand)
- Do not call the Gemini API from the frontend — only from backend
- Do not rename any file, field, or localStorage key
- Do not add mobile responsiveness — desktop only for the demo
- Do not use any CSS framework other than Tailwind

---

*This README was written to prevent integration failures in a 12-hour hackathon. Every rule here exists for a reason. When in doubt, follow the plan.*
