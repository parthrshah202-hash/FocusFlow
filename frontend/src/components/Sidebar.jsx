import React from 'react';
import { useAppContext } from '../context/AppContext';
import { LayoutDashboard, LayoutList, Timer, MessageSquare, PieChart } from 'lucide-react';

const Sidebar = () => {
  const { currentView, setCurrentView, plan, sessionLog, focusScore } = useAppContext();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, disabled: false },
    { id: 'input', label: 'Tasks', icon: LayoutList, disabled: false },
    { id: 'timer', label: 'Timer', icon: Timer, disabled: !plan },
    { id: 'coach', label: 'Coach', icon: MessageSquare, disabled: false },
    { id: 'summary', label: 'Summary', icon: PieChart, disabled: sessionLog.length === 0 },
  ];

  return (
    <aside className="w-[220px] h-full bg-[#12121A] border-r border-[#2A2A3D] flex flex-col py-8 z-10">
      <div className="px-6 mb-8">
        <h1 className="text-xl font-bold text-[#7C6EFF] tracking-tight">FocusFlow</h1>
        <div className="h-[1px] bg-[#2A2A3D] mt-4 w-full" />
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => !item.disabled && setCurrentView(item.id)}
              disabled={item.disabled}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-[#1A1A26] text-[#F0F0FF] border-l-[3px] border-[#7C6EFF] rounded-l-none' 
                  : item.disabled 
                    ? 'opacity-30 cursor-not-allowed' 
                    : 'text-[#8A8AA8] hover:bg-[#1A1A26] hover:text-[#F0F0FF]'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-[#7C6EFF]' : 'group-hover:text-[#F0F0FF]'} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-6 mt-auto">
        <div className="bg-[#1A1A26] border border-[#2A2A3D] rounded-xl p-4 flex flex-col items-center gap-2">
          <div className="relative w-12 h-12">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#2A2A3D"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#4ECDC4"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="125.6"
                style={{ 
                  strokeDashoffset: 125.6 - (125.6 * focusScore) / 100,
                  transition: 'stroke-dashoffset 0.5s ease-out'
                }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="mono text-[10px] font-bold text-[#F0F0FF]">{focusScore}</span>
            </div>
          </div>
          <div className="text-center">
            <span className="text-[10px] font-bold text-[#8A8AA8] uppercase tracking-wider">Focus Score</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
