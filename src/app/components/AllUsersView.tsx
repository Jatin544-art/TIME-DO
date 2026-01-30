import { useState, useEffect } from 'react';
import { Users, Search, Calendar, Mail, Shield, TrendingUp } from 'lucide-react';
import { User } from '@/app/types/auth';
import { motion } from 'motion/react';

interface AllUsersViewProps {
  onClose: () => void;
}

export function AllUsersView({ onClose }: AllUsersViewProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedUsers = localStorage.getItem('timeDoUsers');
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);
      // Sort by creation date, newest first
      parsedUsers.sort((a: User, b: User) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setUsers(parsedUsers);
    }
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.code.includes(searchQuery) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getUserTaskCount = (code: string) => {
    const userTasks = localStorage.getItem(`tasks_${code}`);
    if (userTasks) {
      try {
        const tasks = JSON.parse(userTasks);
        return {
          total: tasks.length,
          completed: tasks.filter((t: any) => t.completed).length,
        };
      } catch (e) {
        return { total: 0, completed: 0 };
      }
    }
    return { total: 0, completed: 0 };
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6" />
              All Registered Users
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Total: {users.length} users
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, code, or email..."
              className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No users found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredUsers.map((user, index) => {
                const taskStats = getUserTaskCount(user.code);
                const completionRate = taskStats.total > 0 
                  ? Math.round((taskStats.completed / taskStats.total) * 100)
                  : 0;

                return (
                  <motion.div
                    key={user.code}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">
                          {user.name}
                        </h3>
                        
                        <div className="space-y-1.5 mt-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Shield className="w-4 h-4 flex-shrink-0" />
                            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                              {user.code}
                            </span>
                          </div>

                          {user.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Mail className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{user.email}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span>
                              Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Task Stats */}
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                              <span className="text-gray-700 dark:text-gray-300">
                                <span className="font-bold text-gray-900 dark:text-white">{taskStats.total}</span> tasks
                              </span>
                            </div>
                            {taskStats.total > 0 && (
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                                    style={{ width: `${completionRate}%` }}
                                  />
                                </div>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                  {completionRate}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Showing {filteredUsers.length} of {users.length} users</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              TIME-DO Analytics Dashboard
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
