import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Timer, PieChart, MessageSquare, Zap, Target, Activity } from 'lucide-react';

const Dashboard = () => {
  const { 
    currentView, setCurrentView, 
    plan, sessionLog, 
    focusScore, tasks,
    energyLevel
  } = useAppContext();

  const activeTaskCount = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;
  const completedTaskCount = tasks.filter(t => t.status === 'done').length;

  const stats = [
    { label: 'Active Tasks', value: activeTaskCount, icon: Target, color: 'text-[#7C6EFF]' },
    { label: 'Completed', value: completedTaskCount, icon: Zap, color: 'text-[#4ECDC4]' },
    { label: 'Focus Score', value: `${focusScore}%`, icon: Activity, color: 'text-[#FF6B6B]' },
  ];

  const tools = [
    { 
      id: 'timer', 
      label: 'Focus Timer', 
      desc: 'Start or resume your deep focus session.', 
      icon: Timer, 
      enabled: !!plan,
      color: 'bg-[#7C6EFF]'
    },
    { 
      id: 'summary', 
      label: 'Session Summary', 
      desc: 'Review your progress and AI-generated insights.', 
      icon: PieChart, 
      enabled: sessionLog.length > 0,
      color: 'bg-[#4ECDC4]'
    },
    { 
      id: 'coach', 
      label: 'AI Coach', 
      desc: 'Get advice on overcoming procrastination.', 
      icon: MessageSquare, 
      enabled: true,
      color: 'bg-[#FFB86C]'
    },
  ];

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#F0F0FF]">Dashboard</h1>
          <p className="text-[#8A8AA8] mt-2">Welcome back. Here's your focus overview.</p>
        </div>
        <div className="px-4 py-2 bg-[#1A1A26] border border-[#2A2A3D] rounded-lg text-xs font-bold text-[#7C6EFF] uppercase tracking-wider">
          Energy: {energyLevel || 'Not Set'}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-[#12121A] border border-[#2A2A3D] rounded-2xl p-6 flex items-center gap-5 transition-all hover:border-[#4A4A6A]">
              <div className={`w-12 h-12 rounded-xl bg-[#1A1A26] flex items-center justify-center ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#8A8AA8] uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-bold text-[#F0F0FF] mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold text-[#F0F0FF]">Productivity Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => tool.enabled && setCurrentView(tool.id)}
                disabled={!tool.enabled}
                className={`flex flex-col gap-4 p-6 rounded-2xl border text-left transition-all duration-300 group ${
                  tool.enabled 
                    ? 'bg-[#12121A] border-[#2A2A3D] hover:border-[#7C6EFF] hover:translate-y-[-4px]' 
                    : 'bg-[#0D0D14] border-[#1A1A26] opacity-50 cursor-not-allowed'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg ${tool.color} flex items-center justify-center text-white shadow-lg`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#F0F0FF] group-hover:text-[#7C6EFF] transition-colors">{tool.label}</h3>
                  <p className="text-xs text-[#8A8AA8] mt-2 leading-relaxed">{tool.desc}</p>
                </div>
                {tool.enabled && (
                  <div className="mt-2 text-[10px] font-bold text-[#7C6EFF] uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                    Open Tool →
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {plan && (
        <div className="bg-[#7C6EFF]/5 border border-[#7C6EFF]/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h3 className="text-lg font-bold text-[#F0F0FF]">Active Session Plan</h3>
            <p className="text-sm text-[#8A8AA8]">You have an AI-optimized plan ready. Start your timer to begin.</p>
          </div>
          <button
            onClick={() => setCurrentView('timer')}
            className="bg-[#7C6EFF] hover:bg-[#6B5DFF] text-white font-bold px-8 py-3 rounded-lg flex items-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(124,110,255,0.4)]"
          >
            <Timer size={20} />
            Continue Session
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
