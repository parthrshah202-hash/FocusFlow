import { createContext, useState, useEffect } from 'react';
import {
  getTasks, setTasks as saveTasks,
  getPlan, setPlan as savePlan,
  getActiveTaskId, setActiveTaskId as saveActiveTaskId,
  getSessionLog, setSessionLog as saveSessionLog,
  getEnergy, setEnergy as saveEnergy,
} from '../utils/storage';

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [tasks, setTasksState] = useState(() => getTasks());
  const [plan, setPlanState] = useState(() => getPlan());
  const [activeTaskId, setActiveTaskIdState] = useState(() => getActiveTaskId());
  const [sessionLog, setSessionLogState] = useState(() => getSessionLog());
  const [energyLevel, setEnergyLevelState] = useState(() => getEnergy());
  const [currentView, setCurrentView] = useState('input');

  // Persist to localStorage on every state change
  const setTasks = (t) => { setTasksState(t); saveTasks(t); };
  const setPlan = (p) => { setPlanState(p); savePlan(p); };
  const setActiveTaskId = (id) => { setActiveTaskIdState(id); saveActiveTaskId(id); };
  const setEnergyLevel = (e) => { setEnergyLevelState(e); saveEnergy(e); };

  const addToSessionLog = (entry) => {
    setSessionLogState((prev) => {
      const updated = [...prev, entry];
      saveSessionLog(updated);
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        tasks, setTasks,
        plan, setPlan,
        activeTaskId, setActiveTaskId,
        sessionLog, addToSessionLog,
        energyLevel, setEnergyLevel,
        currentView, setCurrentView,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
