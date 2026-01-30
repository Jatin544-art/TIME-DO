import { Trophy, Flame, Target, Zap, Star, Award } from 'lucide-react';
import { Task } from '@/app/types';
import { motion } from 'motion/react';

interface AchievementsProps {
  tasks: Task[];
  onClose: () => void;
}

export function Achievements({ tasks, onClose }: AchievementsProps) {
  const completedTasks = tasks.filter(t => t.completed);
  
  // Calculate streak
  const calculateStreak = () => {
    const sortedTasks = [...tasks]
      .filter(t => t.completed)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    if (sortedTasks.length === 0) return 0;
    
    let streak = 1;
    let currentDate = new Date(sortedTasks[0].createdAt);
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 1; i < sortedTasks.length; i++) {
      const taskDate = new Date(sortedTasks[i].createdAt);
      taskDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
        currentDate = taskDate;
      } else if (diffDays > 1) {
        break;
      }
    }
    
    return streak;
  };

  const streak = calculateStreak();
  const totalTimeSpent = tasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0);
  const highPriorityCompleted = completedTasks.filter(t => t.priority === 'high').length;

  const achievements = [
    {
      id: 'first-task',
      title: 'Getting Started',
      description: 'Complete your first task',
      icon: Star,
      unlocked: completedTasks.length >= 1,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'task-master-10',
      title: 'Task Master',
      description: 'Complete 10 tasks',
      icon: Trophy,
      unlocked: completedTasks.length >= 10,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      id: 'task-legend-50',
      title: 'Task Legend',
      description: 'Complete 50 tasks',
      icon: Award,
      unlocked: completedTasks.length >= 50,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'streak-7',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: Flame,
      unlocked: streak >= 7,
      color: 'from-orange-500 to-red-600',
    },
    {
      id: 'high-priority-master',
      title: 'Priority Pro',
      description: 'Complete 20 high-priority tasks',
      icon: Zap,
      unlocked: highPriorityCompleted >= 20,
      color: 'from-red-500 to-pink-600',
    },
    {
      id: 'time-warrior',
      title: 'Time Warrior',
      description: 'Spend 500 minutes on tasks',
      icon: Target,
      unlocked: totalTimeSpent >= 500,
      color: 'from-green-500 to-teal-600',
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-600" />
                Achievements
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {unlockedCount} of {totalAchievements} unlocked
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(unlockedCount / totalAchievements) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl text-center border border-blue-200 dark:border-blue-800">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{completedTasks.length}</div>
              <div className="text-sm text-blue-800 dark:text-blue-300">Tasks Done</div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl text-center border border-orange-200 dark:border-orange-800">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 flex items-center justify-center gap-1">
                <Flame className="w-6 h-6" />
                {streak}
              </div>
              <div className="text-sm text-orange-800 dark:text-orange-300">Day Streak</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl text-center border border-purple-200 dark:border-purple-800">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{Math.round(totalTimeSpent / 60)}h</div>
              <div className="text-sm text-purple-800 dark:text-purple-300">Time Spent</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl text-center border border-green-200 dark:border-green-800">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{highPriorityCompleted}</div>
              <div className="text-sm text-green-800 dark:text-green-300">High Priority</div>
            </div>
          </div>

          {/* Achievement Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-xl border-2 ${
                  achievement.unlocked
                    ? 'border-yellow-300 dark:border-yellow-700 bg-gradient-to-br ' + achievement.color
                    : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      achievement.unlocked
                        ? 'bg-white/20 backdrop-blur'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      <achievement.icon className={`w-8 h-8 ${
                        achievement.unlocked ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg mb-1 ${
                        achievement.unlocked ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-sm ${
                        achievement.unlocked ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>

                    {achievement.unlocked && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', delay: index * 0.1 + 0.3 }}
                      >
                        <Trophy className="w-6 h-6 text-yellow-300" />
                      </motion.div>
                    )}
                  </div>
                </div>
                
                {!achievement.unlocked && (
                  <div className="absolute inset-0 bg-gray-900/10 dark:bg-gray-900/30 backdrop-blur-[1px]" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
