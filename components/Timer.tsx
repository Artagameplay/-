
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';
import { toPersianDigits } from '../services/dateUtils';

const Timer: React.FC = () => {
  const [minutes, setMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsFinished(true);
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      audio.play().catch(e => console.log("Audio play failed interaction required"));
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(minutes * 60);
    setIsFinished(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${toPersianDigits(mins.toString().padStart(2, '0'))}:${toPersianDigits(secs.toString().padStart(2, '0'))}`;
  };

  return (
    <div className="bg-indigo-50 dark:bg-slate-700/50 rounded-xl p-4 flex flex-col items-center justify-center w-full border border-indigo-100 dark:border-slate-600 transition-colors">
      <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-3 flex items-center gap-2">
        <Bell className="w-4 h-4 text-indigo-500" />
        تایمر مطالعه
      </h3>
      
      {/* Time Display */}
      <div className={`text-4xl font-bold mb-4 font-mono tracking-wider ${isFinished ? 'text-green-600 dark:text-green-400 animate-pulse' : 'text-gray-800 dark:text-white'}`}>
        {formatTime(timeLeft)}
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-4">
        <button 
          onClick={toggleTimer}
          className={`p-3 rounded-full transition-all shadow-sm ${isActive ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-800' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
        >
          {isActive ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
        </button>
        <button 
          onClick={resetTimer}
          className="p-3 rounded-full bg-white dark:bg-slate-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-500 transition-all border border-gray-200 dark:border-slate-500"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-3 gap-1 w-full">
        {[15, 25, 45].map((m) => (
          <button
            key={m}
            onClick={() => { setMinutes(m); setTimeLeft(m * 60); setIsActive(false); setIsFinished(false); }}
            className={`py-1.5 px-1 rounded-md text-xs font-medium transition-colors ${minutes === m ? 'bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100' : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-600'}`}
          >
            {toPersianDigits(m)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Timer;
