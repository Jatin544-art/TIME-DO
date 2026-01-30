import { CheckSquare, Trash2, Archive, CheckCircle2, XCircle } from 'lucide-react';
import { Task } from '@/app/types';
import { motion } from 'motion/react';

interface BulkActionsProps {
  selectedTasks: string[];
  tasks: Task[];
  onBulkComplete: () => void;
  onBulkDelete: () => void;
  onBulkArchive: () => void;
  onClearSelection: () => void;
}

export function BulkActions({
  selectedTasks,
  tasks,
  onBulkComplete,
  onBulkDelete,
  onBulkArchive,
  onClearSelection,
}: BulkActionsProps) {
  if (selectedTasks.length === 0) return null;

  const selectedTasksData = tasks.filter(t => selectedTasks.includes(t.id));
  const allCompleted = selectedTasksData.every(t => t.completed);
  const hasIncomplete = selectedTasksData.some(t => !t.completed);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-blue-500 dark:border-blue-600 p-4 z-50"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="font-semibold text-blue-900 dark:text-blue-100">
            {selectedTasks.length} selected
          </span>
        </div>

        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />

        {hasIncomplete && (
          <button
            onClick={onBulkComplete}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            title="Mark as complete"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Complete</span>
          </button>
        )}

        <button
          onClick={onBulkArchive}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
          title="Archive selected"
        >
          <Archive className="w-5 h-5" />
          <span className="font-medium">Archive</span>
        </button>

        <button
          onClick={onBulkDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          title="Delete selected"
        >
          <Trash2 className="w-5 h-5" />
          <span className="font-medium">Delete</span>
        </button>

        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />

        <button
          onClick={onClearSelection}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Clear selection"
        >
          <XCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </motion.div>
  );
}
