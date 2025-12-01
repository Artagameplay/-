
import React, { useState, useEffect } from 'react';
import { ViewState, Task, User } from './types';
import { getTasks, saveTasks, initUsers, getCurrentUser, logoutUser } from './services/storageService';
import TaskList from './components/TaskList';
import AiAssistant from './components/AiAssistant';
import LessonHelper from './components/LessonHelper';
import PamphletGenerator from './components/PamphletGenerator';
import Calendar from './components/Calendar';
import Timer from './components/Timer';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import PrivateTutor from './components/PrivateTutor';
import { LayoutDashboard, CheckSquare, CalendarDays, BrainCircuit, GraduationCap, Menu, Moon, Sun, FileText, Shield, User as UserIcon, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // 1. Initialize Users (ensure admin exists)
    initUsers();
    
    // 2. Check for logged in user
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    
    // 3. Load Tasks
    const loaded = getTasks();
    setTasks(loaded);

    // 4. Load Theme Preference
    const savedTheme = localStorage.getItem('darsyar_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Persist Theme
    localStorage.setItem('darsyar_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('dashboard');
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  const handleUpdateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const NavItem = ({ id, icon: Icon, label }: { id: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => { setView(id); setIsSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
        view === id 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-300'
      }`}
    >
      <Icon size={22} className={`transition-transform duration-300 ${view === id ? 'scale-110' : 'group-hover:scale-110'}`} />
      <span className="font-medium">{label}</span>
    </button>
  );

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen bg-[#f8fafc] dark:bg-slate-900 transition-colors duration-500 flex font-[Vazirmatn] ${isDarkMode ? 'dark' : ''}`}>
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm animate-in fade-in duration-300 print:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Hidden on Print */}
        <aside className={`
          fixed lg:sticky top-0 right-0 h-screen w-72 bg-white dark:bg-slate-800 shadow-2xl lg:shadow-none z-50 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] border-l border-gray-100 dark:border-slate-700 print:hidden flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6 flex flex-col h-full overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-3 mb-8 shrink-0">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none animate-in spin-in-90 duration-700">
                <GraduationCap size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">درس‌یار</h1>
            </div>

            <nav className="space-y-2 mb-6">
              <NavItem id="dashboard" icon={LayoutDashboard} label="داشبورد" />
              <NavItem id="tasks" icon={CheckSquare} label="کارها و تکالیف" />
              <NavItem id="tutor" icon={UserIcon} label="معلم خصوصی" />
              <NavItem id="lessons" icon={GraduationCap} label="همیار درس" />
              <NavItem id="pamphlet" icon={FileText} label="جزوه ساز" />
              <NavItem id="assistant" icon={BrainCircuit} label="چت هوشمند" />
              <NavItem id="calendar" icon={CalendarDays} label="تقویم" />
              
              {user.role === 'ADMIN' && (
                <>
                  <div className="my-4 border-t border-gray-200 dark:border-slate-700"></div>
                  <NavItem id="admin" icon={Shield} label="پنل مدیریت" />
                </>
              )}
            </nav>

            <div className="mt-auto space-y-4">
              {/* Timer in Sidebar - Always Persistent */}
              <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                 <Timer />
              </div>

              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-3 rounded-xl transition-colors font-medium">
                <LogOut size={20} />
                خروج از حساب
              </button>
            </div>
          </div>

          {/* User Profile Mini */}
          <div className="shrink-0 p-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                  {user.fullName.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate w-28">{user.fullName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.role === 'ADMIN' ? 'مدیر سیستم' : 'دانش‌آموز'}</p>
                </div>
              </div>
              {/* Dark Mode Toggle Sidebar */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-yellow-400 hover:scale-110 transition-transform"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 w-full max-w-7xl mx-auto overflow-x-hidden print:p-0 print:overflow-visible">
          {/* Mobile Header - Hidden on Print */}
          <div className="lg:hidden flex items-center justify-between mb-6 print:hidden">
             <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                  <GraduationCap size={18} />
               </div>
               <span className="font-bold text-lg text-gray-800 dark:text-white">درس‌یار</span>
             </div>
             <div className="flex gap-2">
               <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-yellow-400">
                 {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
               </button>
               <button onClick={handleLogout} className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 text-red-500">
                 <LogOut size={20} />
               </button>
               <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-white">
                 <Menu />
               </button>
             </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 print:animate-none">
            {view === 'dashboard' && (
              <div className="space-y-6">
                <header className="mb-8 flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">سلام {user.fullName.split(' ')[0]} جان! 👋</h2>
                    <p className="text-gray-500 dark:text-gray-400">امیدوارم امروز پرانرژی باشی. بیا با هم درس‌ها رو مدیریت کنیم.</p>
                  </div>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Stats Cards */}
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200 dark:shadow-none transform transition-all hover:scale-[1.02]">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><CheckSquare size={24} /></div>
                      <span className="text-3xl font-bold">{tasks.filter(t => t.status !== 'DONE').length}</span>
                    </div>
                    <h3 className="font-bold text-lg">کارهای باقی‌مانده</h3>
                    <p className="text-indigo-100 text-sm mt-1">بریم که بترکونیم! 🚀</p>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
                    <div className="flex justify-between items-start mb-4">
                       <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg"><CheckSquare size={24} /></div>
                       <span className="text-3xl font-bold text-gray-800 dark:text-white">{tasks.filter(t => t.status === 'DONE').length}</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">کارهای انجام شده</h3>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">ایول، خسته نباشی! 👏</p>
                  </div>

                  {/* Quick Tasks - Spanning 2 cols on MD, 1 on LG or flexible */}
                  <div className="md:col-span-2 lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white">لیست کارهای امروز</h3>
                      <button onClick={() => setView('tasks')} className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">مشاهده همه</button>
                    </div>
                    <TaskList tasks={tasks.slice(0, 3)} onUpdateTasks={handleUpdateTasks} />
                  </div>
                </div>
              </div>
            )}

            {view === 'tasks' && <TaskList tasks={tasks} onUpdateTasks={handleUpdateTasks} />}
            
            {view === 'assistant' && <AiAssistant />}
            
            {view === 'lessons' && <LessonHelper />}

            {view === 'pamphlet' && <PamphletGenerator />}
            
            {view === 'calendar' && <Calendar />}

            {view === 'tutor' && <PrivateTutor />}

            {view === 'admin' && user.role === 'ADMIN' && <AdminPanel />}
          </div>
        </main>
    </div>
  );
};

export default App;
