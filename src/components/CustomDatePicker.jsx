import { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const WEEKDAY_NAMES = ['Mg', 'Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb'];

export default function CustomDatePicker({
  value, // Format: YYYY-MM-DD
  onChange,
  placeholder = 'Pilih Tanggal',
  className = '',
  position = 'bottom',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // States for calendar navigation (current month and year page view)
  const [navDate, setNavDate] = useState(new Date());

  // Update navDate when date picker is opened or value changes
  useEffect(() => {
    Promise.resolve().then(() => {
      if (value) {
        const parsed = new Date(value);
        if (!isNaN(parsed.getTime())) {
          setNavDate(parsed);
        }
      } else {
        setNavDate(new Date());
      }
    });
  }, [value, isOpen]);

  // Click outside listener to close calendar
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navMonth = navDate.getMonth();
  const navYear = navDate.getFullYear();

  // Month navigation helpers
  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setNavDate(new Date(navYear, navMonth - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setNavDate(new Date(navYear, navMonth + 1, 1));
  };

  const handleSelectDay = (day) => {
    // Generate YYYY-MM-DD formatted date string
    const dateStr = `${navYear}-${(navMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleSelectToday = (e) => {
    e.stopPropagation();
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  // Format date display value for trigger text in Indonesian
  const getFormattedValue = () => {
    if (!value) return '';
    const parsed = new Date(value);
    if (isNaN(parsed.getTime())) return '';
    
    const d = parsed.getDate();
    const m = MONTH_NAMES[parsed.getMonth()];
    const y = parsed.getFullYear();
    return `${d} ${m} ${y}`;
  };

  // Generate calendar grid details
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(navYear, navMonth);
  const firstDayIndex = getFirstDayOfMonth(navYear, navMonth);

  // Generate trailing days from previous month
  const prevMonthIndex = navMonth === 0 ? 11 : navMonth - 1;
  const prevYear = navMonth === 0 ? navYear - 1 : navYear;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonthIndex);
  
  const prevMonthDays = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    prevMonthDays.push(daysInPrevMonth - i);
  }

  // Generate days of the current month
  const currentMonthDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    currentMonthDays.push(i);
  }

  // Generate leading days for the next month to fill the 42-cell calendar grid
  const totalCells = prevMonthDays.length + currentMonthDays.length;
  const nextMonthCellsCount = totalCells > 35 ? 42 - totalCells : 35 - totalCells;
  
  const nextMonthDays = [];
  for (let i = 1; i <= nextMonthCellsCount; i++) {
    nextMonthDays.push(i);
  }

  const todayDate = new Date();
  const isToday = (day) => {
    return todayDate.getDate() === day && todayDate.getMonth() === navMonth && todayDate.getFullYear() === navYear;
  };

  const isSelected = (day) => {
    if (!value) return false;
    const parsed = new Date(value);
    return parsed.getDate() === day && parsed.getMonth() === navMonth && parsed.getFullYear() === navYear;
  };

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {/* Date Trigger button wrapper input styling */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[42px] px-3.5 py-2 border-3 border-ink-black-900 rounded-[4px] bg-white text-ink-black-900 font-bold text-xs uppercase tracking-wider flex items-center justify-between gap-2.5 shadow-[2px_2px_0px_0px_var(--color-ink-black-900)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer focus:outline-none"
      >
        <span className="flex items-center gap-2 truncate">
          <Calendar className="w-4 h-4 text-ink-black-900 shrink-0" />
          {value ? (
            <span className="truncate">{getFormattedValue()}</span>
          ) : (
            <span className="opacity-50 lowercase first-letter:uppercase">{placeholder}</span>
          )}
        </span>
      </button>

      {/* Calendar Popup */}
      {isOpen && (
        <div 
          className={`absolute right-0 md:left-0 w-72 border-3 border-ink-black-900 bg-white shadow-[4px_4px_0px_0px_var(--color-ink-black-900)] rounded-[4px] p-4 z-50 animate-[slideIn_0.15s_ease-out] ${
            position === 'top' ? 'bottom-full mb-2' : 'mt-2'
          }`}
        >
          {/* Header row: Month & Year navigation */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-ink-black-100">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 bg-white hover:bg-light-sea-green-50 border-2 border-ink-black-900 rounded-[4px] shadow-[1px_1px_0px_0px_var(--color-ink-black-900)] active:translate-x-px active:translate-y-px active:shadow-none cursor-pointer text-ink-black-900"
            >
              <ChevronLeft className="w-3.5 h-3.5 stroke-3" />
            </button>
            
            <span className="font-extrabold text-xs uppercase tracking-widest text-ink-black-900">
              {MONTH_NAMES[navMonth]} {navYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 bg-white hover:bg-light-sea-green-50 border-2 border-ink-black-900 rounded-[4px] shadow-[1px_1px_0px_0px_var(--color-ink-black-900)] active:translate-x-px active:translate-y-px active:shadow-none cursor-pointer text-ink-black-900"
            >
              <ChevronRight className="w-3.5 h-3.5 stroke-3" />
            </button>
          </div>

          {/* Weekday headers layout */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {WEEKDAY_NAMES.map((day) => (
              <span key={day} className="text-[10px] font-black uppercase text-ink-black-400 tracking-wider">
                {day}
              </span>
            ))}
          </div>

          {/* Date Grid Cells */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Trailing days of previous month */}
            {prevMonthDays.map((day, idx) => (
              <span 
                key={`prev-${idx}`} 
                className="w-8 h-8 flex items-center justify-center text-[10px] font-bold text-ink-black-300 pointer-events-none opacity-50"
              >
                {day}
              </span>
            ))}

            {/* Current month days */}
            {currentMonthDays.map((day) => {
              const selected = isSelected(day);
              const today = isToday(day);

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`w-8 h-8 rounded-[4px] flex items-center justify-center text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                    selected
                      ? 'bg-light-sea-green-400 text-brand-dark border-2 border-ink-black-900 shadow-[1.5px_1.5px_0px_0px_var(--color-ink-black-900)] hover:scale-105 z-10'
                      : today
                        ? 'bg-amber-glow-100 text-brand-dark border-2 border-dashed border-ink-black-900 hover:bg-amber-glow-200'
                        : 'bg-white hover:bg-light-sea-green-50 border border-transparent text-ink-black-900 hover:border-ink-black-900 hover:scale-105'
                  }`}
                >
                  {day}
                </button>
              );
            })}

            {/* Leading days of next month */}
            {nextMonthDays.map((day, idx) => (
              <span 
                key={`next-${idx}`} 
                className="w-8 h-8 flex items-center justify-center text-[10px] font-bold text-ink-black-300 pointer-events-none opacity-50"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Footer controls: Today / Clear */}
          <div className="flex justify-between mt-4 pt-3 border-t-2 border-ink-black-100 select-none">
            <button
              type="button"
              onClick={handleClear}
              className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-punch-red-50 hover:bg-punch-red-100 border-2 border-ink-black-900 text-punch-red-600 rounded-[4px] shadow-[1px_1px_0px_0px_var(--color-ink-black-900)] active:translate-x-px active:translate-y-px active:shadow-none cursor-pointer"
            >
              Hapus
            </button>
            <button
              type="button"
              onClick={handleSelectToday}
              className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-light-sea-green-50 hover:bg-light-sea-green-100 border-2 border-ink-black-900 text-light-sea-green-700 rounded-[4px] shadow-[1px_1px_0px_0px_var(--color-ink-black-900)] active:translate-x-px active:translate-y-px active:shadow-none cursor-pointer"
            >
              Hari Ini
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
