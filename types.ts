
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum Subject {
  MATH = 'ریاضی',
  SCIENCE = 'علوم تجربی',
  PERSIAN = 'ادبیات فارسی',
  ENGLISH = 'زبان انگلیسی',
  ARABIC = 'عربی',
  RELIGION = 'پیام‌های آسمان',
  SOCIAL = 'مطالعات اجتماعی',
  WORK = 'کار و فناوری',
  ART = 'فرهنگ و هنر',
  QURAN = 'آموزش قرآن',
  SPORT = 'ورزش',
  THINKING = 'تفکر و سبک زندگی',
  PRACTICE_MATH = 'پرتکرار ریاضی',
  PRACTICE_SCIENCE = 'پرتکرار علوم',
  OTHER = 'سایر',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY/MM/DD (Jalali)
  dueTime?: string; // HH:mm
  subject: Subject;
  status: TaskStatus;
  tags: string[];
  links?: string[];
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
  timestamp: number;
  attachments?: { name: string; type: string }[];
}

export type ViewState = 'dashboard' | 'tasks' | 'calendar' | 'assistant' | 'lessons' | 'pamphlet' | 'tutor' | 'admin';

export interface DaySchedule {
  dayName: string; // شنبه, یکشنبه...
  subjects: Subject[];
}

export type UserRole = 'ADMIN' | 'STUDENT';

export interface User {
  id: string;
  username: string;
  password?: string; // Only used for saving/checking, cleared in state
  fullName: string;
  role: UserRole;
  hasSubscription: boolean;
}
