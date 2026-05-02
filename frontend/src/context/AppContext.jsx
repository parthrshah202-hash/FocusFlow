import React, { createContext, useState, useEffect } from 'react';
import {
    getTasks, setTasks as saveTasks,
    getPlan, setPlan as savePlan,
    getActiveTaskId, setActiveTaskId as saveActiveTaskId,
    getSessionLog, setSessionLog as saveSessionLog,
    getEnergy, setEnergy as saveEnergy
} from '../utils/storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [tasks, setTasks] = useState(getTasks());
    const [plan, setPlan] = useState(getPlan());
    const [activeTaskId, setActiveTaskId] = useState(getActiveTaskId());
    const [sessionLog, setSessionLogState] = useState(getSessionLog());
    const [energyLevel, setEnergyLevel] = useState(getEnergy());
    const [currentView, setCurrentView] = useState("input");

    useEffect(() => {
        saveTasks(tasks);
    }, [tasks]);

    useEffect(() => {
        savePlan(plan);
    }, [plan]);

    useEffect(() => {
        saveActiveTaskId(activeTaskId);
    }, [activeTaskId]);

    useEffect(() => {
        saveSessionLog(sessionLog);
    }, [sessionLog]);

    useEffect(() => {
        saveEnergy(energyLevel);
    }, [energyLevel]);

    const addToSessionLog = (logEntry) => {
        setSessionLogState((prev) => [...prev, logEntry]);
    };

    return (
        <AppContext.Provider value={{
            tasks, setTasks,
            plan, setPlan,
            activeTaskId, setActiveTaskId,
            sessionLog, addToSessionLog,
            energyLevel, setEnergyLevel,
            currentView, setCurrentView
        }}>
            {children}
        </AppContext.Provider>
    );
};
