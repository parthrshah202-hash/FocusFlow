import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Hydrate state from localStorage
  const [tasks, setTasks] = useState(() => storage.getTasks());
  const [plan, setPlan] = useState(() => storage.getPlan());
  const [activeTaskId, setActiveTaskId] = useState(() => storage.getActiveTaskId());
  const [sessionLog, setSessionLog] = useState(() => storage.getSessionLog());
  const [energyLevel, setEnergyLevel] = useState(() => storage.getEnergy());
  const [moodScore, setMoodScore] = useState(() => storage.getMood());
  const [preferredMode, setPreferredMode] = useState(() => storage.getPreferredMode());
  const [distractions, setDistractions] = useState(() => storage.getDistractions());
  const [focusScore, setFocusScore] = useState(() => storage.getFocusScore());
  const [coachHistory, setCoachHistory] = useState(() => storage.getCoachHistory());
  const [currentView, setCurrentView] = useState('dashboard');
  const [timerMode, setTimerMode] = useState('25/5');

  // Persistence Effects
  useEffect(() => { storage.setTasks(tasks); }, [tasks]);
  useEffect(() => { storage.setPlan(plan); }, [plan]);
  useEffect(() => { storage.setActiveTaskId(activeTaskId); }, [activeTaskId]);
  useEffect(() => { storage.setSessionLog(sessionLog); }, [sessionLog]);
  useEffect(() => { storage.setEnergy(energyLevel); }, [energyLevel]);
  useEffect(() => { storage.setMood(moodScore); }, [moodScore]);
  useEffect(() => { storage.setPreferredMode(preferredMode); }, [preferredMode]);
  useEffect(() => { storage.setDistractions(distractions); }, [distractions]);
  useEffect(() => { storage.setFocusScore(focusScore); }, [focusScore]);
  useEffect(() => { storage.setCoachHistory(coachHistory); }, [coachHistory]);

  // Helpers
  const addDistraction = (distraction) => {
    setDistractions((prev) => [...prev, distraction]);
  };

  const addToSessionLog = (entry) => {
    setSessionLog((prev) => [...prev, entry]);
  };

  const addToCoachHistory = (message) => {
    setCoachHistory((prev) => [...prev, message]);
  };

  const value = {
    tasks, setTasks,
    plan, setPlan,
    activeTaskId, setActiveTaskId,
    sessionLog, setSessionLog,
    energyLevel, setEnergyLevel,
    moodScore, setMoodScore,
    preferredMode, setPreferredMode,
    distractions, setDistractions,
    focusScore, setFocusScore,
    coachHistory, setCoachHistory,
    currentView, setCurrentView,
    timerMode, setTimerMode,
    addDistraction,
    addToSessionLog,
    addToCoachHistory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
