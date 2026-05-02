import React from 'react';
import { useAppContext } from '../context/AppContext';

const MoodCheckIn = () => {
  const { moodScore, setMoodScore } = useAppContext();

  const moods = [
    { value: 1, emoji: '😫', label: 'Terrible' },
    { value: 2, emoji: '😕', label: 'Not great' },
    { value: 3, emoji: '😐', label: 'Okay' },
    { value: 4, emoji: '🙂', label: 'Good' },
    { value: 5, emoji: '🚀', label: 'Excellent' },
  ];

  return (
    <div className="bg-[#12121A] border border-[#2A2A3D] rounded-xl p-8 flex flex-col items-center gap-6 animate-in slide-in-from-bottom duration-500">
      <h2 className="text-2xl font-bold text-[#F0F0FF]">How are you feeling right now?</h2>
      <div className="flex gap-4">
        {moods.map((m) => (
          <button
            key={m.value}
            onClick={() => setMoodScore(m.value)}
            className={`w-14 h-14 text-2xl rounded-full flex items-center justify-center transition-all duration-200 border-2 ${
              moodScore === m.value 
                ? 'border-[#7C6EFF] bg-[#1A1A26] shadow-[0_0_16px_rgba(124,110,255,0.3)] scale-110' 
                : 'border-[#2A2A3D] bg-[#1A1A26] hover:border-[#4A4A6A]'
            }`}
          >
            {m.emoji}
          </button>
        ))}
      </div>
      <p className="text-lg font-medium text-[#7C6EFF]">
        {moods.find(m => m.value === moodScore)?.label}
      </p>
    </div>
  );
};

export default MoodCheckIn;
