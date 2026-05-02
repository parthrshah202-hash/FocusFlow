import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Terminal, ShieldAlert, ExternalLink, Plus } from 'lucide-react';

const DistractionLog = () => {
  const { distractions, addDistraction, activeTaskId } = useAppContext();
  const [description, setDescription] = useState('');
  const [type, setType] = useState('internal');

  const activeDistractions = distractions.filter(d => d.taskId === activeTaskId);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!description.trim() || !activeTaskId) return;

    const newDistraction = {
      id: crypto.randomUUID(),
      taskId: activeTaskId,
      timestamp: new Date().toISOString(),
      description,
      type
    };

    addDistraction(newDistraction);
    setDescription('');
  };

  return (
    <div className="bg-[#12121A] border border-[#2A2A3D] rounded-xl flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-[#2A2A3D] flex items-center justify-between bg-[#1A1A26]">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-[#7C6EFF]" />
          <h2 className="text-sm font-bold text-[#F0F0FF] uppercase tracking-wider">Distraction Log</h2>
        </div>
        <span className="mono text-[10px] bg-[#2A2A3D] text-[#8A8AA8] px-2 py-0.5 rounded-full">
          {activeDistractions.length} COUNT
        </span>
      </div>

      <form onSubmit={handleAdd} className="p-4 border-b border-[#2A2A3D] bg-[#0A0A0F]/50 flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!activeTaskId}
            placeholder={activeTaskId ? "Log a distraction..." : "Select a task first"}
            className="flex-1 bg-[#1A1A26] border border-[#2A2A3D] rounded-lg px-3 py-1.5 text-xs text-[#F0F0FF] focus:outline-none focus:border-[#7C6EFF] transition-all duration-200"
          />
          <button
            type="submit"
            disabled={!activeTaskId || !description.trim()}
            className="bg-[#7C6EFF] text-white p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex gap-2">
          {['internal', 'external'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-1 rounded text-[10px] font-bold uppercase tracking-tight transition-all duration-200 border ${
                type === t 
                  ? 'bg-[#1A1A26] text-[#7C6EFF] border-[#7C6EFF]' 
                  : 'bg-transparent text-[#4A4A6A] border-transparent hover:text-[#8A8AA8]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </form>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 max-h-[250px]">
        {activeDistractions.map((d) => (
          <div key={d.id} className="flex items-start gap-3 group">
            <span className="mono text-[9px] text-[#4A4A6A] mt-0.5 shrink-0">
              {new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            {d.type === 'internal' ? (
              <ShieldAlert size={12} className="text-[#FF6B6B] shrink-0 mt-0.5" />
            ) : (
              <ExternalLink size={12} className="text-[#4ECDC4] shrink-0 mt-0.5" />
            )}
            <p className="text-[11px] text-[#8A8AA8] leading-normal break-words group-hover:text-[#F0F0FF] transition-colors duration-200">
              {d.description}
            </p>
          </div>
        ))}
        {activeDistractions.length === 0 && (
          <div className="text-center py-8 text-[#4A4A6A] italic text-xs">
            No distractions logged. Keep it that way.
          </div>
        )}
      </div>
    </div>
  );
};

export default DistractionLog;
