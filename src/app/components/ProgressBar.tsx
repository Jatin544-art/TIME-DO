import { motion } from 'motion/react';

interface ProgressBarProps {
  percentage: number;
  total: number;
  completed: number;
}

export function ProgressBar({ percentage, total, completed }: ProgressBarProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-white">Today's Progress</h3>
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
          {completed} / {total} tasks
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
        />
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
        {percentage === 100 ? '🎉 All tasks completed! Great job!' : `${percentage.toFixed(0)}% complete`}
      </p>
    </div>
  );
}
