import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { useTimer } from '../hooks/useTimer';

const Timer = () => {
    const { activeTaskId, setActiveTaskId, tasks, setTasks, addToSessionLog } = useContext(AppContext);

    const [timerMode, setTimerMode] = useState('25/5');
    const focusMinutes = timerMode === '25/5' ? 25 : 50;
    const breakMinutes = timerMode === '25/5' ? 5 : 10;

    const {
        secondsLeft,
        isRunning,
        mode,
        pomodoroCount,
        start,
        pause,
        reset,
        skip,
        setPomodoroCount
    } = useTimer(focusMinutes, breakMinutes);

    const activeTask = tasks.find(t => t.id === activeTaskId);

    const [showReflection, setShowReflection] = useState(false);
    const [reflectionText, setReflectionText] = useState("");
    const prevPomodoroCount = useRef(pomodoroCount);

    useEffect(() => {
        if (pomodoroCount > prevPomodoroCount.current) {
            setShowReflection(true);
            prevPomodoroCount.current = pomodoroCount;
        }
    }, [pomodoroCount]);

    const formatTime = (totalSeconds) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const totalSeconds = mode === 'focus' ? focusMinutes * 60 : breakMinutes * 60;
    const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const handleDone = () => {
        if (!activeTask) return;

        // Always log the session when done
        addToSessionLog({
            taskId: activeTask.id,
            taskName: activeTask.name,
            estimatedPomodoros: activeTask.estimatedPomodoros,
            actualPomodoros: pomodoroCount || 1,
            reflections: reflectionText.trim() ? [reflectionText.trim()] : []
        });

        setTasks(prev => prev.map(t => {
            if (t.id === activeTask.id) {
                return { ...t, status: 'done', completedPomodoros: t.completedPomodoros + (pomodoroCount || 1) };
            }
            return t;
        }));

        setActiveTaskId(null);
        reset();
        setPomodoroCount(0);
        prevPomodoroCount.current = 0;
        setShowReflection(false);
        setReflectionText("");
    };

    const handleReflectionSubmit = (e) => {
        e.preventDefault();
        if (activeTask && reflectionText.trim()) {
            addToSessionLog({
                taskId: activeTask.id,
                taskName: activeTask.name,
                estimatedPomodoros: activeTask.estimatedPomodoros,
                actualPomodoros: 1,
                reflections: [reflectionText.trim()]
            });
        }
        setShowReflection(false);
        setReflectionText("");
    };

    return (
        <>
            <div className="fixed inset-0 bg-gradient-to-br from-[#0f0f1a] via-[#12122a] to-[#0a0a1a] -z-10"></div>
            <div className="glass p-8 flex flex-col items-center rounded-2xl relative overflow-hidden h-full m-6 md:my-8 md:mr-8">
                <h2 className="text-2xl font-bold mb-2 text-white">
                    {activeTask ? activeTask.name : "No Task Selected"}
                </h2>
                <p className="text-slate-400 mb-8 uppercase tracking-widest text-sm font-semibold">
                    {mode === 'focus' ? 'Focus Session' : 'Break Time'}
                </p>

                <div className="relative flex items-center justify-center w-64 h-64 mb-8">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
                        <circle
                            cx="128"
                            cy="128"
                            r={radius}
                            className="stroke-slate-800"
                            strokeWidth="8"
                            fill="none"
                        />
                        <circle
                            cx="128"
                            cy="128"
                            r={radius}
                            className="stroke-indigo-500 transition-all duration-1000 ease-linear"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-5xl font-extrabold text-white tracking-tight">
                            {formatTime(secondsLeft)}
                        </span>
                        <span className="text-slate-500 mt-2 text-sm">
                            Session {pomodoroCount + 1}
                        </span>
                    </div>
                </div>

                {showReflection ? (
                    <form onSubmit={handleReflectionSubmit} className="w-full max-w-sm flex flex-col gap-3 mb-6 animate-fadeInUp">
                        <label className="text-slate-400 text-sm font-medium text-center">How did it go?</label>
                        <input
                            type="text"
                            value={reflectionText}
                            onChange={(e) => setReflectionText(e.target.value)}
                            placeholder="Reflection..."
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                            autoFocus
                        />
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-2xl transition-colors">
                            Save Reflection
                        </button>
                    </form>
                ) : (
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                        {!isRunning ? (
                            <button onClick={start} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-2xl transition-colors">
                                Start
                            </button>
                        ) : (
                            <button onClick={pause} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-2xl transition-colors">
                                Pause
                            </button>
                        )}
                        <button onClick={skip} className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold py-3 px-6 rounded-2xl transition-colors">
                            Skip
                        </button>
                    </div>
                )}

                {!isRunning && (
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-slate-500 text-sm font-medium">Mode:</span>
                        <button
                            onClick={() => setTimerMode('25/5')}
                            className={`text-sm px-3 py-1 rounded-full transition-colors ${timerMode === '25/5' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:text-slate-300 border border-white/10'}`}
                        >
                            25/5
                        </button>
                        <button
                            onClick={() => setTimerMode('50/10')}
                            className={`text-sm px-3 py-1 rounded-full transition-colors ${timerMode === '50/10' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:text-slate-300 border border-white/10'}`}
                        >
                            50/10
                        </button>
                    </div>
                )}

                {activeTask && (
                    <button
                        onClick={handleDone}
                        className="mt-auto w-full border border-indigo-500/40 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 font-semibold py-3 px-6 rounded-2xl transition-colors"
                    >
                        Done with Task
                    </button>
                )}
            </div>
        </>
    );
};

export default Timer;
