import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Task } from '@/app/types';

interface TaskHistoryProps {
  tasks: Task[];
  onClose: () => void;
}

export function TaskHistory({ tasks, onClose }: TaskHistoryProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return tasks.filter(task => {
      const taskDate = new Date(task.deadline);
      return taskDate.toDateString() === dateStr;
    });
  };

  const previousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const nextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const dayTasks = getTasksForDate(selectedDate);
  const completedTasks = dayTasks.filter(t => t.completed);
  const failedTasks = dayTasks.filter(t => !t.completed && new Date(t.deadline) < new Date());
  const pendingTasks = dayTasks.filter(t => !t.completed && new Date(t.deadline) >= new Date());

  const completionRate = dayTasks.length > 0 
    ? Math.round((completedTasks.length / dayTasks.length) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Task History
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Date Navigation */}
          <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl">
            <button
              onClick={previousDay}
              className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            
            <div className="flex items-center gap-4">
              <button
                onClick={goToToday}
                className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Today
              </button>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                </div>
              </div>
            </div>

            <button
              onClick={nextDay}
              className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
              disabled={selectedDate.toDateString() === new Date().toDateString()}
            >
              <ChevronRight className={`w-5 h-5 ${
                selectedDate.toDateString() === new Date().toDateString()
                  ? 'text-gray-300 dark:text-gray-600'
                  : 'text-gray-600 dark:text-gray-400'
              }`} />
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{dayTasks.length}</div>
              <div className="text-sm text-blue-800 dark:text-blue-300">Total Tasks</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{completedTasks.length}</div>
              <div className="text-sm text-green-800 dark:text-green-300">Completed</div>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{failedTasks.length}</div>
              <div className="text-sm text-red-800 dark:text-red-300">Failed</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{completionRate}%</div>
              <div className="text-sm text-purple-800 dark:text-purple-300">Success Rate</div>
            </div>
          </div>

          {/* Tasks List */}
          {dayTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No tasks for this date</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedTasks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Completed ({completedTasks.length})
                  </h3>
                  <div className="space-y-2">
                    {completedTasks.map(task => (
                      <div key={task.id} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white line-through">{task.title}</h4>
                            {task.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            {new Date(task.deadline).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {failedTasks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Failed/Overdue ({failedTasks.length})
                  </h3>
                  <div className="space-y-2">
                    {failedTasks.map(task => (
                      <div key={task.id} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                            {task.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            {new Date(task.deadline).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pendingTasks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Pending ({pendingTasks.length})
                  </h3>
                  <div className="space-y-2">
                    {pendingTasks.map(task => (
                      <div key={task.id} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                            {task.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            {new Date(task.deadline).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
