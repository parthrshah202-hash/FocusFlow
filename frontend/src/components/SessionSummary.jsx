import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { generateSummary } from '../api/client';
import { clearAll } from '../utils/storage';

const InsightCard = ({ text, index }) => {
  const icons = ['💡', '📈', '🎯'];
  const colors = [
    'from-indigo-500/20 to-indigo-600/5 border-indigo-500/30',
    'from-violet-500/20 to-violet-600/5 border-violet-500/30',
    'from-sky-500/20 to-sky-600/5 border-sky-500/30',
  ];
  return (
    <div className={`bg-gradient-to-br ${colors[index % 3]} border rounded-xl p-4 animate-fadeInUp`} style={{ animationDelay: `${index * 100}ms` }}>
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">{icons[index % 3]}</span>
        <p className="text-slate-300 text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
};

const SessionSummary = () => {
  const { tasks, sessionLog, setCurrentView } = useContext(AppContext);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!sessionLog || sessionLog.length === 0) {
        setLoading(false);
        return;
      }
      try {
        const result = await generateSummary(sessionLog);
        setSummary(result);
      } catch (err) {
        setError(err?.response?.data?.detail || 'Could not generate summary. Backend may be offline.');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const handleStartOver = () => {
    clearAll();
    window.location.reload();
  };

  // Build table rows from sessionLog + tasks map
  const taskMap = Object.fromEntries(tasks.map((t) => [t.id, t]));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#12122a] to-[#0a0a1a] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl animate-fadeInUp">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎉</div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Session Complete!</h1>
          <p className="text-slate-400 text-sm">Here's your AI-powered reflection for today</p>
        </div>

        {loading && (
          <div className="glass rounded-2xl p-10 flex flex-col items-center gap-4 mb-6">
            <svg className="animate-spin w-8 h-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <p className="text-slate-400 text-sm">Generating your personalized insights...</p>
          </div>
        )}

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2">
            <span className="text-red-400">⚠</span>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {!loading && summary && (
          <>
            {/* AI Summary */}
            <div className="glass rounded-2xl p-6 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🤖</span>
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">AI Reflection</h2>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed">{summary.summary}</p>
            </div>

            {/* Insights */}
            {summary.insights && summary.insights.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">Key Insights</h3>
                <div className="space-y-3">
                  {summary.insights.map((insight, i) => (
                    <InsightCard key={i} text={insight} index={i} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!loading && sessionLog && sessionLog.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>📊</span> Session Breakdown
            </h3>
            <div className="overflow-hidden rounded-xl border border-white/5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Task</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Est.</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actual</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Diff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sessionLog.map((session, i) => {
                    const diff = session.actualPomodoros - session.estimatedPomodoros;
                    return (
                      <tr key={session.taskId || i} className="hover:bg-white/3 transition-colors">
                        <td className="px-4 py-3 text-slate-200 font-medium max-w-[200px] truncate">{session.taskName}</td>
                        <td className="px-4 py-3 text-center text-slate-400">🍅 {session.estimatedPomodoros}</td>
                        <td className="px-4 py-3 text-center text-slate-200">🍅 {session.actualPomodoros}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${diff > 0 ? 'bg-red-500/20 text-red-400' : diff < 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                            {diff > 0 ? `+${diff}` : diff === 0 ? '±0' : diff}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && (!sessionLog || sessionLog.length === 0) && (
          <div className="glass rounded-2xl p-8 text-center mb-6">
            <p className="text-slate-500 text-sm">No session data recorded yet.</p>
          </div>
        )}

        <button
          id="start-over-btn"
          onClick={handleStartOver}
          className="w-full py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <span>🔄</span> Start Over
        </button>
      </div>
    </div>
  );
};

export default SessionSummary;
