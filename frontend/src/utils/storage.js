// Wrappers for localStorage using the exact key names from the plan
const KEYS = {
  TASKS: 'ff_tasks',
  PLAN: 'ff_plan',
  ACTIVE_TASK_ID: 'ff_active_task_id',
  SESSION_LOG: 'ff_session_log',
  ENERGY: 'ff_energy',
};

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const getTasks = () => safeParse(localStorage.getItem(KEYS.TASKS), []);
export const setTasks = (tasks) => localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));

export const getPlan = () => safeParse(localStorage.getItem(KEYS.PLAN), null);
export const setPlan = (plan) => localStorage.setItem(KEYS.PLAN, JSON.stringify(plan));

export const getActiveTaskId = () => localStorage.getItem(KEYS.ACTIVE_TASK_ID) || null;
export const setActiveTaskId = (id) => {
  if (id === null) localStorage.removeItem(KEYS.ACTIVE_TASK_ID);
  else localStorage.setItem(KEYS.ACTIVE_TASK_ID, id);
};

export const getSessionLog = () => safeParse(localStorage.getItem(KEYS.SESSION_LOG), []);
export const setSessionLog = (log) => localStorage.setItem(KEYS.SESSION_LOG, JSON.stringify(log));

export const getEnergy = () => localStorage.getItem(KEYS.ENERGY) || '';
export const setEnergy = (level) => localStorage.setItem(KEYS.ENERGY, level);

export const clearAll = () => {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
};
