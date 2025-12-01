
import { Subject } from "./types";
import { BookOpen, Calculator, FlaskConical, Globe, Languages, Palette, PenTool, Book, Dumbbell, Brain, Repeat } from "lucide-react";

export const SUBJECT_ICONS: Record<string, any> = {
  [Subject.MATH]: Calculator,
  [Subject.SCIENCE]: FlaskConical,
  [Subject.PERSIAN]: BookOpen,
  [Subject.ENGLISH]: Languages,
  [Subject.ARABIC]: Languages,
  [Subject.SOCIAL]: Globe,
  [Subject.ART]: Palette,
  [Subject.WORK]: PenTool,
  [Subject.QURAN]: Book,
  [Subject.RELIGION]: Book,
  [Subject.SPORT]: Dumbbell,
  [Subject.THINKING]: Brain,
  [Subject.PRACTICE_MATH]: Repeat,
  [Subject.PRACTICE_SCIENCE]: Repeat,
  [Subject.OTHER]: BookOpen,
};

export const SUBJECT_COLORS: Record<string, string> = {
  [Subject.MATH]: "bg-blue-100 text-blue-700",
  [Subject.SCIENCE]: "bg-green-100 text-green-700",
  [Subject.PERSIAN]: "bg-orange-100 text-orange-700",
  [Subject.ENGLISH]: "bg-purple-100 text-purple-700",
  [Subject.ARABIC]: "bg-emerald-100 text-emerald-700",
  [Subject.SOCIAL]: "bg-yellow-100 text-yellow-700",
  [Subject.SPORT]: "bg-red-100 text-red-700",
  [Subject.THINKING]: "bg-cyan-100 text-cyan-700",
  [Subject.WORK]: "bg-slate-200 text-slate-700",
  [Subject.ART]: "bg-pink-100 text-pink-700",
  [Subject.PRACTICE_MATH]: "bg-indigo-50 text-indigo-600 border border-indigo-200",
  [Subject.PRACTICE_SCIENCE]: "bg-teal-50 text-teal-600 border border-teal-200",
  [Subject.OTHER]: "bg-gray-100 text-gray-700",
};

// Arta's Weekly Schedule
// 0: Saturday, 1: Sunday, ... 6: Friday
export const WEEKLY_SCHEDULE: Record<number, Subject[]> = {
  0: [Subject.RELIGION, Subject.SPORT, Subject.MATH], // Saturday
  1: [Subject.SOCIAL, Subject.ARABIC, Subject.PERSIAN], // Sunday
  2: [Subject.SCIENCE, Subject.MATH, Subject.QURAN, Subject.PRACTICE_MATH], // Monday
  3: [Subject.ENGLISH, Subject.WORK, Subject.THINKING], // Tuesday
  4: [Subject.SOCIAL, Subject.SCIENCE, Subject.ART, Subject.PERSIAN, Subject.PRACTICE_SCIENCE], // Wednesday
  5: [], // Thursday
  6: [], // Friday
};
