import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const PRIORITIES = ['high', 'medium', 'low'];

const PRIORITY_COLORS = {
  high: 'bg-red-500/20 text-red-400 border-red-500/40',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
  low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
};

const PRIORITY_DOT = {
  high: 'bg-red-400',
  medium: 'bg-amber-400',
  low: 'bg-emerald-400',
};

const emptyForm = {
  name: '',
  deadline: '',
  estimatedPomodoros: 2,
  priority: 'medium',
};

const TaskInput = () => {
  const { tasks, setTasks, setCurrentView } = useContext(AppContext);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Task name is required';
    if (!form.deadline) e.deadline = 'Deadline is required';
    if (form.estimatedPomodoros < 1 || form.estimatedPomodoros > 12)
      e.estimatedPomodoros = 'Must be between 1 and 12';
    return e;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }

    const newTask = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      deadline: form.deadline,
      estimatedPomodoros: Number(form.estimatedPomodoros),
      priority: form.priority,
      completedPomodoros: 0,
      status: 'pending',
    };

    setTasks([...tasks, newTask]);
    setForm(emptyForm);
    setErrors({});
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#12122a] to-[#0a0a1a] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl animate-fadeInUp">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest">FocusFlow</span>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Plan Your Day</h1>
          <p className="text-slate-400 text-sm">Add your tasks and let AI create the perfect focus plan</p>
        </div>

        {/* Form Card */}
        <div className={`glass rounded-2xl p-6 mb-6 ${shake ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}>
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-xs">+</span>
            Add Task
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Task Name */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                Task Name
              </label>
              <input
                id="task-name-input"
                type="text"
                placeholder="e.g., Complete the ML assignment"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full bg-white/5 border ${errors.name ? 'border-red-500/60' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all duration-200`}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Row: Deadline + Pomodoros */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                  Deadline
                </label>
                <input
                  id="task-deadline-input"
                  type="date"
                  min={today}
                  value={form.deadline}
                  onChange={(e) => handleChange('deadline', e.target.value)}
                  className={`w-full bg-white/5 border ${errors.deadline ? 'border-red-500/60' : 'border-white/10'} rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all duration-200 [color-scheme:dark]`}
                />
                {errors.deadline && (
                  <p className="text-red-400 text-xs mt-1">{errors.deadline}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                  Pomodoros (1–12)
                </label>
                <input
                  id="task-pomodoros-input"
                  type="number"
                  min="1"
                  max="12"
                  value={form.estimatedPomodoros}
                  onChange={(e) => handleChange('estimatedPomodoros', e.target.value)}
                  className={`w-full bg-white/5 border ${errors.estimatedPomodoros ? 'border-red-500/60' : 'border-white/10'} rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all duration-200`}
                />
                {errors.estimatedPomodoros && (
                  <p className="text-red-400 text-xs mt-1">{errors.estimatedPomodoros}</p>
                )}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                Priority
              </label>
              <div className="flex gap-3">
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    id={`priority-${p}-btn`}
                    type="button"
                    onClick={() => handleChange('priority', p)}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium capitalize transition-all duration-200 ${
                      form.priority === p
                        ? PRIORITY_COLORS[p] + ' scale-105'
                        : 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'
                    }`}
                  >
                    <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${form.priority === p ? PRIORITY_DOT[p] : 'bg-slate-600'}`} />
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              id="add-task-btn"
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-semibold rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2 mt-2"
            >
              <span className="text-lg leading-none">+</span> Add Task
            </button>
          </form>
        </div>

        {/* Task List */}
        {tasks.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-6 animate-fadeInUp">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
              Added Tasks ({tasks.length})
            </h3>
            <ul className="space-y-3">
              {tasks.map((task, i) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between bg-white/3 rounded-xl px-4 py-3 border border-white/5 hover:border-white/10 transition-all duration-200 animate-slideIn"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{task.name}</p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      📅 {task.deadline} &nbsp;·&nbsp; 🍅 {task.estimatedPomodoros} pomodoros
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-3 flex-shrink-0">
                    <span className={`text-xs font-medium capitalize px-2.5 py-1 rounded-full border ${PRIORITY_COLORS[task.priority]}`}>
                      {task.priority}
                    </span>
                    <button
                      id={`delete-task-${task.id}`}
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-600 hover:text-red-400 transition-colors duration-200 text-lg leading-none"
                      title="Delete task"
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Plan My Day Button */}
        <button
          id="plan-my-day-btn"
          disabled={tasks.length === 0}
          onClick={() => setCurrentView('checkin')}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-3 ${
            tasks.length > 0
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 hover:scale-[1.01] active:scale-[0.99]'
              : 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
          }`}
        >
          <span>🚀</span>
          Plan My Day
          {tasks.length > 0 && <span className="text-indigo-200 text-sm font-normal">({tasks.length} task{tasks.length !== 1 ? 's' : ''})</span>}
        </button>

        {tasks.length === 0 && (
          <p className="text-center text-slate-600 text-xs mt-3">Add at least 1 task to continue</p>
        )}
      </div>
    </div>
  );
};

export default TaskInput;
