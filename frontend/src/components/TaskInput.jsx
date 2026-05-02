import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Trash2, Plus, ArrowRight } from 'lucide-react';

const TaskInput = () => {
  const { tasks, setTasks, setCurrentView } = useAppContext();
  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);
  const [priority, setPriority] = useState('medium');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');

  const addTask = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newTask = {
      id: crypto.randomUUID(),
      name,
      deadline,
      estimatedPomodoros,
      priority,
      completedPomodoros: 0,
      status: 'pending',
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      notes
    };

    setTasks([...tasks, newTask]);
    setName('');
    setDeadline('');
    setEstimatedPomodoros(1);
    setPriority('medium');
    setTags('');
    setNotes('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case 'high': return 'bg-[#FF6B6B]/15 text-[#FF6B6B] border-[#FF6B6B]/30';
      case 'medium': return 'bg-[#7C6EFF]/15 text-[#7C6EFF] border-[#7C6EFF]/30';
      case 'low': return 'bg-[#4ECDC4]/15 text-[#4ECDC4] border-[#4ECDC4]/30';
      default: return 'bg-[#8A8AA8]/15 text-[#8A8AA8] border-[#8A8AA8]/30';
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-[#F0F0FF]">Plan Your Session</h1>
        <p className="text-[#8A8AA8] mt-2">Add what you need to get done today.</p>
      </header>

      <form onSubmit={addTask} className="bg-[#12121A] border border-[#2A2A3D] rounded-xl p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#8A8AA8]">Task Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What are you working on?"
              className="bg-[#1A1A26] border border-[#2A2A3D] rounded-lg px-4 py-2.5 text-[#F0F0FF] focus:outline-none focus:border-[#7C6EFF] transition-all duration-200"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#8A8AA8]">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="bg-[#1A1A26] border border-[#2A2A3D] rounded-lg px-4 py-2.5 text-[#F0F0FF] focus:outline-none focus:border-[#7C6EFF] transition-all duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#8A8AA8]">Priority</label>
            <div className="flex gap-2">
              {['high', 'medium', 'low'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 rounded-lg capitalize font-medium transition-all duration-200 border ${
                    priority === p 
                      ? 'bg-[#7C6EFF] text-white border-[#7C6EFF] shadow-[0_0_12px_rgba(124,110,255,0.3)]' 
                      : 'bg-[#1A1A26] text-[#8A8AA8] border-[#2A2A3D] hover:border-[#4A4A6A]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#8A8AA8]">Estimated Pomodoros</label>
            <input
              type="number"
              min="1"
              max="12"
              value={estimatedPomodoros}
              onChange={(e) => setEstimatedPomodoros(parseInt(e.target.value))}
              className="bg-[#1A1A26] border border-[#2A2A3D] rounded-lg px-4 py-2.5 text-[#F0F0FF] focus:outline-none focus:border-[#7C6EFF] transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#8A8AA8]">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="coding, research, design..."
            className="bg-[#1A1A26] border border-[#2A2A3D] rounded-lg px-4 py-2.5 text-[#F0F0FF] focus:outline-none focus:border-[#7C6EFF] transition-all duration-200"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#8A8AA8]">Notes (optional)</label>
          <textarea
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional details..."
            className="bg-[#1A1A26] border border-[#2A2A3D] rounded-lg px-4 py-2.5 text-[#F0F0FF] focus:outline-none focus:border-[#7C6EFF] transition-all duration-200 resize-none"
          />
        </div>

        <button
          type="submit"
          className="bg-[#7C6EFF] hover:bg-[#6B5DFF] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-[0_0_16px_rgba(124,110,255,0.4)]"
        >
          <Plus size={20} />
          Add Task
        </button>
      </form>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-[#F0F0FF]">Task List</h2>
        <div className="grid grid-cols-1 gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-[#1A1A26] border border-[#2A2A3D] rounded-xl p-4 flex items-center justify-between transition-all duration-200 hover:border-[#4A4A6A]">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#F0F0FF]">{task.name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#8A8AA8]">
                  <span>{task.deadline || 'No deadline'}</span>
                  <span>{task.estimatedPomodoros} Pomodoro(s)</span>
                </div>
                {task.tags.length > 0 && (
                  <div className="flex gap-2 mt-1">
                    {task.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] bg-[#2A2A3D] text-[#8A8AA8] px-2 py-0.5 rounded-full">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-2 text-[#4A4A6A] hover:text-[#FF6B6B] transition-colors duration-200"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-[#2A2A3D] rounded-xl text-[#4A4A6A]">
              No tasks added yet.
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => setCurrentView('checkin')}
          disabled={tasks.length === 0}
          className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold transition-all duration-200 ${
            tasks.length > 0 
              ? 'bg-[#7C6EFF] text-white hover:shadow-[0_0_16px_rgba(124,110,255,0.4)]' 
              : 'bg-[#1A1A26] text-[#4A4A6A] cursor-not-allowed border border-[#2A2A3D]'
          }`}
        >
          Plan My Day
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default TaskInput;
