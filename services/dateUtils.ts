
// Utility to get today's Jalali date as string YYYY/MM/DD
export const getTodayJalali = (): string => {
  return new Date().toLocaleDateString('fa-IR-u-nu-latn', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '/');
};

export const toPersianDigits = (n: number | string): string => {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n
    .toString()
    .replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
};

export const getJalaliMonthName = (date: Date = new Date()): string => {
  return date.toLocaleDateString('fa-IR', { month: 'long' });
};

export const getJalaliYear = (date: Date = new Date()): string => {
  return date.toLocaleDateString('fa-IR-u-nu-latn', { year: 'numeric' });
};

export interface CalendarDay {
  dayOfMonth: number;
  dateString: string;
  isToday: boolean;
  dayOfWeek: number; // 0 = Saturday, 6 = Friday
}

export const getCurrentJalaliMonthData = (): CalendarDay[] => {
  const today = new Date();
  
  // 1. Find the current Jalali Year and Month numbers
  const jParts = new Intl.DateTimeFormat('en-US-u-ca-persian', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).formatToParts(today);
  
  const jYear = parseInt(jParts.find(p => p.type === 'year')?.value || '1403');
  const jMonth = parseInt(jParts.find(p => p.type === 'month')?.value || '1');
  const jDay = parseInt(jParts.find(p => p.type === 'day')?.value || '1');

  // 2. Determine number of days in this Jalali month
  // 1-6: 31 days, 7-11: 30 days, 12: 29 or 30
  let daysInMonth = 30;
  if (jMonth <= 6) daysInMonth = 31;
  else if (jMonth === 12) {
    // Simple leap year check for UI purposes (imperfect but sufficient for current years)
    const isLeap = (jYear % 33 % 4 - 1) === ((jYear % 33 * 0.225) >> 0); // Approx
    daysInMonth = isLeap ? 30 : 29; 
    // Fallback: Assume 29 usually, let's just stick to standard non-leap for safety or 30 to fill grid.
    // Better trick: create a date object for next month day 0? 
    // Hard to do with standard Date object for Persian. We stick to static rule.
    daysInMonth = 29; 
  }

  // 3. Find the Gregorian date corresponding to the 1st of this Jalali month
  // We iterate backwards from today until the Jalali day is 1
  const iterator = new Date(today);
  // Subtract (jDay - 1) days to get to the 1st
  iterator.setDate(today.getDate() - (jDay - 1));
  
  const startDayOfWeekGregorian = iterator.getDay(); // 0=Sunday, 6=Saturday
  // Convert to Persian week index: 0=Saturday, 1=Sunday, ... 6=Friday
  // Gregorian: Sun(0), Mon(1), Tue(2), Wed(3), Thu(4), Fri(5), Sat(6)
  // Persian:   Sun(1), Mon(2), Tue(3), Wed(4), Thu(5), Fri(6), Sat(0)
  const startDayOfWeekJalali = (startDayOfWeekGregorian + 1) % 7;

  const days: CalendarDay[] = [];

  // Add empty placeholders for previous month?
  // We just return the days of current month with their week index
  
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(iterator);
    d.setDate(iterator.getDate() + (i - 1));
    const dayOfWeekGreg = d.getDay();
    const dayOfWeekJalali = (dayOfWeekGreg + 1) % 7;

    days.push({
      dayOfMonth: i,
      dateString: `${jYear}/${jMonth.toString().padStart(2, '0')}/${i.toString().padStart(2, '0')}`,
      isToday: i === jDay,
      dayOfWeek: dayOfWeekJalali
    });
  }

  return days;
};
