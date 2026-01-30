import { useState, useEffect } from 'react';
import { LogIn, UserPlus, Lock, User as UserIcon, Mail, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '@/app/types/auth';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    const savedUsers = localStorage.getItem('timeDoUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  const generateUniqueCode = (): string => {
    let newCode: string;
    do {
      newCode = Math.floor(10000 + Math.random() * 90000).toString();
    } while (users.some(user => user.code === newCode));
    return newCode;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    const newCode = generateUniqueCode();
    const newUser: User = {
      code: newCode,
      name: name.trim(),
      email: email.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('timeDoUsers', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    // Show the generated code
    setCode(newCode);
    setShowCode(true);
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (code.length !== 5) {
      setError('Code must be exactly 5 digits');
      return;
    }

    const user = users.find(u => u.code === code);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid code. Please check and try again.');
      setCode('');
    }
  };

  const handleContinueAfterRegister = () => {
    const user = users.find(u => u.code === code);
    if (user) {
      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 relative z-10 backdrop-blur-xl bg-white/95 dark:bg-gray-800/95"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            TIME-DO
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your Personal Productivity Hub
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
          <button
            onClick={() => {
              setMode('login');
              setError('');
              setShowCode(false);
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-md'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <LogIn className="w-4 h-4 inline mr-2" />
            Login
          </button>
          <button
            onClick={() => {
              setMode('register');
              setError('');
              setShowCode(false);
              setCode('');
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              mode === 'register'
                ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-md'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <UserPlus className="w-4 h-4 inline mr-2" />
            Register
          </button>
        </div>

        <AnimatePresence mode="wait">
          {showCode ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-6"
            >
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl p-6">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Registration Successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Your unique access code:
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border-2 border-green-400 dark:border-green-600">
                  <p className="text-5xl font-bold text-green-600 dark:text-green-400 tracking-wider tabular-nums">
                    {code}
                  </p>
                </div>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  ⚠️ Save this code! You'll need it to login.
                </p>
              </div>
              
              <button
                onClick={handleContinueAfterRegister}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-medium transition-all shadow-lg"
              >
                Continue to TIME-DO
              </button>
            </motion.div>
          ) : mode === 'login' ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleLogin}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter Your 5-Digit Code
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                      setCode(value);
                      setError('');
                    }}
                    placeholder="12345"
                    maxLength={5}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg tracking-widest text-center font-bold"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-3 text-red-700 dark:text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={code.length !== 5}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all shadow-lg disabled:shadow-none"
              >
                Login to TIME-DO
              </button>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Total registered users: <span className="font-bold text-blue-600 dark:text-blue-400">{users.length}</span>
              </p>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleRegister}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError('');
                    }}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email (Optional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-3 text-red-700 dark:text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium mb-1">📝 What happens next?</p>
                <p>We'll generate a unique 5-digit code for you. Save it to access your tasks anytime!</p>
              </div>

              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all shadow-lg disabled:shadow-none"
              >
                Create Account & Get Code
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
