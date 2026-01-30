import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Coffee, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface PomodoroTimerProps {
  taskTitle: string;
  onTimeSpent: (minutes: number) => void;
  onClose: () => void;
}

export function PomodoroTimer({ taskTitle, onTimeSpent, onClose }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const workDuration = 25 * 60;
  const breakDuration = 5 * 60;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (mode === 'work') {
      setTotalTimeSpent(prev => prev + 25);
      // Play completion sound notification
      const audio = new Audio('data:audio/wav;base64,UklGRnoFAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoFAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBg==');
      audio.play().catch(() => {});
      
      setMode('break');
      setTimeLeft(breakDuration);
    } else {
      setMode('work');
      setTimeLeft(workDuration);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? workDuration : breakDuration);
  };

  const switchMode = () => {
    setIsRunning(false);
    if (mode === 'work') {
      setMode('break');
      setTimeLeft(breakDuration);
    } else {
      setMode('work');
      setTimeLeft(workDuration);
    }
  };

  const handleClose = () => {
    if (totalTimeSpent > 0) {
      onTimeSpent(totalTimeSpent);
    }
    onClose();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = mode === 'work' 
    ? ((workDuration - timeLeft) / workDuration) * 100
    : ((breakDuration - timeLeft) / breakDuration) * 100;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`bg-gradient-to-br ${
          mode === 'work' 
            ? 'from-red-500 to-orange-600' 
            : 'from-green-500 to-teal-600'
        } rounded-3xl shadow-2xl max-w-md w-full p-8 text-white relative overflow-hidden`}
      >
        {/* Animated Background Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {mode === 'work' ? (
                <Zap className="w-6 h-6" />
              ) : (
                <Coffee className="w-6 h-6" />
              )}
              <h2 className="text-xl font-bold">
                {mode === 'work' ? 'Focus Time' : 'Break Time'}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center mb-8">
            <p className="text-white/80 mb-2 text-sm">Working on:</p>
            <h3 className="font-semibold text-lg truncate">{taskTitle}</h3>
          </div>

          {/* Timer Display */}
          <div className="relative mb-8">
            <svg className="w-full h-auto" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
              />
              <motion.circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={565.48}
                strokeDashoffset={565.48 - (565.48 * progress) / 100}
                transform="rotate(-90 100 100)"
                initial={{ strokeDashoffset: 565.48 }}
                animate={{ strokeDashoffset: 565.48 - (565.48 * progress) / 100 }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold tabular-nums">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={resetTimer}
              className="p-4 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            <button
              onClick={toggleTimer}
              className="p-6 bg-white text-red-600 hover:bg-white/90 rounded-full transition-all transform hover:scale-105 shadow-lg"
            >
              {isRunning ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8" />
              )}
            </button>
            <button
              onClick={switchMode}
              className="p-4 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              title={mode === 'work' ? 'Switch to break' : 'Switch to work'}
            >
              {mode === 'work' ? (
                <Coffee className="w-6 h-6" />
              ) : (
                <Zap className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Stats */}
          <div className="bg-white/20 backdrop-blur rounded-xl p-4">
            <div className="flex items-center justify-between text-sm">
              <span>Time Spent Today:</span>
              <span className="font-bold">{totalTimeSpent} minutes</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
