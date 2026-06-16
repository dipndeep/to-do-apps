import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Timer, Sparkles } from 'lucide-react';
import Card, { CardTitle, CardDescription } from '../Card';
import Button from '../Button';
import CustomSelect from '../CustomSelect';

export default function PomodoroTab({ tasks, showToast }) {
  const [mode, setMode] = useState('FOCUS'); // 'FOCUS', 'BREAK'
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  
  const timerRef = useRef(null);

  // Filter incomplete tasks to show in selector
  const incompleteTasks = tasks.filter(t => t.status === 'BELUM_SELESAI');

  const handleTimerExpiry = useCallback(() => {
    // Alert user
    if (mode === 'FOCUS') {
      showToast('Kerja bagus! Waktu fokus selesai. Silakan istirahat sejenak ☕', 'success');
      setMode('BREAK');
      setTimeLeft(5 * 60); // 5 minutes break
    } else {
      showToast('Waktu istirahat selesai! Siap untuk fokus kembali? 💪', 'info');
      setMode('FOCUS');
      setTimeLeft(25 * 60); // 25 minutes focus
    }
  }, [mode, showToast]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            handleTimerExpiry();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, handleTimerExpiry]);

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'FOCUS' ? 25 * 60 : 5 * 60);
  };

  const handleSwitchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'FOCUS' ? 25 * 60 : 5 * 60);
  };

  // Format MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-[fadeIn_0.2s_ease-out] select-none">
      
      {/* Mode Switches */}
      <div className="flex border-3 border-ink-black-900 rounded-[4px] overflow-hidden shadow-[4px_4px_0px_0px_var(--color-ink-black-900)]">
        <button
          onClick={() => handleSwitchMode('FOCUS')}
          className={`flex-1 py-3 text-sm font-black uppercase tracking-wider transition-colors cursor-pointer text-center ${
            mode === 'FOCUS' 
              ? 'bg-amber-glow-400 text-brand-dark' 
              : 'bg-white hover:bg-ink-black-50 text-ink-black-700'
          }`}
        >
          🎯 Mode Fokus (25m)
        </button>
        <button
          onClick={() => handleSwitchMode('BREAK')}
          className={`flex-1 py-3 text-sm font-black uppercase tracking-wider transition-colors cursor-pointer text-center border-l-3 border-ink-black-900 ${
            mode === 'BREAK' 
              ? 'bg-light-sea-green-400 text-brand-dark' 
              : 'bg-white hover:bg-ink-black-50 text-ink-black-700'
          }`}
        >
          ☕ Istirahat (5m)
        </button>
      </div>

      {/* Main Timer Display */}
      <Card bg="bg-white" className="border-3 border-ink-black-900 shadow-[8px_8px_0px_0px_var(--color-ink-black-900)] text-center py-10">
        <div className="inline-flex p-3 bg-ink-black-50 border-2 border-ink-black-900 rounded-[4px] mb-4">
          <Timer className="w-6 h-6 text-ink-black-900 animate-pulse" />
        </div>
        
        <h1 className="text-7xl md:text-8xl font-black font-mono tracking-widest my-2 select-all text-ink-black-900">
          {formatTime(timeLeft)}
        </h1>

        <p className="text-xs uppercase font-extrabold text-ink-black-600 tracking-wider mb-8">
          {mode === 'FOCUS' ? '🔴 Sesi Fokus Sedang Berjalan' : '🟢 Sesi Istirahat Sedang Berjalan'}
        </p>

        {/* Action Controls */}
        <div className="flex justify-center items-center gap-4">
          <Button
            variant={isRunning ? 'dark' : 'success'}
            onClick={handleToggleTimer}
            className="w-40 py-3 text-base"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" /> JEDA
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" /> MULAI
              </>
            )}
          </Button>

          <button
            onClick={handleResetTimer}
            className="p-3.5 bg-white hover:bg-ink-black-50 border-[3px] border-ink-black-900 rounded-[4px] shadow-[4px_4px_0px_0px_var(--color-ink-black-900)] hover:shadow-[2px_2px_0px_0px_var(--color-ink-black-900)] transition-all cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5 text-ink-black-900 stroke-[2.5]" />
          </button>
        </div>
      </Card>

      {/* Task binder selector */}
      <Card bg="bg-light-sea-green-50" className="border-3 border-ink-black-900 shadow-[4px_4px_0px_0px_var(--color-ink-black-900)]">
        <CardTitle className="text-lg uppercase tracking-wide mb-1">
          Hubungkan dengan Tugas
        </CardTitle>
        <CardDescription className="mb-4">
          Pilih tugas yang ingin Anda fokuskan dalam sesi ini.
        </CardDescription>

        <div className="space-y-4">
          {/* Custom Select for Task Binder */}
          {isRunning ? (
            <div className="w-full min-h-[42px] px-3.5 py-2.5 border-3 border-ink-black-900 rounded-[4px] bg-ink-black-50 text-ink-black-400 font-bold text-xs uppercase tracking-wider flex items-center justify-between gap-2.5 opacity-60">
              <span className="truncate">{selectedTask ? selectedTask.title : '-- Pilih Tugas Fokus --'}</span>
            </div>
          ) : (
            <CustomSelect
              value={selectedTaskId}
              onChange={setSelectedTaskId}
              options={[
                { value: '', label: '-- Pilih Tugas Fokus --' },
                ...incompleteTasks.map((task) => ({
                  value: task.id,
                  label: task.title,
                })),
              ]}
              placeholder="Pilih Tugas Fokus"
            />
          )}

          {selectedTask && (
            <div className="p-4 bg-white border-2 border-ink-black-900 rounded-[4px] shadow-[3px_3px_0px_0px_var(--color-ink-black-900)] flex items-start gap-3 animate-[slideIn_0.1s_ease-out]">
              <div className="p-1 bg-porcelain-300 border border-ink-black-900 rounded-[4px]">
                <Sparkles className="w-4 h-4 text-brand-dark" />
              </div>
              <div>
                <p className="text-xs uppercase font-extrabold tracking-wider text-ink-black-600">Sedang Fokus Pada Pekerjaan:</p>
                <p className="font-black text-ink-black-900 text-sm mt-0.5 uppercase tracking-tight">{selectedTask.title}</p>
                {selectedTask.description && (
                  <p className="text-xs font-semibold text-ink-black-700 mt-1">{selectedTask.description}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

    </div>
  );
}
