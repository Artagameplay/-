
import React, { useState } from 'react';
import { Subject } from '../types';
import { generatePamphlet } from '../services/geminiService';
import { FileText, Printer, Book, Loader2, ListChecks, Lightbulb, GraduationCap, Download } from 'lucide-react';

const PamphletGenerator: React.FC = () => {
  const [subject, setSubject] = useState<Subject>(Subject.MATH);
  const [range, setRange] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!range.trim()) return;
    setLoading(true);
    setResult(null);
    
    const data = await generatePamphlet(subject, range);
    setResult(data);
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto print:max-w-none print:w-full">
      {/* Header - Hidden on Print */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl transform transition-all hover:scale-[1.01] print:hidden">
        <h2 className="text-3xl font-bold mb-3 flex items-center gap-3">
          <FileText className="animate-bounce" />
          جزوه ساز هوشمند
        </h2>
        <p className="text-emerald-50 text-lg opacity-90">
          درس و صفحات رو انتخاب کن، من برات یک جزوه کامل با سوال و جواب و نکته می‌سازم!
        </p>
      </div>

      {/* Form - Hidden on Print */}
      <form onSubmit={handleGenerate} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 transition-colors print:hidden">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">انتخاب درس</label>
            <select 
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            >
              {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">محدوده (مثلاً: فصل ۲، یا صفحه ۱۰ تا ۲۰)</label>
            <div className="flex gap-3">
              <input 
                type="text"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder="مثلاً: فصل اول، معادله‌ها، ص ۲۰ تا ۳۰..."
                className="flex-1 p-4 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="bg-emerald-600 text-white px-8 rounded-xl font-bold hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-200 dark:shadow-none flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Printer />}
                بنویس
              </button>
            </div>
          </div>
        </div>
      </form>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
          
          {/* Action Bar - Hidden on Print */}
          <div className="flex justify-end print:hidden">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Download size={20} />
              دانلود PDF / چاپ
            </button>
          </div>

          {/* Main Paper Sheet UI */}
          <div className="bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 p-8 md:p-12 rounded-3xl shadow-2xl border-t-8 border-emerald-500 relative overflow-hidden print:shadow-none print:border-none print:p-0 print:dark:text-black print:dark:bg-white print:text-black">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 print:hidden"></div>
            
            {/* Header */}
            <div className="text-center border-b-2 border-gray-100 dark:border-slate-700 pb-6 mb-8 print:border-gray-300">
              <span className="inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-1 rounded-full text-sm font-bold mb-3 print:border print:border-emerald-200 print:text-black print:bg-transparent">
                {subject}
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 print:text-black">{result.title}</h1>
              <p className="text-gray-500 dark:text-gray-400 print:text-gray-600">جزوه اختصاصی برای آرتا کلبادی نژاد</p>
            </div>

            {/* Content Grid */}
            <div className="space-y-8">
              
              {/* Summary */}
              <section className="break-inside-avoid">
                <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2 print:text-black">
                  <Book className="w-6 h-6" />
                  خلاصه درس
                </h3>
                <div className="bg-emerald-50 dark:bg-slate-700/50 p-6 rounded-2xl text-justify leading-loose border border-emerald-100 dark:border-slate-600 print:bg-transparent print:border-gray-200 print:text-black">
                  {result.summary}
                </div>
              </section>

              {/* Key Points */}
              <section className="break-inside-avoid">
                 <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400 mb-4 flex items-center gap-2 print:text-black">
                  <Lightbulb className="w-6 h-6" />
                  نکات طلایی و مهم
                </h3>
                <div className="grid md:grid-cols-2 gap-4 print:grid-cols-1">
                  {result.keyPoints?.map((pt: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 print:bg-transparent print:border-gray-200">
                      <span className="flex-shrink-0 w-6 h-6 bg-amber-200 dark:bg-amber-700 text-amber-800 dark:text-amber-100 rounded-full flex items-center justify-center font-bold text-sm mt-0.5 print:bg-gray-200 print:text-black">{idx + 1}</span>
                      <p className="text-sm font-medium print:text-black">{pt}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Q & A */}
              <section className="break-inside-avoid">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2 print:text-black">
                  <ListChecks className="w-6 h-6" />
                  سوالات و پاسخ‌ها
                </h3>
                <div className="space-y-4">
                  {result.questionsAndAnswers?.map((qa: any, idx: number) => (
                    <div key={idx} className="group border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-md transition-shadow print:shadow-none print:border-gray-300">
                      <div className="bg-gray-50 dark:bg-slate-700 p-4 font-bold text-gray-800 dark:text-gray-100 flex gap-2 print:bg-gray-100 print:text-black">
                        <span className="text-blue-500 print:text-black">سوال {idx + 1}:</span>
                        {qa.question}
                      </div>
                      <div className="p-4 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-slate-700 print:bg-white print:text-black">
                        <span className="text-green-600 dark:text-green-400 font-bold ml-2 print:text-black">پاسخ:</span>
                        {qa.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Practice */}
              <section className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-2xl border border-dashed border-purple-300 dark:border-purple-700 break-inside-avoid print:bg-transparent print:border-gray-300">
                <h3 className="text-xl font-bold text-purple-700 dark:text-purple-400 mb-3 flex items-center gap-2 print:text-black">
                  <GraduationCap className="w-6 h-6" />
                  تمرین برای امتحان
                </h3>
                <p className="text-gray-700 dark:text-gray-300 print:text-black">{result.examPractice}</p>
                {result.importantPages && (
                  <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800 text-sm text-purple-600 dark:text-purple-300 print:text-black print:border-gray-300">
                    <strong>صفحات مهم کتاب:</strong> {result.importantPages}
                  </div>
                )}
              </section>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PamphletGenerator;
