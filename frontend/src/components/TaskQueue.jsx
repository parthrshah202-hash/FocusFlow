import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

// Mock AppContext for development
const MockContext = {
  plan: {
    orderedTasks: [],
    reasoning: "No plan generated yet. Go to Task Input to get started."
  },
  activeTaskId: null,
  setActiveTaskId: () => {},
  setCurrentView: () => {},
  tasks: []
};

const TaskQueue = () => {
  const context = useContext(AppContext) || MockContext;
  const { plan, activeTaskId, setActiveTaskId, setCurrentView, tasks } = context;

  // Sync orderedTasks with the latest data from the tasks array in context
  const orderedTasks = (plan?.orderedTasks || []).map(plannedTask => {
    const latestTask = tasks.find(t => t.id === plannedTask.id);
    return latestTask || plannedTask;
  });
  const hasDoneTask = tasks.some(t => t.status === "done");

  const priorityColors = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-blue-500/20 text-blue-400 border-blue-500/30"
  };

  return (
    <div className="flex flex-col h-full bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 text-white overflow-hidden shadow-xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="bg-indigo-500 w-2 h-6 rounded-full mr-3"></span>
          Your Session Plan
        </h2>
        
        {plan?.reasoning && (
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 mb-6">
            <div className="flex items-start">
              <span className="text-indigo-400 mr-2 mt-1">✨</span>
              <p className="text-sm text-indigo-100 italic leading-relaxed">
                {plan.reasoning}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {orderedTasks.length > 0 ? (
          orderedTasks.map((task) => {
            const isActive = task.id === activeTaskId;
            const isDone = task.status === "done";
            
            return (
              <button
                key={task.id}
                onClick={() => !isDone && setActiveTaskId(task.id)}
                disabled={isDone}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 group ${
                  isActive 
                    ? "bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10" 
                    : isDone
                      ? "bg-gray-800/40 border-gray-800 opacity-60 cursor-not-allowed"
                      : "bg-gray-800/50 border-gray-800 hover:border-gray-700 hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                  <span className="text-xs text-gray-400">
                    {task.completedPomodoros} / {task.estimatedPomodoros} Poms
                  </span>
                </div>
                
                <h3 className={`font-medium ${isDone ? "line-through text-gray-500" : "text-gray-100"}`}>
                  {task.name}
                </h3>
                
                {isActive && (
                  <div className="mt-3 flex items-center text-xs text-indigo-400 font-bold animate-pulse">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></span>
                    ACTIVE NOW
                  </div>
                )}
              </button>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500 text-center">
            <p className="text-sm">No tasks in queue.</p>
            <p className="text-xs mt-1">Generate a plan to see them here.</p>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-800">
        <button
          onClick={() => setCurrentView("summary")}
          disabled={!hasDoneTask}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/10"
        >
          Finish Day & Generate Summary
        </button>
      </div>
    </div>
  );
};

export default TaskQueue;
