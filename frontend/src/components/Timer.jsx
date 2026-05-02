import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTimer } from '../hooks/useTimer';
import { Play, Pause, RotateCcw, SkipForward, CheckCircle2 } from 'lucide-react';

const Timer = () => {
  const { 
    timerMode, setTimerMode, 
    tasks, setTasks,
    activeTaskId, setActiveTaskId,
    distractions, moodScore,
    addToSessionLog
  } = useAppContext();

  const {
    secondsLeft,
    isRunning,
    mode,
    pomodoroCount,
    start,
    pause,
    reset,
    skip,
  } = useTimer(timerMode);

  const [reflection, setReflection] = useState('');
  const [showReflection, setShowReflection] = useState(false);
  const [sessionReflections, setSessionReflections] = useState([]);

  const activeTask = tasks.find(t => t.id === activeTaskId);
  
  const getDurations = (m) => {
    switch (m) {
      case "50/10": return { focus: 50 * 60, break: 10 * 60 };
      case "90/15": return { focus: 90 * 60, break: 15 * 60 };
      default: return { focus: 25 * 60, break: 5 * 60 };
    }
  };

  const totalSeconds = mode === 'focus' ? getDurations(timerMode).focus : getDurations(timerMode).break;
  const progress = (secondsLeft / totalSeconds) * 100;
  const strokeDashoffset = 754 - (754 * progress) / 100;

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (secondsLeft === 0 && mode === 'break') {
      setShowReflection(true);
    }
  }, [secondsLeft, mode]);

  const handleReflectionSubmit = (e) => {
    if (e.key === 'Enter' && reflection.trim()) {
      setSessionReflections([...sessionReflections, reflection]);
      setReflection('');
      setShowReflection(false);
    }
  };

  const markAsDone = () => {
    if (!activeTask) return;

    const updatedTasks = tasks.map(t => 
      t.id === activeTaskId 
        ? { ...t, status: 'done', completedPomodoros: t.completedPomodoros + 1 } 
        : t
    );
    setTasks(updatedTasks);

    const taskDistractions = distractions.filter(d => d.taskId === activeTaskId);

    const logEntry = {
      taskId: activeTask.id,
      taskName: activeTask.name,
      estimatedPomodoros: activeTask.estimatedPomodoros,
      actualPomodoros: activeTask.completedPomodoros + 1,
      reflections: sessionReflections,
      distractions: taskDistractions,
      moodBefore: 3, // Default
      moodAfter: moodScore, // Use current mood
      completedAt: new Date().toISOString()
    };

    addToSessionLog(logEntry);
    setActiveTaskId(null);
    setSessionReflections([]);
  };

  return (
    <div className="bg-[#12121A] border border-[#2A2A3D] rounded-2xl p-10 flex flex-col items-center gap-8 shadow-xl">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform">
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C6EFF" />
              <stop offset="100%" stopColor="#4ECDC4" />
            </linearGradient>
          </defs>
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="#2A2A3D"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="url(#timerGradient)"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray="754"
            style={{ 
              strokeDashoffset,
              transition: 'stroke-dashoffset 1s linear'
            }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="timer-display text-5xl font-semibold text-[#F0F0FF] tabular-nums">
            {formatTime(secondsLeft)}
          </span>
          <span className={`text-[10px] font-bold tracking-widest mt-2 px-3 py-1 rounded-full ${
            mode === 'focus' ? 'text-[#7C6EFF] bg-[#7C6EFF]/10' : 'text-[#4ECDC4] bg-[#4ECDC4]/10'
          }`}>
            {mode.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="text-center max-w-xs">
        <h3 className="text-xl font-bold text-[#F0F0FF] truncate">
          {activeTask ? activeTask.name : "Select a task to start"}
        </h3>
        {activeTask && (
          <p className="text-[#8A8AA8] text-sm mt-1">
            Pomodoro {pomodoroCount + 1} of {activeTask.estimatedPomodoros}
          </p>
        )}
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={reset}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-[#1A1A26] border border-[#2A2A3D] text-[#8A8AA8] hover:border-[#7C6EFF] hover:text-[#7C6EFF] transition-all duration-200"
        >
          <RotateCcw size={20} />
        </button>
        <button
          onClick={isRunning ? pause : start}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-[#7C6EFF] text-white shadow-[0_0_20px_rgba(124,110,255,0.3)] hover:scale-105 transition-all duration-200"
        >
          {isRunning ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
        </button>
        <button
          onClick={skip}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-[#1A1A26] border border-[#2A2A3D] text-[#8A8AA8] hover:border-[#7C6EFF] hover:text-[#7C6EFF] transition-all duration-200"
        >
          <SkipForward size={20} />
        </button>
      </div>

      {!isRunning && (
        <div className="flex bg-[#1A1A26] border border-[#2A2A3D] rounded-lg p-1 scale-90">
          {['25/5', '50/10', '90/15'].map((m) => (
            <button
              key={m}
              onClick={() => setTimerMode(m)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${
                timerMode === m 
                  ? 'bg-[#7C6EFF] text-white shadow-sm' 
                  : 'text-[#8A8AA8] hover:text-[#F0F0FF]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {activeTask && (
        <button
          onClick={markAsDone}
          className="text-[#8A8AA8] text-sm underline hover:text-[#F0F0FF] transition-colors duration-200 flex items-center gap-2"
        >
          <CheckCircle2 size={16} />
          Mark as done
        </button>
      )}

      {showReflection && (
        <div className="w-full mt-4 animate-in fade-in slide-in-from-top duration-300">
          <input
            autoFocus
            type="text"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            onKeyDown={handleReflectionSubmit}
            placeholder="What did you just accomplish? (press Enter)"
            className="w-full bg-[#1A1A26] border border-[#7C6EFF]/50 rounded-lg px-4 py-2.5 text-sm text-[#F0F0FF] focus:outline-none focus:border-[#7C6EFF] transition-all duration-200"
          />
        </div>
      )}
    </div>
  );
};

export default Timer;
