
import React, { useState } from 'react';
import { Task, TaskStatus, Subject } from '../types';
import { SUBJECT_ICONS, SUBJECT_COLORS } from '../constants';
import { Trash2, CheckCircle2, Circle, Calendar, Plus, Edit2, Save } from 'lucide-react';
import { generateId } from '../services/storageService';
import { getTodayJalali, toPersianDigits } from '../services/dateUtils';

interface TaskListProps {
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdateTasks }) => {
  const [filter, setFilter] = useState<'ALL' | 'TODO' | 'DONE'>('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState<Subject>(Subject.MATH);
  const [taskDate, setTaskDate] = useState(getTodayJalali());
  
  const resetForm = () => {
    setTaskTitle('');
    setTaskSubject(Subject.MATH);
    setTaskDate(getTodayJalali());
    setEditingTaskId(null);
    setIsFormOpen(false);
  };

  const startEdit = (task: Task) => {
    setTaskTitle(task.title);
    setTaskSubject(task.subject);
    setTaskDate(task.dueDate);
    setEditingTaskId(task.id);
    setIsFormOpen(true);
    // Scroll to top or form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    if (editingTaskId) {
      // Update existing
      const updatedTasks = tasks.map(t => 
        t.id === editingTaskId 
          ? { ...t, title: taskTitle, subject: taskSubject, dueDate: taskDate } 
          : t
      );
      onUpdateTasks(updatedTasks);
    } else {
      // Create new
      const task: Task = {
        id: generateId(),
        title: taskTitle,
        subject: taskSubject,
        dueDate: taskDate,
        status: TaskStatus.TODO,
        tags: [],
        createdAt: Date.now(),
      };
      onUpdateTasks([...tasks, task]);
    }
    resetForm();
  };

  const toggleStatus = (id: string) => {
    const updated = tasks.map(t => 
      t.id === id ? { ...t, status: t.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE } : t
    );
    onUpdateTasks(updated);
  };

  const deleteTask = (id: string) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این کار را حذف کنید؟')) {
      onUpdateTasks(tasks.filter(t => t.id !== id));
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'DONE') return t.status === TaskStatus.DONE;
    if (filter === 'TODO') return t.status !== TaskStatus.DONE;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">کارهای من</h2>
        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'ALL' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            همه
          </button>
          <button 
            onClick={() => setFilter('TODO')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'TODO' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            انجام‌نشده
          </button>
          <button 
            onClick={() => setFilter('DONE')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'DONE' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            انجام‌شده
          </button>
        </div>
      </div>

      {/* Add/Edit Task Button/Form */}
      {!isFormOpen ? (
        <button 
          onClick={() => setIsFormOpen(true)}
          className="w-full py-4 border-2 border-dashed border-indigo-300 dark:border-slate-600 rounded-xl text-indigo-500 dark:text-slate-400 font-medium hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          <Plus />
          افزودن کار جدید
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-indigo-100 dark:border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400 font-bold">
            {editingTaskId ? <Edit2 size={20} /> : <Plus size={20} />}
            {editingTaskId ? 'ویرایش کار' : 'افزودن کار جدید'}
          </div>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">عنوان کار</label>
              <input 
                type="text" 
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="مثلاً: حل تمرین صفحه ۴۲"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">درس</label>
                <select 
                  value={taskSubject}
                  onChange={(e) => setTaskSubject(e.target.value as Subject)}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none"
                >
                  {Object.values(Subject).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تاریخ (شمسی)</label>
                <input 
                  type="text"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  placeholder="1403/02/15"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white outline-none ltr text-right"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-md flex justify-center items-center gap-2">
                {editingTaskId ? <Save size={18} /> : <Plus size={18} />}
                {editingTaskId ? 'بروزرسانی' : 'ذخیره'}
              </button>
              <button type="button" onClick={resetForm} className="px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition">
                لغو
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 text-gray-400 dark:text-gray-500">
            <p>هیچ کاری در این لیست نیست! 🎉</p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const Icon = SUBJECT_ICONS[task.subject] || Circle;
            const isDone = task.status === TaskStatus.DONE;
            
            return (
              <div key={task.id} className={`group bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4 transition-all hover:shadow-md ${isDone ? 'opacity-60 bg-gray-50 dark:bg-slate-800/50' : ''}`}>
                <button 
                  onClick={() => toggleStatus(task.id)}
                  className={`shrink-0 transition-all duration-300 ${isDone ? 'text-green-500 scale-110' : 'text-gray-300 dark:text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400'}`}
                >
                  {isDone ? <CheckCircle2 size={28} fill="currentColor" className="text-white bg-green-500 rounded-full" /> : <Circle size={28} />}
                </button>
                
                <div className="flex-1 min-w-0" onDoubleClick={() => startEdit(task)}>
                  <div className="flex flex-wrap gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium flex items-center gap-1 ${SUBJECT_COLORS[task.subject]} dark:brightness-110`}>
                      <Icon size={12} />
                      {task.subject}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1 bg-gray-50 dark:bg-slate-700 dark:text-slate-400 px-2 rounded-md">
                      <Calendar size={12} />
                      {toPersianDigits(task.dueDate)}
                    </span>
                  </div>
                  <h3 className={`font-bold text-gray-800 dark:text-gray-200 truncate ${isDone ? 'line-through decoration-gray-400 dark:decoration-slate-500' : ''}`}>
                    {task.title}
                  </h3>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  <button 
                    onClick={() => startEdit(task)}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TaskList;
