import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Zap, BatteryMedium, BatteryLow, Loader2 } from 'lucide-react';
import { generatePlan } from '../api/client';

const EnergyCheckIn = () => {
  const { 
    energyLevel, setEnergyLevel, 
    preferredMode, setPreferredMode,
    tasks, moodScore, setPlan, setCurrentView 
  } = useAppContext();
  
  const [availableMinutes, setAvailableMinutes] = useState(120);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const energyOptions = [
    { id: 'high', title: 'High', desc: 'Ready to do your hardest work. Deep focus recommended.', icon: Zap },
    { id: 'medium', title: 'Medium', desc: 'Solid, but pacing helps. Balanced sessions advised.', icon: BatteryMedium },
    { id: 'low', title: 'Low', desc: 'Conserve. Tackle lighter tasks. Short bursts only.', icon: BatteryLow },
  ];

  const handleStartPlanning = async () => {
    setLoading(true);
    setError(null);
    try {
      const planData = await generatePlan(tasks, energyLevel, availableMinutes, moodScore, preferredMode);
      setPlan(planData);
      setCurrentView('timer');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#12121A] border border-[#2A2A3D] rounded-xl p-8 flex flex-col gap-8 animate-in slide-in-from-bottom duration-500 delay-150">
      <div>
        <h2 className="text-2xl font-bold text-[#F0F0FF]">Energy + Mode</h2>
        <p className="text-[#8A8AA8] mt-1">Help the AI optimize your schedule.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {energyOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              onClick={() => setEnergyLevel(opt.id)}
              className={`flex flex-col gap-3 p-5 rounded-xl border text-left transition-all duration-200 ${
                energyLevel === opt.id 
                  ? 'border-[#7C6EFF] bg-[#1A1A26] shadow-[0_0_16px_rgba(124,110,255,0.15)]' 
                  : 'border-[#2A2A3D] bg-[#12121A] hover:border-[#4A4A6A]'
              }`}
            >
              <Icon size={24} className={energyLevel === opt.id ? 'text-[#7C6EFF]' : 'text-[#8A8AA8]'} />
              <div>
                <h3 className={`font-bold ${energyLevel === opt.id ? 'text-[#F0F0FF]' : 'text-[#8A8AA8]'}`}>{opt.title}</h3>
                <p className="text-xs text-[#8A8AA8] mt-1 leading-relaxed">{opt.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-[#8A8AA8]">Preferred session length</label>
          <div className="flex bg-[#1A1A26] border border-[#2A2A3D] rounded-lg p-1">
            {['25/5', '50/10', '90/15'].map((mode) => (
              <button
                key={mode}
                onClick={() => setPreferredMode(mode)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  preferredMode === mode 
                    ? 'bg-[#7C6EFF] text-white shadow-sm' 
                    : 'text-[#8A8AA8] hover:text-[#F0F0FF]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-[#8A8AA8]">How long do you have?</label>
          <div className="relative">
            <input
              type="number"
              min="25"
              max="480"
              value={availableMinutes}
              onChange={(e) => setAvailableMinutes(parseInt(e.target.value))}
              className="w-full bg-[#1A1A26] border border-[#2A2A3D] rounded-lg px-4 py-2.5 text-[#F0F0FF] focus:outline-none focus:border-[#7C6EFF] transition-all duration-200"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A4A6A] text-sm">min</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-4 border-t border-[#2A2A3D]">
        <button
          onClick={handleStartPlanning}
          disabled={loading}
          className="w-full bg-[#7C6EFF] hover:bg-[#6B5DFF] text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-[0_0_24px_rgba(124,110,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Generating plan...
            </>
          ) : (
            'Start Planning'
          )}
        </button>
        {error && (
          <p className="text-[#FF6B6B] text-center text-sm font-medium">{error}</p>
        )}
      </div>
    </div>
  );
};

export default EnergyCheckIn;
