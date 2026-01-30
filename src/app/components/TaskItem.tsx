import { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { CheckCircle2, Circle, Clock, Edit2, Trash2, AlertCircle, GripVertical, Tag, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { Task, Category } from '@/app/types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  index: number;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
  viewType: 'list' | 'card';
  categories: Category[];
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onStartTimer?: (task: Task) => void;
}

const ItemTypes = {
  TASK: 'task',
};

export function TaskItem({ task, onToggle, onEdit, onDelete, index, moveTask, viewType, categories, isSelected, onSelect, onStartTimer }: TaskItemProps) {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [urgencyColor, setUrgencyColor] = useState('');
  const [showSubtasks, setShowSubtasks] = useState(false);

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.TASK,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveTask(item.index, index);
        item.index = index;
      }
    },
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const deadline = new Date(task.deadline).getTime();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeRemaining('Overdue');
        setUrgencyColor('bg-red-100 dark:bg-red-900/20 border-red-400 dark:border-red-600');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      let timeStr = '';
      if (days > 0) {
        timeStr = `${days}d ${hours}h`;
      } else if (hours > 0) {
        timeStr = `${hours}h ${minutes}m`;
      } else {
        timeStr = `${minutes}m`;
      }
      setTimeRemaining(timeStr);

      // Set urgency color
      const hoursRemaining = diff / (1000 * 60 * 60);
      if (hoursRemaining <= 2) {
        setUrgencyColor('bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-700');
      } else if (hoursRemaining <= 24) {
        setUrgencyColor('bg-orange-50 dark:bg-orange-900/10 border-orange-300 dark:border-orange-700');
      } else if (hoursRemaining <= 48) {
        setUrgencyColor('bg-yellow-50 dark:bg-yellow-900/10 border-yellow-300 dark:border-yellow-700');
      } else {
        setUrgencyColor('bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-700');
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);

    return () => clearInterval(timer);
  }, [task.deadline]);

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
    }
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    if (isToday) return `Today, ${timeStr}`;
    if (isTomorrow) return `Tomorrow, ${timeStr}`;

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isOverdue = new Date(task.deadline).getTime() < new Date().getTime();

  const getCategoryColor = () => {
    if (!task.category) return '';
    const cat = categories.find(c => c.name === task.category);
    return cat?.color || '#3b82f6';
  };

  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  if (viewType === 'card') {
    return (
      <motion.div
        ref={(node) => preview(drop(node))}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`bg-white dark:bg-gray-800 rounded-xl border-2 p-4 shadow-sm hover:shadow-md transition-all ${
          task.completed ? 'opacity-60' : urgencyColor
        } ${isDragging ? 'opacity-50' : ''} ${isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
      >
        <div className="flex items-start gap-3">
          {onSelect && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(task.id)}
              className="mt-1.5 w-4 h-4 text-blue-600 rounded"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          
          <div ref={drag} className="cursor-move mt-1">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          
          <button
            onClick={() => onToggle(task.id)}
            className="mt-0.5 flex-shrink-0"
          >
            {task.completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400 hover:text-blue-500" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className={`font-semibold text-gray-900 dark:text-white ${task.completed ? 'line-through' : ''}`}>
                {task.title}
              </h3>
              <div className={`w-3 h-3 rounded-full ${getPriorityColor()} flex-shrink-0`} />
            </div>

            {task.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Category and Tags */}
            {(task.category || task.tags?.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-3">
                {task.category && (
                  <span 
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white"
                    style={{ backgroundColor: getCategoryColor() }}
                  >
                    {task.category}
                  </span>
                )}
                {task.tags?.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Subtasks Progress */}
            {totalSubtasks > 0 && (
              <div className="mb-3">
                <button
                  onClick={() => setShowSubtasks(!showSubtasks)}
                  className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-1"
                >
                  {showSubtasks ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  Subtasks: {completedSubtasks}/{totalSubtasks}
                </button>
                {showSubtasks && (
                  <div className="space-y-1 pl-5">
                    {task.subtasks?.map(subtask => (
                      <div key={subtask.id} className="flex items-center gap-2">
                        <Circle className={`w-3 h-3 ${subtask.completed ? 'text-green-500 fill-green-500' : 'text-gray-400'}`} />
                        <span className={`text-xs ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 text-xs mb-3">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatDeadline(task.deadline)}</span>
              </div>
              {!task.completed && (
                <div className={`flex items-center gap-1 font-medium ${isOverdue ? 'text-red-600' : 'text-blue-600 dark:text-blue-400'}`}>
                  {isOverdue && <AlertCircle className="w-3.5 h-3.5" />}
                  <span>{timeRemaining}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {onStartTimer && !task.completed && (
                <button
                  onClick={() => onStartTimer(task)}
                  className="p-1.5 hover:bg-green-100 dark:hover:bg-green-900/30 rounded text-green-600 dark:text-green-400 transition-colors"
                  title="Start Pomodoro Timer"
                >
                  <Play className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={(node) => preview(drop(node))}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`bg-white dark:bg-gray-800 rounded-lg border-2 p-4 shadow-sm hover:shadow-md transition-all ${
        task.completed ? 'opacity-60' : urgencyColor
      } ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div ref={drag} className="cursor-move">
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
        
        <button
          onClick={() => onToggle(task.id)}
          className="flex-shrink-0"
        >
          {task.completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <Circle className="w-6 h-6 text-gray-400 hover:text-blue-500" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold text-gray-900 dark:text-white ${task.completed ? 'line-through' : ''}`}>
              {task.title}
            </h3>
            <div className={`w-2.5 h-2.5 rounded-full ${getPriorityColor()}`} />
          </div>
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDeadline(task.deadline)}</span>
            </div>
            {!task.completed && (
              <div className={`flex items-center gap-1 font-medium ${isOverdue ? 'text-red-600' : 'text-blue-600 dark:text-blue-400'}`}>
                {isOverdue && <AlertCircle className="w-3.5 h-3.5" />}
                <span>{timeRemaining}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
