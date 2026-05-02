import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { sendCoachMessage } from '../api/client';
import { Send, Bot, User, Trash2, Loader2, Calendar, FastForward, Coffee } from 'lucide-react';

const CoachChat = () => {
  const { 
    coachHistory, addToCoachHistory, setCoachHistory,
    tasks, setTasks, sessionLog, focusScore, energyLevel, activeTaskId
  } = useAppContext();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const activeTask = tasks.find(t => t.id === activeTaskId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [coachHistory, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    addToCoachHistory(userMessage);
    setInput('');
    setLoading(true);

    try {
      const context = {
        tasks,
        sessionLog,
        focusScore,
        energyLevel,
        currentTask: activeTask ? activeTask.name : null
      };

      const response = await sendCoachMessage(input, context);
      
      const coachMessage = { 
        role: 'coach', 
        content: response.reply,
        action: response.action,
        actionPayload: response.actionPayload
      };
      
      addToCoachHistory(coachMessage);
    } catch (err) {
      addToCoachHistory({ role: 'coach', content: "Sorry, I'm having trouble connecting to my brain right now." });
    } finally {
      setLoading(false);
    }
  };

  const executeAction = (action, payload) => {
    switch (action) {
      case 'skip_task':
        if (activeTaskId) {
          setTasks(tasks.map(t => t.id === activeTaskId ? { ...t, status: 'done' } : t));
          addToCoachHistory({ role: 'coach', content: "Done! I've marked that task as skipped/complete for you." });
        }
        break;
      case 'reschedule':
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        
        const taskId = payload?.taskId || activeTaskId;
        if (taskId) {
          setTasks(tasks.map(t => t.id === taskId ? { ...t, deadline: dateStr } : t));
          addToCoachHistory({ role: 'coach', content: `Understood. I've rescheduled that task to ${dateStr}.` });
        }
        break;
      case 'take_break':
        addToCoachHistory({ role: 'coach', content: "Great idea. Take a few minutes to recharge. I'll be here." });
        // In a real app, this would trigger the timer's skip() function via context or a dedicated hook
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] animate-in fade-in duration-500">
      <header className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#F0F0FF]">FocusFlow Coach</h1>
            <span className="text-[10px] font-bold bg-[#7C6EFF]/20 text-[#7C6EFF] px-2 py-0.5 rounded border border-[#7C6EFF]/30 uppercase tracking-widest">AI</span>
          </div>
          <p className="text-[#8A8AA8] text-sm mt-1">Ask me anything about your session, tasks, or focus.</p>
        </div>
        <button 
          onClick={() => setCoachHistory([])}
          className="p-2 text-[#4A4A6A] hover:text-[#FF6B6B] transition-colors"
          title="Clear conversation"
        >
          <Trash2 size={18} />
        </button>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto mb-6 pr-4 flex flex-col gap-4"
      >
        {coachHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 opacity-50">
            <Bot size={48} className="text-[#7C6EFF]" />
            <p className="text-[#8A8AA8] max-w-xs">
              "How's the work going? I can help you reschedule tasks, plan breaks, or analyze your focus patterns."
            </p>
          </div>
        )}

        {coachHistory.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 ${
                msg.role === 'user' ? 'bg-[#7C6EFF]/20' : 'bg-[#1A1A26] border border-[#2A2A3D]'
              }`}>
                {msg.role === 'user' ? <User size={16} className="text-[#7C6EFF]" /> : <Bot size={16} className="text-[#7C6EFF]" />}
              </div>
              
              <div className="flex flex-col gap-3">
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#7C6EFF] text-white rounded-tr-none shadow-[0_4px_12px_rgba(124,110,255,0.2)]' 
                    : 'bg-[#1A1A26] border border-[#2A2A3D] text-[#F0F0FF] rounded-tl-none'
                }`}>
                  {msg.content}
                </div>

                {msg.role === 'coach' && msg.action && (
                  <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-left duration-500">
                    {msg.action === 'skip_task' && (
                      <button 
                        onClick={() => executeAction('skip_task')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A26] border border-[#7C6EFF]/50 text-[#7C6EFF] text-xs font-bold rounded-lg hover:bg-[#7C6EFF]/10 transition-colors"
                      >
                        <FastForward size={14} />
                        Skip Task
                      </button>
                    )}
                    {msg.action === 'reschedule' && (
                      <button 
                        onClick={() => executeAction('reschedule', msg.actionPayload)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A26] border border-[#7C6EFF]/50 text-[#7C6EFF] text-xs font-bold rounded-lg hover:bg-[#7C6EFF]/10 transition-colors"
                      >
                        <Calendar size={14} />
                        Reschedule to Tomorrow
                      </button>
                    )}
                    {msg.action === 'take_break' && (
                      <button 
                        onClick={() => executeAction('take_break')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A26] border border-[#4ECDC4]/50 text-[#4ECDC4] text-xs font-bold rounded-lg hover:bg-[#4ECDC4]/10 transition-colors"
                      >
                        <Coffee size={14} />
                        Start Break
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#1A1A26] border border-[#2A2A3D] p-4 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#7C6EFF] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-[#7C6EFF] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-[#7C6EFF] rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <form 
        onSubmit={handleSend}
        className="bg-[#12121A] border border-[#2A2A3D] rounded-2xl p-2 flex items-center gap-2 focus-within:border-[#7C6EFF] transition-colors"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask FocusFlow Coach..."
          className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm text-[#F0F0FF] placeholder-[#4A4A6A]"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-10 h-10 bg-[#7C6EFF] text-white rounded-xl flex items-center justify-center hover:bg-[#6B5DFF] transition-all duration-200 disabled:opacity-30"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
};

export default CoachChat;
