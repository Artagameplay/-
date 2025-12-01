
import React, { useState } from 'react';
import { loginUser } from '../services/storageService';
import { User } from '../types';
import { GraduationCap, LogIn, Lock, User as UserIcon } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = loginUser(username, password);
    if (user) {
      onLogin(user);
    } else {
      setError('نام کاربری یا رمز عبور اشتباه است.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] dark:bg-slate-900 p-4 font-[Vazirmatn]">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 dark:border-slate-700">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-300 dark:shadow-none mb-4 transform -rotate-6">
            <GraduationCap size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">ورود به درس‌یار</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">لطفاً برای ادامه وارد حساب خود شوید</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">نام کاربری</label>
            <div className="relative">
              <UserIcon className="absolute right-3 top-3.5 text-gray-400" size={20} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 pr-10 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder="نام کاربری خود را وارد کنید"
                dir="ltr"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">رمز عبور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-3.5 text-gray-400" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-10 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder="رمز عبور خود را وارد کنید"
                dir="ltr"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{error}</p>}

          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg flex justify-center items-center gap-2"
          >
            <LogIn size={20} />
            ورود به سیستم
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs text-gray-400">
          نسخه ۱.۵.۰ | طراحی شده برای موفقیت شما 🚀
        </div>
      </div>
    </div>
  );
};

export default Login;
