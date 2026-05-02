import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';

const TaskQueue = () => {
  const { 
    tasks, 
    plan, 
    activeTaskId, 
    setActiveTaskId,
    setCurrentView
  } = useAppContext();

  if (!plan) return null;

  // Reorder tasks based on plan.orderedTasks
  const orderedTasks = plan.orderedTasks.map(planTask => {
    const originalTask = tasks.find(t => t.id === planTask.id);
    return originalTask || planTask;
  });

  const hasDoneTasks = tasks.some(t => t.status === 'done');

  return (
    <div className="flex flex-col gap-6 h-full">
      <h2 className="text-xl font-bold text-[#F0F0FF]">Today's Plan</h2>

      <div className="bg-[#1A1A26] border border-[#7C6EFF]/30 rounded-xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-20">
          <Sparkles className="text-[#7C6EFF]" size={40} />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="text-[#7C6EFF]" size={18} />
          <span className="text-xs font-bold text-[#7C6EFF] tracking-wider uppercase">AI Reasoning</span>
        </div>
        <p className="text-sm text-[#8A8AA8] leading-relaxed italic">
          "{plan.reasoning}"
        </p>
        <div className="flex gap-2 mt-4">
          <span className="text-[10px] font-mono bg-[#7C6EFF]/10 text-[#7C6EFF] px-2 py-1 rounded-full border border-[#7C6EFF]/20">
            {plan.recommendedMode} MODE
          </span>
          <span className="text-[10px] font-mono bg-[#7C6EFF]/10 text-[#7C6EFF] px-2 py-1 rounded-full border border-[#7C6EFF]/20">
            {plan.totalPomodoros} POMODOROS
          </span>
        </div>
      </div>

      {plan.warningMessage && (
        <div className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="text-[#FF6B6B] shrink-0" size={18} />
          <p className="text-xs text-[#FF6B6B] font-medium leading-normal">
            {plan.warningMessage}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 overflow-y-auto pr-2 max-h-[400px]">
        {orderedTasks.map((task, index) => {
          const isActive = task.id === activeTaskId;
          const isDone = task.status === 'done';

          return (
            <button
              key={task.id}
              disabled={isDone}
              onClick={() => setActiveTaskId(task.id)}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left ${
                isActive 
                  ? 'bg-[#1A1A26] border-[#7C6EFF] shadow-[0_0_16px_rgba(124,110,255,0.15)] ring-1 ring-[#7C6EFF]' 
                  : isDone 
                    ? 'bg-[#12121A]/50 border-[#2A2A3D] opacity-60' 
                    : 'bg-[#12121A] border-[#2A2A3D] hover:border-[#4A4A6A]'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="mono text-xs text-[#4A4A6A] font-bold">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className={`font-bold text-sm ${isDone ? 'text-[#4A4A6A] line-through' : 'text-[#F0F0FF]'}`}>
                    {task.name}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-[#8A8AA8]">
                    <span>{task.deadline || 'No deadline'}</span>
                    {task.tags.length > 0 && (
                      <span className="text-[#4A4A6A]">/ {task.tags[0]}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border mb-1 ${
                    task.priority === 'high' ? 'bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/20' : 
                    task.priority === 'medium' ? 'bg-[#7C6EFF]/10 text-[#7C6EFF] border-[#7C6EFF]/20' : 
                    'bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/20'
                  }`}>
                    {task.priority.toUpperCase()}
                  </span>
                  <span className="mono text-[10px] text-[#8A8AA8]">
                    {task.completedPomodoros}/{task.estimatedPomodoros}
                  </span>
                </div>
                {isDone && <CheckCircle2 size={18} className="text-[#4ECDC4]" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-4">
        <button
          onClick={() => setCurrentView('summary')}
          disabled={!hasDoneTasks}
          className={`w-full py-2.5 rounded-lg text-sm font-bold border transition-all duration-200 ${
            hasDoneTasks 
              ? 'border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4]/10' 
              : 'border-[#2A2A3D] text-[#4A4A6A] cursor-not-allowed'
          }`}
        >
          Generate Summary
        </button>
      </div>
    </div>
  );
};

export default TaskQueue;
