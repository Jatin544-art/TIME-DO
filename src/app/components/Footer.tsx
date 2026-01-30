import { Lightbulb, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FooterProps {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

const quotes = [
  "The secret of getting ahead is getting started.",
  "It's not about having time, it's about making time.",
  "Focus on being productive instead of busy.",
  "You don't have to be great to start, but you have to start to be great.",
  "The way to get started is to quit talking and begin doing.",
  "Don't watch the clock; do what it does. Keep going.",
  "Your time is limited, don't waste it living someone else's life.",
  "Productivity is never an accident. It is always the result of commitment to excellence.",
  "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
  "Action is the foundational key to all success.",
];

export function Footer({ totalTasks, completedTasks, pendingTasks }: FooterProps) {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <p className="text-sm italic">"{quote}"</p>
          </div>
          
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-white">Total Tasks:</span>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full font-semibold">
              {totalTasks}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-white">Completed:</span>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full font-semibold">
              {completedTasks}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-white">Pending:</span>
            <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full font-semibold">
              {pendingTasks}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
