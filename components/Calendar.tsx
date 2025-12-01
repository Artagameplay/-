
import React, { useMemo } from 'react';
import { getCurrentJalaliMonthData, getJalaliMonthName, getJalaliYear, toPersianDigits } from '../services/dateUtils';
import { WEEKLY_SCHEDULE, SUBJECT_COLORS, SUBJECT_ICONS } from '../constants';
import { Subject } from '../types';

const Calendar: React.FC = () => {
  const days = useMemo(() => getCurrentJalaliMonthData(), []);
  const monthName = getJalaliMonthName();
  const year = getJalaliYear();

  // Calculate padding for the first row
  const startDayOfWeek = days.length > 0 ? days[0].dayOfWeek : 0;
  const paddingArray = Array.from({ length: startDayOfWeek });

  const weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700">
        <header className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-300">
            {monthName} {toPersianDigits(year)}
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            برنامه هفتگی مدرسه
          </div>
        </header>

        {/* Grid Header */}
        <div className="grid grid-cols-7 gap-2 mb-4 text-center">
          {weekDays.map((d, i) => (
            <div key={i} className={`font-bold text-sm ${i === 6 ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {paddingArray.map((_, i) => (
            <div key={`pad-${i}`} className="aspect-[4/5] md:aspect-square bg-transparent"></div>
          ))}

          {days.map((day) => {
            const daySchedule = WEEKLY_SCHEDULE[day.dayOfWeek] || [];
            const isFriday = day.dayOfWeek === 6;

            return (
              <div 
                key={day.dateString}
                className={`
                  relative group aspect-[4/5] md:aspect-square rounded-xl p-2 border transition-all hover:shadow-lg hover:scale-[1.05] hover:z-10
                  ${day.isToday 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-200 dark:ring-indigo-800' 
                    : 'bg-white dark:bg-slate-700/50 border-gray-100 dark:border-slate-600'
                  }
                  ${isFriday ? 'bg-red-50/50 dark:bg-red-900/10' : ''}
                `}
              >
                {/* Date Number */}
                <div className={`text-lg font-bold mb-1 ${isFriday ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>
                  {toPersianDigits(day.dayOfMonth)}
                </div>

                {/* Schedule Dots/List */}
                <div className="flex flex-col gap-1 overflow-hidden h-full pb-6">
                  {daySchedule.map((subj, idx) => {
                    const Icon = SUBJECT_ICONS[subj];
                    return (
                      <div 
                        key={idx} 
                        className={`text-[10px] md:text-xs px-1.5 py-0.5 rounded flex items-center gap-1 truncate ${SUBJECT_COLORS[subj] || 'bg-gray-100 text-gray-700'}`}
                      >
                        {Icon && <Icon size={10} className="shrink-0" />}
                        <span className="truncate">{subj}</span>
                      </div>
                    );
                  })}
                  
                  {daySchedule.length === 0 && !isFriday && (
                     <span className="text-[10px] text-gray-300 dark:text-slate-500 mt-2 text-center">آزاد</span>
                  )}
                  {isFriday && (
                     <span className="text-[10px] text-red-300 dark:text-red-400 mt-2 text-center">تعطیل</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
