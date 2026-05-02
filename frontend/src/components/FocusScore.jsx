import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useFocusScore } from '../hooks/useFocusScore';

const FocusScore = () => {
  const { sessionLog, distractions, setFocusScore } = useAppContext();
  const { focusScore, updateScore } = useFocusScore();

  useEffect(() => {
    updateScore(sessionLog, distractions);
  }, [sessionLog, distractions, updateScore]);

  useEffect(() => {
    setFocusScore(focusScore);
  }, [focusScore, setFocusScore]);

  const getScoreColor = (s) => {
    if (s > 70) return 'text-[#4ECDC4]';
    if (s > 40) return 'text-[#7C6EFF]';
    return 'text-[#FF6B6B]';
  };

  const getBarColor = (s) => {
    if (s > 70) return 'bg-[#4ECDC4]';
    if (s > 40) return 'bg-[#7C6EFF]';
    return 'bg-[#FF6B6B]';
  };

  const totalPomodoros = sessionLog.reduce((acc, s) => acc + s.actualPomodoros, 0);
  const avgMood = sessionLog.length > 0 
    ? (sessionLog.reduce((acc, s) => acc + s.moodAfter, 0) / sessionLog.length).toFixed(1)
    : 0;

  return (
    <div className="bg-[#12121A] border border-[#2A2A3D] rounded-xl p-8 flex flex-col items-center gap-4 animate-in fade-in duration-700">
      <div className="flex flex-col items-center">
        <span className={`mono text-7xl font-bold transition-colors duration-500 ${getScoreColor(focusScore)}`}>
          {focusScore}
        </span>
        <span className="text-sm font-bold text-[#8A8AA8] uppercase tracking-widest mt-2">Focus Score</span>
      </div>

      <div className="w-full bg-[#2A2A3D] h-1.5 rounded-full mt-4 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${getBarColor(focusScore)}`}
          style={{ width: `${focusScore}%` }}
        />
      </div>

      <div className="grid grid-cols-3 w-full mt-6 divide-x divide-[#2A2A3D]">
        <div className="flex flex-col items-center gap-1">
          <span className="mono text-lg font-bold text-[#F0F0FF]">{distractions.length}</span>
          <span className="text-[10px] text-[#8A8AA8] uppercase">Distractions</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="mono text-lg font-bold text-[#F0F0FF]">{totalPomodoros}</span>
          <span className="text-[10px] text-[#8A8AA8] uppercase">Pomodoros</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="mono text-lg font-bold text-[#F0F0FF]">{avgMood}/5</span>
          <span className="text-[10px] text-[#8A8AA8] uppercase">Avg Mood</span>
        </div>
      </div>
    </div>
  );
};

export default FocusScore;
