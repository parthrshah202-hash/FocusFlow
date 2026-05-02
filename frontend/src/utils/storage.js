const KEYS = {
  TASKS: 'ff_tasks',
  PLAN: 'ff_plan',
  ACTIVE_TASK_ID: 'ff_active_task_id',
  SESSION_LOG: 'ff_session_log',
  ENERGY: 'ff_energy',
  MOOD: 'ff_mood',
  DISTRACTIONS: 'ff_distractions',
  FOCUS_SCORE: 'ff_focus_score',
  COACH_HISTORY: 'ff_coach_history',
  PREFERRED_MODE: 'ff_preferred_mode',
};

const get = (key, defaultValue) => {
  const value = localStorage.getItem(key);
  if (value === null) return defaultValue;
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

const set = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const storage = {
  getTasks: () => get(KEYS.TASKS, []),
  setTasks: (tasks) => set(KEYS.TASKS, tasks),

  getPlan: () => get(KEYS.PLAN, null),
  setPlan: (plan) => set(KEYS.PLAN, plan),

  getActiveTaskId: () => get(KEYS.ACTIVE_TASK_ID, null),
  setActiveTaskId: (id) => set(KEYS.ACTIVE_TASK_ID, id),

  getSessionLog: () => get(KEYS.SESSION_LOG, []),
  setSessionLog: (log) => set(KEYS.SESSION_LOG, log),

  getEnergy: () => get(KEYS.ENERGY, 'medium'),
  setEnergy: (energy) => set(KEYS.ENERGY, energy),

  getMood: () => get(KEYS.MOOD, 3),
  setMood: (mood) => set(KEYS.MOOD, mood),

  getDistractions: () => get(KEYS.DISTRACTIONS, []),
  setDistractions: (distractions) => set(KEYS.DISTRACTIONS, distractions),

  getFocusScore: () => get(KEYS.FOCUS_SCORE, 0),
  setFocusScore: (score) => set(KEYS.FOCUS_SCORE, score),

  getCoachHistory: () => get(KEYS.COACH_HISTORY, []),
  setCoachHistory: (history) => set(KEYS.COACH_HISTORY, history),

  getPreferredMode: () => get(KEYS.PREFERRED_MODE, 'balanced'),
  setPreferredMode: (mode) => set(KEYS.PREFERRED_MODE, mode),
};
