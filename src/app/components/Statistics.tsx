import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Task } from '@/app/types';
import { Calendar, TrendingUp, Clock, Target } from 'lucide-react';

interface StatisticsProps {
  tasks: Task[];
  onClose: () => void;
}

export function Statistics({ tasks, onClose }: StatisticsProps) {
  const completedTasks = tasks.filter(t => t.completed);
  const activeTasks = tasks.filter(t => !t.completed && !t.archived);
  const archivedTasks = tasks.filter(t => t.archived);
  
  const overdueTasks = activeTasks.filter(t => new Date(t.deadline) < new Date());
  const todayTasks = tasks.filter(t => {
    const taskDate = new Date(t.deadline);
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  });

  const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length * 100).toFixed(1) : 0;
  const totalTimeSpent = tasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0);
  
  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#10b981' },
  ];

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const completionTrend = last7Days.map(date => {
    const dateStr = date.toDateString();
    const completed = tasks.filter(t => {
      const completedDate = new Date(t.createdAt);
      return t.completed && completedDate.toDateString() === dateStr;
    }).length;
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      completed,
    };
  });

  const categoryStats = tasks.reduce((acc, task) => {
    const cat = task.category || 'Uncategorized';
    if (!acc[cat]) {
      acc[cat] = { total: 0, completed: 0 };
    }
    acc[cat].total++;
    if (task.completed) acc[cat].completed++;
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Statistics & Analytics
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{tasks.length}</span>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Total Tasks</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-green-600 dark:text-green-400" />
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">{completionRate}%</span>
              </div>
              <p className="text-sm text-green-800 dark:text-green-300 font-medium">Completion Rate</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round(totalTimeSpent / 60)}h
                </span>
              </div>
              <p className="text-sm text-purple-800 dark:text-purple-300 font-medium">Time Tracked</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">{activeTasks.length}</span>
              </div>
              <p className="text-sm text-orange-800 dark:text-orange-300 font-medium">Active Tasks</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayTasks.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Today's Tasks</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{overdueTasks.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTasks.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{archivedTasks.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Archived</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Completion Trend */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">7-Day Completion Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={completionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="completed" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Priority Distribution */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Priority Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Performance</h3>
            <div className="space-y-3">
              {Object.entries(categoryStats).map(([category, stats]) => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {stats.completed} / {stats.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
