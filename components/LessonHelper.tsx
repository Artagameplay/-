import React, { useState } from 'react';
import { Subject } from '../types';
import { generateLessonContent } from '../services/geminiService';
import { Search, BookOpen, CheckCircle, HelpCircle, Loader2 } from 'lucide-react';
import { SUBJECT_ICONS } from '../constants';

const LessonHelper: React.FC = () => {
  const [subject, setSubject] = useState<Subject>(Subject.MATH);
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setResult(null);
    
    const data = await generateLessonContent(subject, topic);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
       <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg transform transition-transform hover:scale-[1.01]">
         <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
           <BookOpen />
           همیار درس
         </h2>
         <p className="text-purple-100 opacity-90">
           موضوع یا شماره صفحه (مثلاً ریاضی ص ۷۷) رو بنویس تا همه سوال‌ها و جواب‌ها رو برات پیدا کنم.
         </p>
       </div>

       <form onSubmit={handleSearch} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 transition-colors">
         <div className="grid md:grid-cols-4 gap-4">
           <div className="md:col-span-1">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">درس</label>
             <select 
               value={subject}
               onChange={(e) => setSubject(e.target.value as Subject)}
               className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
             >
               {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
             </select>
           </div>
           <div className="md:col-span-3">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">موضوع یا صفحه</label>
             <div className="flex gap-2">
               <input 
                 type="text"
                 value={topic}
                 onChange={(e) => setTopic(e.target.value)}
                 placeholder="مثلاً: صفحه ۷۷"
                 className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
               />
               <button 
                 type="submit" 
                 disabled={loading}
                 className="bg-purple-600 text-white px-6 rounded-xl font-bold hover:bg-purple-700 transition shadow-md flex items-center gap-2"
               >
                 {loading ? <Loader2 className="animate-spin" /> : <Search />}
                 بیاب
               </button>
             </div>
           </div>
         </div>
       </form>

       {result && (
         <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {/* Summary Card */}
           <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-r-4 border-purple-500">
             <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">خلاصه درس</h3>
             <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{result.summary}</p>
           </div>

           {/* Key Points */}
           <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/50">
                <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                  <CheckCircle size={20} />
                  نکات کلیدی
                </h3>
                <ul className="space-y-2">
                  {result.keyPoints?.map((pt: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-blue-900 dark:text-blue-200 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Practice */}
              <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/50">
                <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
                  <HelpCircle size={20} />
                  سوال و جواب صفحه
                </h3>
                <p className="font-medium text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-wrap">{result.practiceQuestion}</p>
                <div className="bg-white dark:bg-slate-700 p-3 rounded-lg border border-amber-200 dark:border-slate-600 text-sm text-gray-600 dark:text-gray-300">
                  <strong className="block text-amber-600 dark:text-amber-400 mb-1 text-xs">پاسخ تشریحی:</strong>
                  <div className="whitespace-pre-wrap">{result.answer}</div>
                </div>
              </div>
           </div>
         </div>
       )}
    </div>
  );
};

export default LessonHelper;