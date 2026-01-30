import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { Task } from "@/app/types";
import {
  Calendar,
  TrendingUp,
  Clock,
  Target,
  Activity,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

interface LiveStatisticsProps {
  tasks: Task[];
  onClose: () => void;
}

export function LiveStatistics({ tasks, onClose }: LiveStatisticsProps) {
  const [animationKey, setAnimationKey] = useState(0);

  // Trigger re-animation every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const completedTasks = tasks.filter((t) => t.completed);
  const activeTasks = tasks.filter((t) => !t.completed && !t.archived);
  const archivedTasks = tasks.filter((t) => t.archived);

  const overdueTasks = activeTasks.filter(
    (t) => new Date(t.deadline) < new Date(),
  );
  const todayTasks = tasks.filter((t) => {
    const taskDate = new Date(t.deadline);
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  });

  const completionRate =
    tasks.length > 0
      ? ((completedTasks.length / tasks.length) * 100).toFixed(1)
      : 0;
  const totalTimeSpent = tasks.reduce(
    (acc, task) => acc + (task.timeSpent || 0),
    0,
  );

  const priorityData = [
    {
      name: "High",
      value: tasks.filter((t) => t.priority === "high").length,
      color: "#ef4444",
    },
    {
      name: "Medium",
      value: tasks.filter((t) => t.priority === "medium").length,
      color: "#f59e0b",
    },
    {
      name: "Low",
      value: tasks.filter((t) => t.priority === "low").length,
      color: "#10b981",
    },
  ];

  const statusData = [
    { name: "Active", value: activeTasks.length, color: "#3b82f6" },
    { name: "Completed", value: completedTasks.length, color: "#10b981" },
    { name: "Archived", value: archivedTasks.length, color: "#9ca3af" },
  ];

  // 14 days trend (more data for better visualization)
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    return date;
  });

  const completionTrend = last14Days.map((date) => {
    const dateStr = date.toDateString();
    const created = tasks.filter((t) => {
      const createdDate = new Date(t.createdAt);
      return createdDate.toDateString() === dateStr;
    }).length;

    const completed = tasks.filter((t) => {
      const completedDate = new Date(t.createdAt);
      return t.completed && completedDate.toDateString() === dateStr;
    }).length;

    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      completed,
      created,
      active: created - completed,
    };
  });

  // Hourly productivity pattern
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const tasksAtHour = tasks.filter((t) => {
      const deadline = new Date(t.deadline);
      return deadline.getHours() === hour;
    }).length;

    return {
      hour:
        hour === 0
          ? "12 AM"
          : hour < 12
            ? `${hour} AM`
            : hour === 12
              ? "12 PM"
              : `${hour - 12} PM`,
      tasks: tasksAtHour,
    };
  }).filter((d) => d.tasks > 0);

  const categoryStats = tasks.reduce(
    (acc, task) => {
      const cat = task.category || "Uncategorized";
      if (!acc[cat]) {
        acc[cat] = { total: 0, completed: 0, percentage: 0 };
      }
      acc[cat].total++;
      if (task.completed) acc[cat].completed++;
      acc[cat].percentage = (acc[cat].completed / acc[cat].total) * 100;
      return acc;
    },
    {} as Record<
      string,
      { total: number; completed: number; percentage: number }
    >,
  );

  const categoryChartData = Object.entries(categoryStats).map(
    ([name, data]) => ({
      name,
      completed: data.completed,
      pending: data.total - data.completed,
    }),
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 animate-pulse" />
            Live Analytics Dashboard
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Animated Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Target,
                label: "Total Tasks",
                value: tasks.length,
                color: "blue",
                gradient: "from-blue-500 to-blue-600",
              },
              {
                icon: TrendingUp,
                label: "Completion Rate",
                value: `${completionRate}%`,
                color: "green",
                gradient: "from-green-500 to-emerald-600",
              },
              {
                icon: Clock,
                label: "Time Tracked",
                value: `${Math.round(totalTimeSpent / 60)}h`,
                color: "purple",
                gradient: "from-purple-500 to-purple-600",
              },
              {
                icon: Zap,
                label: "Active Tasks",
                value: activeTasks.length,
                color: "orange",
                gradient: "from-orange-500 to-red-600",
              },
            ].map((metric, idx) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-gradient-to-br ${metric.gradient} p-6 rounded-xl text-white shadow-lg relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className="w-8 h-8 opacity-80" />
                    <motion.span
                      key={`${metric.value}-${animationKey}`}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-3xl font-bold"
                    >
                      {metric.value}
                    </motion.span>
                  </div>
                  <p className="text-sm opacity-90 font-medium">
                    {metric.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Today's Tasks",
                value: todayTasks.length,
                color:
                  "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
              },
              {
                label: "Overdue",
                value: overdueTasks.length,
                color:
                  "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
              },
              {
                label: "Completed",
                value: completedTasks.length,
                color:
                  "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
              },
              {
                label: "Archived",
                value: archivedTasks.length,
                color:
                  "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
              },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
                className={`${stat.color} p-4 rounded-lg shadow-sm`}
              >
                <motion.p
                  key={`${stat.value}-${animationKey}`}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl font-bold"
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm opacity-80">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Animated Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 14-Day Trend with Area Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 shadow-lg lg:col-span-2"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                14-Day Activity Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={completionTrend} key={animationKey}>
                  <defs>
                    <linearGradient
                      id="colorCompleted"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#10b981"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorCreated"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                    animationDuration={2000}
                  />
                  <Area
                    type="monotone"
                    dataKey="created"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorCreated)"
                    animationDuration={2000}
                  />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Animated Priority Distribution Pie */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Priority Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart key={animationKey}>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={2000}
                    animationBegin={0}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Animated Status Distribution Pie */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Task Status Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart key={animationKey}>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={2000}
                    animationBegin={0}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Category Performance */}
            {categoryChartData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 shadow-lg lg:col-span-2"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Category Performance
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryChartData} key={animationKey}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="completed"
                      stackId="a"
                      fill="#10b981"
                      radius={[0, 0, 0, 0]}
                      animationDuration={2000}
                    />
                    <Bar
                      dataKey="pending"
                      stackId="a"
                      fill="#f59e0b"
                      radius={[8, 8, 0, 0]}
                      animationDuration={2000}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* Hourly Activity Pattern */}
            {hourlyData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 shadow-lg lg:col-span-2"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Hourly Productivity Pattern
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={hourlyData} key={animationKey}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="hour"
                      stroke="#9ca3af"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="tasks"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ fill: "#8b5cf6", r: 5 }}
                      animationDuration={2000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
