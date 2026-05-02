import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const TaskQueue = () => {
    const { plan, tasks, activeTaskId, setActiveTaskId, setCurrentView } = useContext(AppContext);

    if (!plan) return null;

    const queueTasks = plan.orderedTasks.map(pt => tasks.find(t => t.id === pt.id) || pt);
    const hasCompletedTask = queueTasks.some(t => t.status === 'done');

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-500/20 text-red-400 border-red-500/40';
            case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
            case 'low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
        }
    };

    return (
        <div className="glass p-6 flex flex-col rounded-2xl h-full max-h-[800px] m-6 md:my-8 md:ml-8">
            <h2 className="text-xl font-bold mb-4 text-white">Today's Plan</h2>
            
            {plan.reasoning && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                    <p className="text-slate-300 text-sm italic">"{plan.reasoning}"</p>
                </div>
            )}

            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {queueTasks.map((task) => {
                    const isActive = task.id === activeTaskId;
                    const isDone = task.status === 'done';

                    return (
                        <div
                            key={task.id}
                            onClick={() => !isDone && setActiveTaskId(task.id)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                isActive 
                                    ? 'bg-indigo-500/20 border-indigo-500/40' 
                                    : isDone 
                                        ? 'border-white/5 bg-white/5 opacity-50 cursor-default'
                                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className={`font-medium ${isDone ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                                    {task.name}
                                </h3>
                                <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)} uppercase tracking-wider font-semibold`}>
                                    {task.priority}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">
                                    {task.completedPomodoros} / {task.estimatedPomodoros} Pomodoros
                                </span>
                                {isDone && <span className="text-indigo-400 font-medium text-xs uppercase tracking-widest">Completed</span>}
                                {isActive && <span className="text-indigo-400 font-medium text-xs uppercase tracking-widest animate-pulse">Running</span>}
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                onClick={() => setCurrentView('summary')}
                disabled={!hasCompletedTask}
                className={`mt-6 py-3 px-4 w-full rounded-2xl font-bold transition-colors ${
                    hasCompletedTask 
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
                        : 'bg-white/5 border border-white/5 text-slate-500 cursor-not-allowed'
                }`}
            >
                Generate Day Summary
            </button>
        </div>
    );
};

export default TaskQueue;
