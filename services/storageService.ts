
import { Task, User, UserRole } from "../types";

const TASKS_KEY = 'darsyar_tasks';
const USERS_KEY = 'darsyar_users';
const CURRENT_USER_KEY = 'darsyar_current_user';

// --- Tasks ---

export const getTasks = (): Task[] => {
  const saved = localStorage.getItem(TASKS_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Users & Auth ---

const DEFAULT_ADMIN: User = {
  id: 'admin_master',
  username: '5790156002',
  password: '5790156002',
  fullName: 'مدیر کل',
  role: 'ADMIN',
  hasSubscription: true,
};

// Initialize Admin if not exists
export const initUsers = () => {
  let users = getUsers();
  // Ensure Admin exists
  if (!users.find(u => u.username === DEFAULT_ADMIN.username)) {
    users = [...users, DEFAULT_ADMIN];
    saveUsers(users);
  }
  
  // Ensure Arta exists (optional, mostly for demo if not created via admin)
  if (!users.find(u => u.username === 'arta')) {
      users.push({
          id: 'arta_default',
          username: 'arta',
          password: '123',
          fullName: 'آرتا کلبادی نژاد',
          role: 'STUDENT',
          hasSubscription: true
      });
      saveUsers(users);
  }
};

export const getUsers = (): User[] => {
  const saved = localStorage.getItem(USERS_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const loginUser = (username: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const safeUser = { ...user };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    return safeUser;
  }
  return null;
};

export const getCurrentUser = (): User | null => {
  const saved = localStorage.getItem(CURRENT_USER_KEY);
  return saved ? JSON.parse(saved) : null;
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};
