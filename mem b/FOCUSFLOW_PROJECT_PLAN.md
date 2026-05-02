# FocusFlow – Project Plan
**Hackathon:** Build with PASC | Organized by PICT ACM Student Chapter  
**Duration:** 12 Hours  
**Team Size:** 3 Members  
**Problem Statement:** PS1 – Smart Pomodoro Timer for Productivity

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | FastAPI (Python) |
| AI | Gemini 2.0 Flash API |
| Storage | localStorage (no database) |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| State Management | React useState / useContext |

---

## Project Folder Structure

```
focusflow/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskInput.jsx          ← Member C
│   │   │   ├── TaskQueue.jsx          ← Member B
│   │   │   ├── Timer.jsx              ← Member B
│   │   │   ├── EnergyCheckIn.jsx      ← Member C
│   │   │   └── SessionSummary.jsx     ← Member C
│   │   ├── context/
│   │   │   └── AppContext.jsx         ← Member A (Parth)
│   │   ├── api/
│   │   │   └── client.js              ← Member A (Parth)
│   │   ├── utils/
│   │   │   └── storage.js             ← Member A (Parth)
│   │   ├── hooks/
│   │   │   └── useTimer.js            ← Member B
│   │   ├── App.jsx                    ← Member A (Parth)
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── main.py                        ← Member A (Parth)
│   ├── routes/
│   │   ├── plan.py                    ← Member A (Parth)
│   │   └── summary.py                 ← Member A (Parth)
│   ├── services/
│   │   └── gemini.py                  ← Member A (Parth)
│   ├── models/
│   │   └── schemas.py                 ← Member A (Parth)
│   └── .env
│
└── README.md
```

---

## Shared Data Contracts (READ THIS CAREFULLY — ALL MEMBERS)

> These are the exact shapes of data passed between frontend and backend.  
> Do NOT change field names or types without informing the full team.

### Task Object
```json
{
  "id": "string (uuid)",
  "name": "string",
  "deadline": "string (ISO date: YYYY-MM-DD)",
  "estimatedPomodoros": "number",
  "priority": "high | medium | low",
  "completedPomodoros": "number",
  "status": "pending | in-progress | done"
}
```

### POST /api/plan — Request Body
```json
{
  "tasks": [ /* array of Task objects */ ],
  "energyLevel": "high | medium | low",
  "availableMinutes": "number"
}
```

### POST /api/plan — Response Body
```json
{
  "orderedTasks": [ /* array of Task objects, reordered */ ],
  "reasoning": "string (AI explanation of ordering)",
  "totalPomodoros": "number"
}
```

### POST /api/summary — Request Body
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

### POST /api/summary — Response Body
```json
{
  "summary": "string (paragraph)",
  "insights": ["string", "string", "string"]
}
```

---

## API Endpoints (Backend)

| Method | Route | Handler File | Description |
|---|---|---|---|
| GET | `/` | `main.py` | Health check |
| POST | `/api/plan` | `routes/plan.py` | AI generates ordered task plan |
| POST | `/api/summary` | `routes/summary.py` | AI generates end-of-day summary |

**Base URL (local):** `http://localhost:8000`  
**Frontend API base:** defined in `frontend/src/api/client.js` as `BASE_URL`

---

## localStorage Keys (Frontend)

> All members writing to localStorage MUST use these exact key names.

| Key | Type | Description |
|---|---|---|
| `ff_tasks` | `Task[]` | All tasks added by user |
| `ff_plan` | `PlanResponse` | Latest AI-generated plan |
| `ff_active_task_id` | `string` | ID of currently running task |
| `ff_session_log` | `SessionLog[]` | Array of completed session logs |
| `ff_energy` | `string` | Last selected energy level |

---

## AppContext (Shared Global State)

File: `frontend/src/context/AppContext.jsx`

```jsx
// All components consume this context via useContext(AppContext)
{
  tasks,           // Task[]
  setTasks,
  plan,            // PlanResponse | null
  setPlan,
  activeTaskId,    // string | null
  setActiveTaskId,
  sessionLog,      // SessionLog[]
  addToSessionLog,
  energyLevel,     // string
  setEnergyLevel,
  currentView,     // "input" | "checkin" | "timer" | "summary"
  setCurrentView
}
```

---

## Member A — Parth (Backend + Integration Lead)

**Responsibility:** Backend API, Gemini integration, AppContext, API client, final integration

### Tasks

#### 1. Backend Setup
- Init FastAPI project in `/backend`
- Install: `fastapi`, `uvicorn`, `google-generativeai`, `python-dotenv`, `pydantic`
- Create `main.py` with CORS enabled for `http://localhost:5173`
- Load `GEMINI_API_KEY` from `.env`

#### 2. `backend/models/schemas.py`
Define all Pydantic models matching the Shared Data Contracts above:
- `Task`
- `PlanRequest`
- `PlanResponse`
- `SessionLog`
- `SummaryRequest`
- `SummaryResponse`

#### 3. `backend/services/gemini.py`
- Initialize Gemini 2.0 Flash client
- `generate_plan(tasks, energy_level, available_minutes) -> PlanResponse`
- `generate_summary(completed_sessions) -> SummaryResponse`
- Prompt engineering lives here. Instruct Gemini to return **only JSON** — no markdown backticks, no preamble

**Plan prompt template:**
```
You are a productivity assistant. Given the following tasks, energy level, and available time,
return a JSON object with keys: orderedTasks (reordered task array), reasoning (string), totalPomodoros (number).
Each Pomodoro = 25 minutes. Prioritize by deadline and priority. 
Energy level: {energy_level}. Available minutes: {available_minutes}.
Tasks: {tasks_json}
Return ONLY valid JSON. No explanation outside JSON.
```

**Summary prompt template:**
```
You are a productivity coach. Analyze these completed Pomodoro sessions and return a JSON object
with keys: summary (string paragraph), insights (array of 3 short strings).
Sessions: {sessions_json}
Return ONLY valid JSON. No explanation outside JSON.
```

#### 4. `backend/routes/plan.py`
- POST `/api/plan`
- Validate request with `PlanRequest`
- Call `gemini.generate_plan()`
- Parse JSON string response from Gemini
- Return `PlanResponse`

#### 5. `backend/routes/summary.py`
- POST `/api/summary`
- Validate request with `SummaryRequest`
- Call `gemini.generate_summary()`
- Parse JSON string response from Gemini
- Return `SummaryResponse`

#### 6. `frontend/src/context/AppContext.jsx`
- Create context with all fields listed in AppContext section above
- Hydrate initial state from localStorage using keys in localStorage Keys table
- Persist to localStorage on every state change (useEffect)

#### 7. `frontend/src/api/client.js`
```js
// All API calls go through this file
const BASE_URL = "http://localhost:8000";

export const generatePlan = async (tasks, energyLevel, availableMinutes) => { ... }
export const generateSummary = async (completedSessions) => { ... }
```

#### 8. `frontend/src/utils/storage.js`
```js
// Wrappers for localStorage using the exact key names above
export const getTasks = () => { ... }
export const setTasks = (tasks) => { ... }
export const getPlan = () => { ... }
export const setPlan = (plan) => { ... }
// ... etc for all keys
```

#### 9. `frontend/src/App.jsx`
- Wrap app in `AppContext.Provider`
- Conditional rendering based on `currentView`:
  - `"input"` → render `<TaskInput />`
  - `"checkin"` → render `<EnergyCheckIn />`
  - `"timer"` → render `<TaskQueue />` + `<Timer />`
  - `"summary"` → render `<SessionSummary />`

#### 10. Final Integration (Last 2 Hours)
- Pull all branches, resolve conflicts
- Wire `client.js` calls into components (Member B and C components call through AppContext or pass handlers as props)
- Test full flow end-to-end

---

## Member B — Timer + Task Queue

**Responsibility:** Timer logic, Task Queue display, useTimer hook

### Tasks

#### 1. `frontend/src/hooks/useTimer.js`
Custom hook — expose these and nothing else:
```js
const {
  secondsLeft,      // number
  isRunning,        // boolean
  mode,             // "focus" | "break"
  pomodoroCount,    // number (for current task)
  start,            // fn
  pause,            // fn
  reset,            // fn
  skip,             // fn (skip to next focus/break)
} = useTimer(durationMinutes)
```
- Support 25/5 and 50/10 modes
- On focus session end: increment `pomodoroCount`, auto-switch to break
- On break end: auto-switch back to focus
- Play a soft browser audio beep on transitions (use `AudioContext`)

#### 2. `frontend/src/components/Timer.jsx`
- Consumes `useTimer` hook and `AppContext`
- Display: circular countdown ring (SVG), time remaining, mode label (Focus / Break)
- Buttons: Start, Pause, Skip
- Shows name of `activeTaskId`'s task from `tasks` array in context
- On each completed focus session: prompt Member C's reflection input (can be a simple `window.prompt` for now — Parth will wire the proper component)
- A "Done with task" button: sets task `status` to `"done"`, increments `completedPomodoros` in context, calls `setActiveTaskId(null)`
- Timer mode toggle (25/5 or 50/10) — only shown when timer is NOT running

#### 3. `frontend/src/components/TaskQueue.jsx`
- Consumes `AppContext`
- Reads `plan.orderedTasks` from context
- Displays ordered list of tasks: name, priority badge, estimated pomodoros, completed pomodoros
- Clicking a task sets `activeTaskId` in context
- Completed tasks (status `"done"`) shown with strikethrough
- Shows `plan.reasoning` in a small AI reasoning card at the top
- "Generate Summary" button at bottom: calls `setCurrentView("summary")`  — only active when at least 1 task is `"done"`

---

## Member C — Task Input + Energy Check-in + Session Summary

**Responsibility:** Task creation UI, energy level selection, end-of-day summary display

### Tasks

#### 1. `frontend/src/components/TaskInput.jsx`
Form fields (controlled inputs):
- Task name (text)
- Deadline (date picker — HTML `<input type="date">`)
- Estimated Pomodoros (number, 1–12)
- Priority (select: High / Medium / Low)

On submit:
- Generate `id` using `crypto.randomUUID()`
- Set `completedPomodoros: 0`, `status: "pending"`
- Append to `tasks` in AppContext

Additional UI:
- Task list below the form showing all added tasks with a delete button
- "Plan My Day" button (disabled until at least 1 task added): calls `setCurrentView("checkin")`

#### 2. `frontend/src/components/EnergyCheckIn.jsx`
- Three large buttons: 🔋 High / ⚡ Medium / 😴 Low
- Brief description under each (e.g., "High — I'm ready to tackle hard tasks first")
- On select: sets `energyLevel` in AppContext
- "Start Planning" button: 
  - Calls `generatePlan()` from `client.js` via AppContext handler or prop
  - Shows loading spinner while waiting
  - On success: saves plan to context + localStorage, calls `setCurrentView("timer")`
  - On error: shows error toast

Available minutes input: simple number input defaulting to 120 (2 hours)

#### 3. `frontend/src/components/SessionSummary.jsx`
- Reads `sessionLog` from AppContext
- Calls `generateSummary()` from `client.js` on mount
- Shows loading state while fetching
- Displays:
  - AI summary paragraph
  - 3 insight cards (from `insights` array)
  - Table: Task name | Estimated | Actual | Difference
- "Start Over" button: clears localStorage and resets to `"input"` view

---

## App Flow (Reference for All Members)

```
TaskInput → EnergyCheckIn → [AI Plan generated] → Timer + TaskQueue → SessionSummary
"input"      "checkin"                              "timer"            "summary"
```

`currentView` in AppContext drives which screen is shown. Only Member A (App.jsx) handles this routing. All view transitions happen by calling `setCurrentView(...)` from context.

---

## Timeline (Suggested — 12 Hours)

| Time | Activity |
|---|---|
| 00:00 – 00:30 | All: Repo setup, install deps, run hello world on both frontend and backend |
| 00:30 – 01:00 | Member A: AppContext + storage.js + client.js skeleton. Others: component file stubs |
| 01:00 – 04:00 | Parallel build (each member works on their components) |
| 04:00 – 05:00 | First integration checkpoint — wire TaskInput → EnergyCheckIn flow |
| 05:00 – 08:00 | Continue parallel build |
| 08:00 – 09:30 | Second integration checkpoint — full flow working end-to-end |
| 09:30 – 11:00 | Bug fixes, polish UI, improve AI prompts |
| 11:00 – 11:45 | Demo prep, rehearse walkthrough |
| 11:45 – 12:00 | Buffer |

---

## Environment Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install fastapi uvicorn google-generativeai python-dotenv pydantic
```

Create `backend/.env`:
```
GEMINI_API_KEY=your_key_here
```

Run:
```bash
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm create vite@latest . -- --template react
npm install axios tailwindcss @tailwindcss/vite
```

Run:
```bash
npm run dev  # runs on http://localhost:5173
```

---

## Critical Rules for All Members

1. **Never rename files.** File names in the folder structure above are final.
2. **Never change field names** in the Shared Data Contracts section.
3. **All localStorage access** must use the exact keys from the localStorage Keys table.
4. **All API calls** must go through `frontend/src/api/client.js` — never call fetch/axios directly from a component.
5. **All global state** must go through `AppContext` — no prop drilling beyond 1 level.
6. **If you need to change a shared contract**, inform Member A (Parth) before changing — he owns integration.
7. **Commit often** to main. Always git pull before pushing to avoid conflicts.