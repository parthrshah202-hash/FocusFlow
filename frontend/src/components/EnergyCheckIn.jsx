import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { generatePlan } from '../api/client';

const ENERGY_OPTIONS = [
  {
    level: 'high', emoji: '🔋', label: 'High Energy',
    desc: "I'm ready to tackle hard tasks first",
    border: 'border-emerald-500/40', activeBorder: 'border-emerald-400',
    activeBg: 'bg-emerald-500/10', text: 'text-emerald-400',
  },
  {
    level: 'medium', emoji: '⚡', label: 'Medium Energy',
    desc: 'Steady pace — balanced task flow',
    border: 'border-amber-500/40', activeBorder: 'border-amber-400',
    activeBg: 'bg-amber-500/10', text: 'text-amber-400',
  },
  {
    level: 'low', emoji: '😴', label: 'Low Energy',
    desc: 'Ease me in — start with lighter tasks',
    border: 'border-blue-500/40', activeBorder: 'border-blue-400',
    activeBg: 'bg-blue-500/10', text: 'text-blue-400',
  },
];

const EnergyCheckIn = () => {
  const { tasks, energyLevel, setEnergyLevel, setPlan, setCurrentView } = useContext(AppContext);
  const [availableMinutes, setAvailableMinutes] = useState(120);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStartPlanning = async () => {
    if (!energyLevel) { setError('Please select your energy level first'); return; }
    setError(null);
    setLoading(true);
    try {
      const plan = await generatePlan(tasks, energyLevel, Number(availableMinutes));
      setPlan(plan);
      setCurrentView('timer');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to generate plan. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#12122a] to-[#0a0a1a] flex items-center justify-center p-6">
      <div className="w-full max-w-xl animate-fadeInUp">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-violet-400 text-xs font-semibold uppercase tracking-widest">Step 2 of 3</span>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">How's Your Energy?</h1>
          <p className="text-slate-400 text-sm">AI will tailor your session plan based on your current energy</p>
        </div>

        <div className="space-y-3 mb-6">
          {ENERGY_OPTIONS.map((opt) => (
            <button
              key={opt.level}
              id={`energy-${opt.level}-btn`}
              onClick={() => { setEnergyLevel(opt.level); setError(null); }}
              className={`w-full border ${energyLevel === opt.level ? opt.activeBorder + ' ' + opt.activeBg + ' scale-[1.02]' : opt.border + ' bg-white/3'} rounded-2xl p-4 text-left transition-all duration-200 hover:scale-[1.01]`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{opt.emoji}</span>
                <div>
                  <p className={`font-semibold text-sm ${energyLevel === opt.level ? opt.text : 'text-white'}`}>{opt.label}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{opt.desc}</p>
                </div>
                {energyLevel === opt.level && (
                  <div className="ml-auto w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="glass rounded-2xl p-5 mb-6">
          <label className="block text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">⏱ Available Time</label>
          <div className="flex items-center gap-4">
            <input
              id="available-minutes-input"
              type="number" min="25" max="600" step="25"
              value={availableMinutes}
              onChange={(e) => setAvailableMinutes(e.target.value)}
              className="w-28 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
            />
            <span className="text-slate-400 text-sm">minutes</span>
            <span className="text-slate-500 text-xs ml-auto">≈ {Math.floor(availableMinutes / 25)} pomodoros</span>
          </div>
          <div className="flex gap-2 mt-3">
            {[60, 90, 120, 180].map((m) => (
              <button key={m} id={`time-preset-${m}`} onClick={() => setAvailableMinutes(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${availableMinutes === m ? 'bg-indigo-500/30 border border-indigo-500/50 text-indigo-300' : 'bg-white/5 border border-white/10 text-slate-500 hover:text-slate-300'}`}>
                {m}m
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 animate-fadeInUp">
            <span className="text-red-400">⚠</span>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="mb-4 px-4 py-3 bg-white/3 border border-white/5 rounded-xl">
          <p className="text-slate-400 text-xs">🍅 Planning <span className="text-white font-semibold">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span> with Gemini 2.0 Flash AI</p>
        </div>

        <button
          id="start-planning-btn"
          onClick={handleStartPlanning}
          disabled={loading || !energyLevel}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-3 ${!loading && energyLevel ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 hover:scale-[1.01]' : 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'}`}
        >
          {loading ? (
            <><svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Generating Plan...</>
          ) : (
            <><span>✨</span>Start Planning with AI</>
          )}
        </button>

        <button id="back-to-tasks-btn" onClick={() => setCurrentView('input')}
          className="w-full mt-3 py-3 text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors">
          ← Back to tasks
        </button>
      </div>
    </div>
  );
};

export default EnergyCheckIn;
