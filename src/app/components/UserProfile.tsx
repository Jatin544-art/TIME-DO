import { LogOut, User as UserIcon, Mail, Calendar, Shield } from 'lucide-react';
import { User } from '@/app/types/auth';
import { motion } from 'motion/react';

interface UserProfileProps {
  user: User;
  onLogout: () => void;
}

export function UserProfile({ user, onLogout }: UserProfileProps) {
  const handleLogoutConfirm = () => {
    if (confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {user.name}
              <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">PRO</span>
            </h3>
            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mt-1">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span className="font-mono font-bold">{user.code}</span>
              </div>
              {user.email && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span>{user.email}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogoutConfirm}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium shadow-md"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800 flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>Member since {memberSince}</span>
        </div>
      </div>
    </motion.div>
  );
}
