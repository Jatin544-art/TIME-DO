import { motion } from 'motion/react';
import { Sparkles, Target, Zap, Trophy, Clock } from 'lucide-react';

interface WelcomeModalProps {
  userName: string;
  onClose: () => void;
}

export function WelcomeModal({ userName, onClose }: WelcomeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
        
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-center mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome to TIME-DO, {userName}! 🎉
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your personal productivity powerhouse is ready!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              {
                icon: Target,
                title: 'Smart Tasks',
                description: 'Add tasks with priorities, categories, and smart deadlines',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: Zap,
                title: 'Quick Actions',
                description: 'Bulk operations, templates, and lightning-fast task creation',
                color: 'from-purple-500 to-purple-600',
              },
              {
                icon: Clock,
                title: 'Pomodoro Timer',
                description: 'Built-in focus timer to boost your productivity',
                color: 'from-green-500 to-emerald-600',
              },
              {
                icon: Trophy,
                title: 'Achievements',
                description: 'Unlock achievements and track your progress',
                color: 'from-yellow-500 to-orange-500',
              },
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-600"
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-3`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6"
          >
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              🚀 Quick Tips:
            </h4>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>• Use the <span className="font-semibold">Quick Add</span> button for instant task creation</li>
              <li>• Check <span className="font-semibold">Live Stats</span> to see beautiful real-time analytics</li>
              <li>• Save your <span className="font-semibold">5-digit code</span> to access your data anytime</li>
              <li>• All your data is saved locally and private to your account</li>
            </ul>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg transition-all shadow-lg"
          >
            Let's Get Started! 🎯
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
