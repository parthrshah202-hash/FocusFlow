import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateSummary } from '../api/client';
import { Loader2, MessageSquare, RotateCcw, TrendingUp, Target, Brain } from 'lucide-react';

const SessionSummary = () => {
  const { sessionLog, distractions, focusScore, setCurrentView } = useAppContext();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const totalDistractions = distractions.length;
        const avgMood = sessionLog.reduce((acc, s) => acc + s.moodAfter, 0) / sessionLog.length;
        
        const data = await generateSummary(sessionLog, totalDistractions, avgMood, focusScore);
        setSummary(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionLog.length > 0) {
      fetchSummary();
    } else {
      setLoading(false);
    }
  }, [sessionLog, distractions, focusScore]);

  const handleStartOver = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
        <Loader2 className="text-[#7C6EFF] animate-spin" size={48} />
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-bold text-[#F0F0FF]">Analyzing your session...</h2>
          <p className="text-[#8A8AA8]">Extracting insights from your focus patterns.</p>
        </div>
      </div>
    );
  }

  if (sessionLog.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6 animate-in fade-in duration-500">
        <div className="w-20 h-20 rounded-full bg-[#1A1A26] border border-[#2A2A3D] flex items-center justify-center text-[#4A4A6A]">
          <PieChart size={40} />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#F0F0FF]">No sessions completed yet</h2>
          <p className="text-[#8A8AA8] mt-2 max-w-xs">Complete a focus session with the timer to see your productivity analysis here.</p>
        </div>
        <button
          onClick={() => setCurrentView('input')}
          className="bg-[#7C6EFF] text-white px-8 py-3 rounded-lg font-bold hover:shadow-[0_0_16px_rgba(124,110,255,0.4)] transition-all"
        >
          Plan a Task
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-[#FF6B6B] font-medium">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-[#1A1A26] border border-[#2A2A3D] rounded-lg text-[#F0F0FF] hover:border-[#7C6EFF]"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 pb-12 animate-in fade-in duration-700">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-[#F0F0FF]">Session Complete</h1>
        <p className="text-[#8A8AA8] mt-2 italic">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>

      <div className="flex justify-center">
        <div className="w-28 h-28 bg-[#7C6EFF]/10 border-2 border-[#7C6EFF] rounded-2xl flex flex-col items-center justify-center shadow-[0_0_30px_rgba(124,110,255,0.2)]">
          <span className="text-5xl font-bold text-[#7C6EFF]">{summary?.focusRating || 'B'}</span>
          <span className="text-[10px] font-bold text-[#7C6EFF] mt-1 tracking-[0.2em]">GRADE</span>
        </div>
      </div>

      <div className="bg-[#12121A] border border-[#2A2A3D] rounded-xl p-8 shadow-inner">
        <p className="text-lg text-[#F0F0FF] leading-relaxed font-medium">
          {summary?.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summary?.insights.map((insight, idx) => {
          const Icons = [TrendingUp, Target, Brain];
          const Icon = Icons[idx] || Brain;
          return (
            <div key={idx} className="bg-[#1A1A26] border border-[#2A2A3D] rounded-xl p-6 flex flex-col gap-4 transition-all duration-300 hover:border-[#7C6EFF]/40 group">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-[#7C6EFF]/10 flex items-center justify-center group-hover:bg-[#7C6EFF]/20 transition-colors">
                  <Icon size={20} className="text-[#7C6EFF]" />
                </div>
                <span className="mono text-xs text-[#4A4A6A]">0{idx + 1}</span>
              </div>
              <p className="text-sm text-[#F0F0FF] leading-relaxed">
                {insight}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-[#12121A] border-l-4 border-[#4ECDC4] p-6 rounded-r-xl">
        <span className="mono text-[10px] font-bold text-[#4ECDC4] tracking-[0.3em] uppercase">Tomorrow's Suggestion</span>
        <p className="text-[#F0F0FF] mt-2 font-medium">
          {summary?.tomorrowSuggestion}
        </p>
      </div>

      <div className="bg-[#12121A] border border-[#2A2A3D] rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#1A1A26] text-[#8A8AA8] border-b border-[#2A2A3D]">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Task</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Est.</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Actual</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Diff</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Dist.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A3D]">
            {sessionLog.map((log, idx) => {
              const diff = log.actualPomodoros - log.estimatedPomodoros;
              const diffColor = diff <= 0 ? 'text-[#4ECDC4]' : 'text-[#FF6B6B]';
              return (
                <tr key={idx} className="hover:bg-[#1A1A26]/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#F0F0FF]">{log.taskName}</td>
                  <td className="px-6 py-4 mono">{log.estimatedPomodoros}</td>
                  <td className="px-6 py-4 mono">{log.actualPomodoros}</td>
                  <td className={`px-6 py-4 mono font-bold ${diffColor}`}>
                    {diff > 0 ? `+${diff}` : diff}
                  </td>
                  <td className="px-6 py-4 mono">{log.distractions?.length || 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setCurrentView('coach')}
          className="flex-1 bg-[#1A1A26] border border-[#2A2A3D] text-[#F0F0FF] font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 hover:border-[#7C6EFF] hover:bg-[#1A1A26]"
        >
          <MessageSquare size={20} className="text-[#7C6EFF]" />
          Chat with Coach
        </button>
        <button
          onClick={handleStartOver}
          className="flex-1 bg-[#1A1A26] border border-[#2A2A3D] text-[#FF6B6B] font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 hover:border-[#FF6B6B] hover:bg-[#FF6B6B]/10"
        >
          <RotateCcw size={20} />
          Start Over
        </button>
      </div>
    </div>
  );
};

export default SessionSummary;
