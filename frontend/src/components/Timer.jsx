import React, { useContext, useEffect, useState } from "react";
import useTimer from "../hooks/useTimer";
import { AppContext } from "../context/AppContext";

// Mock AppContext for development if not yet ready
const MockContext = {
  tasks: [],
  setTasks: () => {},
  activeTaskId: null,
  setActiveTaskId: () => {},
  sessionLog: [],
  addToSessionLog: () => {},
};

const Timer = () => {
  // Use real context or mock
  const context = useContext(AppContext) || MockContext;
  const { tasks, setTasks, activeTaskId, setActiveTaskId, addToSessionLog } = context;

  const {
    secondsLeft,
    isRunning,
    mode,
    pomodoroCount,
    start,
    pause,
    reset,
    skip,
    updateConfig,
    config,
    resetPomodoroCount
  } = useTimer(25);

  const [timerMode, setTimerMode] = useState("25/5");

  const activeTask = tasks.find(t => t.id === activeTaskId);

  // Reset timer session when task changes
  useEffect(() => {
    resetPomodoroCount();
    reset();
  }, [activeTaskId]);

  // Handle focus session completion
  useEffect(() => {
    if (pomodoroCount > 0 && mode === "break") {
      const reflection = window.prompt("Focus session complete! Any quick reflection or distraction notes?");
      if (activeTaskId) {
        // Update task progress in context
        setTasks(prev => prev.map(t => 
          t.id === activeTaskId 
            ? { ...t, completedPomodoros: (t.completedPomodoros || 0) + 1 }
            : t
        ));

        // Log session
        addToSessionLog({
          taskId: activeTaskId,
          taskName: activeTask?.name || "Unknown Task",
          estimatedPomodoros: activeTask?.estimatedPomodoros || 0,
          actualPomodoros: 1,
          reflections: reflection ? [reflection] : []
        });
      }
    }
  }, [pomodoroCount]);

  const handleDone = () => {
    if (!activeTaskId) return;
    
    setTasks(prev => prev.map(t => 
      t.id === activeTaskId 
        ? { ...t, status: "done" }
        : t
    ));
    setActiveTaskId(null);
  };

  const toggleTimerMode = () => {
    if (timerMode === "25/5") {
      setTimerMode("50/10");
      updateConfig(50, 10);
    } else {
      setTimerMode("25/5");
      updateConfig(25, 5);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // SVG Ring calculations
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const totalSeconds = mode === "focus" ? config.focus * 60 : config.break * 60;
  const strokeDashoffset = circumference - (secondsLeft / totalSeconds) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 text-white w-full max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-sm font-bold tracking-widest text-indigo-400 uppercase mb-1">
          {mode === "focus" ? "Focus Session" : "Break Time"}
        </h2>
        <h1 className="text-xl font-medium truncate max-w-xs">
          {activeTask ? activeTask.name : "Select a task to start"}
        </h1>
      </div>

      <div className="relative flex items-center justify-center w-64 h-64 mb-8">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-800"
          />
          <circle
            cx="128"
            cy="128"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            style={{ 
              strokeDashoffset,
              transition: "stroke-dashoffset 1s linear",
              color: mode === "focus" ? "#818cf8" : "#34d399"
            }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-6xl font-mono font-light tracking-tighter">
          {formatTime(secondsLeft)}
        </div>
      </div>

      <div className="flex space-x-4 mb-8">
        {!isRunning ? (
          <button
            onClick={start}
            disabled={!activeTaskId && mode === "focus"}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-full font-semibold transition-all shadow-lg shadow-indigo-500/20"
          >
            Start
          </button>
        ) : (
          <button
            onClick={pause}
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-full font-semibold transition-all"
          >
            Pause
          </button>
        )}
        <button
          onClick={skip}
          className="px-6 py-3 border border-gray-700 hover:bg-gray-800 rounded-full font-semibold transition-all"
        >
          Skip
        </button>
      </div>

      <div className="flex flex-col w-full space-y-4">
        {activeTaskId && (
          <button
            onClick={handleDone}
            className="w-full py-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-600/30 rounded-xl font-medium transition-all"
          >
            Mark Task as Done
          </button>
        )}

        {!isRunning && (
          <button
            onClick={toggleTimerMode}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Switch to {timerMode === "25/5" ? "50/10" : "25/5"} mode
          </button>
        )}
      </div>
      
      <div className="mt-6 text-gray-500 text-xs">
        Pomodoros this session: {pomodoroCount}
      </div>
    </div>
  );
};

export default Timer;
