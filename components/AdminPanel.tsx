
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { getUsers, saveUsers, generateId } from '../services/storageService';
import { Trash2, UserPlus, Shield, Check, X, Search } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  // New User Form State
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('STUDENT');

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const saveToStorage = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword || !newName) return;
    
    if (users.some(u => u.username === newUsername)) {
      alert('این نام کاربری قبلاً استفاده شده است.');
      return;
    }

    const newUser: User = {
      id: generateId(),
      username: newUsername,
      password: newPassword,
      fullName: newName,
      role: newRole,
      hasSubscription: false
    };

    saveToStorage([...users, newUser]);
    setIsAdding(false);
    setNewUsername('');
    setNewPassword('');
    setNewName('');
  };

  const deleteUser = (id: string) => {
    if (confirm('آیا مطمئن هستید؟ این عملیات غیرقابل بازگشت است.')) {
      saveToStorage(users.filter(u => u.id !== id));
    }
  };

  const toggleSubscription = (id: string) => {
    saveToStorage(users.map(u => u.id === id ? { ...u, hasSubscription: !u.hasSubscription } : u));
  };

  const filteredUsers = users.filter(u => u.fullName.includes(searchTerm) || u.username.includes(searchTerm));

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="text-emerald-400" />
            پنل مدیریت سیستم
          </h2>
          <p className="text-slate-400 text-sm mt-1">مدیریت کاربران و اشتراک‌ها</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition"
        >
          <UserPlus size={20} />
          افزودن کاربر
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddUser} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700 animate-in slide-in-from-top-4">
          <h3 className="font-bold mb-4 text-gray-800 dark:text-white">اطلاعات کاربر جدید</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <input placeholder="نام و نام خانوادگی" value={newName} onChange={e => setNewName(e.target.value)} className="p-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
            <input placeholder="نام کاربری (موبایل)" value={newUsername} onChange={e => setNewUsername(e.target.value)} className="p-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white" dir="ltr" />
            <input placeholder="رمز عبور" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="p-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white" dir="ltr" />
            <select value={newRole} onChange={e => setNewRole(e.target.value as UserRole)} className="p-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white">
              <option value="STUDENT">دانش‌آموز</option>
              <option value="ADMIN">مدیر</option>
            </select>
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-500">لغو</button>
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl">ذخیره کاربر</button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-3 text-gray-400" size={20} />
        <input 
          placeholder="جستجو در کاربران..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full p-3 pr-10 rounded-xl border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-gray-200 dark:border-slate-700">
        <table className="w-full text-right">
          <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-500 dark:text-gray-400 text-sm">
            <tr>
              <th className="p-4">نام کاربر</th>
              <th className="p-4">نام کاربری</th>
              <th className="p-4">نقش</th>
              <th className="p-4">وضعیت اشتراک</th>
              <th className="p-4">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                <td className="p-4 font-bold text-gray-800 dark:text-gray-200">{user.fullName}</td>
                <td className="p-4 text-gray-600 dark:text-gray-400 font-mono" dir="ltr">{user.username}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {user.role === 'ADMIN' ? 'مدیر سیستم' : 'دانش‌آموز'}
                  </span>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => toggleSubscription(user.id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition ${user.hasSubscription ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                  >
                    {user.hasSubscription ? <><Check size={14} /> فعال</> : <><X size={14} /> غیرفعال</>}
                  </button>
                </td>
                <td className="p-4">
                  {user.username !== '5790156002' && (
                    <button onClick={() => deleteUser(user.id)} className="text-red-400 hover:text-red-600 p-2">
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
