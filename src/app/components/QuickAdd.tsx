import { useState, useRef, useEffect } from 'react';
import { Plus, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface QuickAddProps {
  onAdd: (title: string, priority: 'high' | 'medium' | 'low') => void;
}

export function QuickAdd({ onAdd }: QuickAddProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), priority);
      setTitle('');
      setPriority('medium');
      setIsExpanded(false);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!title.trim()) {
        setIsExpanded(false);
      }
    }, 200);
  };

  if (!isExpanded) {
    return (
      <motion.button
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => setIsExpanded(true)}
        className="w-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-xl p-4 hover:border-blue-400 dark:hover:border-blue-600 transition-all group"
      >
        <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
          <Zap className="w-5 h-5 group-hover:animate-pulse" />
          <span className="font-medium">Quick Add Task</span>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.form
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-600 rounded-xl p-4 shadow-lg"
    >
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleBlur}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setPriority('high')}
            className={`px-3 py-2 rounded-lg transition-all ${
              priority === 'high'
                ? 'bg-red-500 text-white ring-2 ring-red-300'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
            }`}
            title="High Priority"
          >
            H
          </button>
          <button
            type="button"
            onClick={() => setPriority('medium')}
            className={`px-3 py-2 rounded-lg transition-all ${
              priority === 'medium'
                ? 'bg-yellow-500 text-white ring-2 ring-yellow-300'
                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
            }`}
            title="Medium Priority"
          >
            M
          </button>
          <button
            type="button"
            onClick={() => setPriority('low')}
            className={`px-3 py-2 rounded-lg transition-all ${
              priority === 'low'
                ? 'bg-green-500 text-white ring-2 ring-green-300'
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
            }`}
            title="Low Priority"
          >
            L
          </button>
        </div>

        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add
        </button>
      </div>
    </motion.form>
  );
}
