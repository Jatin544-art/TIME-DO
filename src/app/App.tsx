import { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plus, Undo, BarChart3, FolderOpen, Download, History, Trophy, FileText, Zap, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast, Toaster } from 'sonner';
import { Header } from '@/app/components/Header';
import { TaskForm } from '@/app/components/TaskForm';
import { TaskItem } from '@/app/components/TaskItem';
import { Filters } from '@/app/components/Filters';
import { Footer } from '@/app/components/Footer';
import { ProgressBar } from '@/app/components/ProgressBar';
import { LiveStatistics } from '@/app/components/LiveStatistics';
import { CategoryManager } from '@/app/components/CategoryManager';
import { ExportImport } from '@/app/components/ExportImport';
import { CalendarView } from '@/app/components/CalendarView';
import { TaskHistory } from '@/app/components/TaskHistory';
import { Achievements } from '@/app/components/Achievements';
import { TaskTemplates } from '@/app/components/TaskTemplates';
import { PomodoroTimer } from '@/app/components/PomodoroTimer';
import { BulkActions } from '@/app/components/BulkActions';
import { QuickAdd } from '@/app/components/QuickAdd';
import { LoginPage } from '@/app/components/LoginPage';
import { UserProfile } from '@/app/components/UserProfile';
import { WelcomeModal } from '@/app/components/WelcomeModal';
import { AllUsersView } from '@/app/components/AllUsersView';
import { Task, FilterType, ViewType, SortType, Category } from '@/app/types';
import { User } from '@/app/types/auth';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [dateFilter, setDateFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [viewType, setViewType] = useState<ViewType>('list');
  const [sortType, setSortType] = useState<SortType>('deadline');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [deletedTask, setDeletedTask] = useState<Task | null>(null);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showExportImport, setShowExportImport] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [timerTask, setTimerTask] = useState<Task | null>(null);

  // Check for saved session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('timeDoCurrentUser');
    if (savedSession) {
      try {
        const user = JSON.parse(savedSession);
        setCurrentUser(user);
      } catch (e) {
        console.error('Failed to restore session', e);
      }
    }
    setIsLoading(false);
  }, []);

  // Load user-specific data when user changes
  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setCategories([]);
      return;
    }

    const userTasksKey = `tasks_${currentUser.code}`;
    const userCategoriesKey = `categories_${currentUser.code}`;

    const saved = localStorage.getItem(userTasksKey);
    if (saved) {
      try {
        const parsedTasks = JSON.parse(saved);
        setTasks(parsedTasks.map((task: any) => ({
          ...task,
          category: task.category || '',
          tags: task.tags || [],
          subtasks: task.subtasks || [],
          timeSpent: task.timeSpent || 0,
          archived: task.archived || false,
        })));
      } catch (e) {
        setTasks([]);
      }
    } else {
      setTasks([]);
    }

    const savedCategories = localStorage.getItem(userCategoriesKey);
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories([]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const userTasksKey = `tasks_${currentUser.code}`;
      localStorage.setItem(userTasksKey, JSON.stringify(tasks));
    }
  }, [tasks, currentUser]);

  useEffect(() => {
    if (currentUser) {
      const userCategoriesKey = `categories_${currentUser.code}`;
      localStorage.setItem(userCategoriesKey, JSON.stringify(categories));
    }
  }, [categories, currentUser]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('timeDoCurrentUser', JSON.stringify(user));
    
    // Check if this is first login
    const hasSeenWelcome = localStorage.getItem(`welcome_${user.code}`);
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      localStorage.setItem(`welcome_${user.code}`, 'true');
    }
    
    toast.success(`Welcome back, ${user.name}! 👋`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('timeDoCurrentUser');
    setTasks([]);
    setCategories([]);
    toast.success('Logged out successfully! 👋');
  };

  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    toast.success('Task added successfully! 🎉');
  };

  const quickAddTask = (title: string, priority: 'high' | 'medium' | 'low') => {
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + 6);

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description: '',
      priority,
      deadline: deadline.toISOString(),
      completed: false,
      createdAt: new Date().toISOString(),
      category: '',
      tags: [],
      subtasks: [],
      timeSpent: 0,
      archived: false,
    };

    setTasks((prev) => [...prev, newTask]);
    toast.success('Task added quickly! ⚡');
  };

  const updateTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    if (!editingTask) return;
    
    setTasks((prev) =>
      prev.map((task) =>
        task.id === editingTask.id
          ? { ...task, ...taskData }
          : task
      )
    );
    setEditingTask(null);
    toast.success('Task updated successfully! ✅');
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const newCompleted = !task.completed;
          
          if (newCompleted) {
            toast.success('Great job completing this task! 🎊');
          }
          
          // Handle recurring tasks
          if (newCompleted && task.recurring?.enabled) {
            const deadline = new Date(task.deadline);
            const { frequency, interval } = task.recurring;
            
            switch (frequency) {
              case 'daily':
                deadline.setDate(deadline.getDate() + interval);
                break;
              case 'weekly':
                deadline.setDate(deadline.getDate() + (interval * 7));
                break;
              case 'monthly':
                deadline.setMonth(deadline.getMonth() + interval);
                break;
            }
            
            const newTask: Task = {
              ...task,
              id: Date.now().toString(),
              deadline: deadline.toISOString(),
              completed: false,
              createdAt: new Date().toISOString(),
            };
            
            setTimeout(() => {
              setTasks(prev => [...prev, newTask]);
              toast.success('Recurring task created for next occurrence! 🔄');
            }, 500);
          }
          
          return { ...task, completed: newCompleted };
        }
        return task;
      })
    );
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find((task) => task.id === id);
    if (taskToDelete) {
      setDeletedTask(taskToDelete);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success('Task deleted', {
        action: {
          label: 'Undo',
          onClick: () => undoDelete(),
        },
      });
    }
  };

  const undoDelete = () => {
    if (deletedTask) {
      setTasks((prev) => [...prev, deletedTask]);
      setDeletedTask(null);
      toast.success('Task restored! 🔄');
    }
  };

  const moveTask = useCallback((dragIndex: number, hoverIndex: number) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      const [removed] = newTasks.splice(dragIndex, 1);
      newTasks.splice(hoverIndex, 0, removed);
      return newTasks;
    });
  }, []);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleImport = (importedTasks: Task[], importedCategories: Category[]) => {
    setTasks(prev => [...prev, ...importedTasks]);
    setCategories(prev => {
      const existingNames = prev.map(c => c.name);
      const newCategories = importedCategories.filter(c => !existingNames.includes(c.name));
      return [...prev, ...newCategories];
    });
  };

  const addCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      color,
    };
    setCategories(prev => [...prev, newCategory]);
    toast.success('Category added! 📁');
  };

  const editCategory = (id: string, name: string, color: string) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, name, color } : cat))
    );
    toast.success('Category updated! ✏️');
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    toast.success('Category deleted! 🗑️');
  };

  const handleUseTemplate = (templateData: Omit<Task, 'id' | 'completed' | 'createdAt' | 'deadline' | 'subtasks' | 'timeSpent' | 'archived'>) => {
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + 6);

    const newTask: Task = {
      ...templateData,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
      deadline: deadline.toISOString(),
      subtasks: [],
      timeSpent: 0,
      archived: false,
    };

    setTasks(prev => [...prev, newTask]);
    toast.success('Task created from template! 📋');
  };

  const handleTimeSpent = (taskId: string, minutes: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, timeSpent: (task.timeSpent || 0) + minutes }
          : task
      )
    );
  };

  const toggleTaskSelection = (id: string) => {
    setSelectedTasks(prev =>
      prev.includes(id)
        ? prev.filter(taskId => taskId !== id)
        : [...prev, id]
    );
  };

  const handleBulkComplete = () => {
    setTasks(prev =>
      prev.map(task =>
        selectedTasks.includes(task.id) ? { ...task, completed: true } : task
      )
    );
    setSelectedTasks([]);
    toast.success(`Completed ${selectedTasks.length} tasks! 🎉`);
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedTasks.length} tasks?`)) {
      setTasks(prev => prev.filter(task => !selectedTasks.includes(task.id)));
      setSelectedTasks([]);
      toast.success(`Deleted ${selectedTasks.length} tasks! 🗑️`);
    }
  };

  const handleBulkArchive = () => {
    setTasks(prev =>
      prev.map(task =>
        selectedTasks.includes(task.id) ? { ...task, archived: true } : task
      )
    );
    setSelectedTasks([]);
    toast.success(`Archived ${selectedTasks.length} tasks! 📦`);
  };

  const filterTasks = (tasks: Task[]) => {
    return tasks.filter((task) => {
      if (task.archived) return false;

      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPriority =
        priorityFilter === 'all' || task.priority === priorityFilter;

      const matchesCategory =
        !categoryFilter || task.category === categoryFilter;

      let matchesDate = true;
      if (dateFilter !== 'all') {
        const taskDate = new Date(task.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dateFilter === 'today') {
          matchesDate = taskDate.toDateString() === today.toDateString();
        } else if (dateFilter === 'tomorrow') {
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          matchesDate = taskDate.toDateString() === tomorrow.toDateString();
        } else if (dateFilter === 'week') {
          const weekFromNow = new Date(today);
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          matchesDate = taskDate >= today && taskDate <= weekFromNow;
        }
      }

      return matchesSearch && matchesPriority && matchesDate && matchesCategory;
    });
  };

  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      switch (sortType) {
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'deadline':
        default:
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
    });
  };

  const activeTasks = tasks.filter((task) => !task.completed && !task.archived);
  const completedTasks = tasks.filter((task) => task.completed && !task.archived);
  const filteredActiveTasks = sortTasks(filterTasks(activeTasks));
  const filteredCompletedTasks = filterTasks(completedTasks);

  const todaysTasks = tasks.filter((task) => {
    if (task.archived) return false;
    const taskDate = new Date(task.deadline);
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  });

  const overdueTasks = activeTasks.filter((task) => {
    return new Date(task.deadline).getTime() < new Date().getTime();
  });

  const progressPercentage =
    todaysTasks.length > 0
      ? (todaysTasks.filter((t) => t.completed).length / todaysTasks.length) * 100
      : 0;

  const uniqueCategories = Array.from(new Set(tasks.map(t => t.category).filter(Boolean)));

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full mx-auto mb-4"
          />
          <p className="text-white text-lg font-medium">Loading TIME-DO...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!currentUser) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <LoginPage onLogin={handleLogin} />
      </>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex flex-col">
        <Toaster position="top-right" richColors />
        <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
        
        {/* User Profile Bar */}
        <div className="max-w-7xl w-full mx-auto px-6 pt-6">
          <UserProfile user={currentUser} onLogout={handleLogout} />
        </div>
        
        {viewType !== 'calendar' && (
          <Filters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            viewType={viewType}
            onViewTypeChange={setViewType}
            sortType={sortType}
            onSortTypeChange={setSortType}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            categories={uniqueCategories}
          />
        )}

        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
          {/* Quick Action Buttons with improved styling */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 mb-6"
          >
            {[
              { icon: BarChart3, label: 'Live Stats', color: 'from-purple-600 to-pink-600', onClick: () => setShowStatistics(true) },
              { icon: FolderOpen, label: 'Categories', color: 'from-indigo-600 to-blue-600', onClick: () => setShowCategoryManager(true) },
              { icon: Download, label: 'Export/Import', color: 'from-teal-600 to-green-600', onClick: () => setShowExportImport(true) },
              { icon: History, label: 'History', color: 'from-orange-600 to-red-600', onClick: () => setShowHistory(true) },
              { icon: Trophy, label: 'Achievements', color: 'from-yellow-500 to-orange-500', onClick: () => setShowAchievements(true) },
              { icon: FileText, label: 'Templates', color: 'from-cyan-600 to-blue-600', onClick: () => setShowTemplates(true) },
              { icon: Users, label: 'All Users', color: 'from-pink-600 to-rose-600', onClick: () => setShowAllUsers(true) },
            ].map((btn, idx) => (
              <motion.button
                key={btn.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={btn.onClick}
                className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${btn.color} text-white rounded-lg transition-all shadow-md hover:shadow-lg`}
              >
                <btn.icon className="w-4 h-4" />
                <span className="font-medium">{btn.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Quick Add */}
          <div className="mb-6">
            <QuickAdd onAdd={quickAddTask} />
          </div>

          {viewType === 'calendar' ? (
            <CalendarView tasks={tasks.filter(t => !t.archived)} onTaskClick={handleEdit} />
          ) : (
            <>
              {todaysTasks.length > 0 && (
                <ProgressBar
                  percentage={progressPercentage}
                  total={todaysTasks.length}
                  completed={todaysTasks.filter((t) => t.completed).length}
                />
              )}

              {overdueTasks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-4 mb-6 shadow-md"
                >
                  <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2 text-lg flex items-center gap-2">
                    ⚠️ Overdue Tasks ({overdueTasks.length})
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    You have {overdueTasks.length} overdue task{overdueTasks.length !== 1 ? 's' : ''} that need immediate attention!
                  </p>
                </motion.div>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-blue-600" />
                  Active Tasks ({filteredActiveTasks.length})
                </h2>
                
                {filteredActiveTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center shadow-sm"
                  >
                    <div className="text-gray-400 dark:text-gray-500 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      {searchQuery || priorityFilter !== 'all' || dateFilter !== 'all' || categoryFilter
                        ? 'No tasks match your filters'
                        : 'No active tasks. Add a new task to get started!'}
                    </p>
                  </motion.div>
                ) : (
                  <div className={viewType === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                    <AnimatePresence>
                      {filteredActiveTasks.map((task, index) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onToggle={toggleTask}
                          onEdit={handleEdit}
                          onDelete={deleteTask}
                          index={index}
                          moveTask={moveTask}
                          viewType={viewType as 'list' | 'card'}
                          categories={categories}
                          isSelected={selectedTasks.includes(task.id)}
                          onSelect={toggleTaskSelection}
                          onStartTimer={setTimerTask}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {filteredCompletedTasks.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    ✓ Completed Tasks ({filteredCompletedTasks.length})
                  </h2>
                  <div className={viewType === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                    <AnimatePresence>
                      {filteredCompletedTasks.map((task, index) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onToggle={toggleTask}
                          onEdit={handleEdit}
                          onDelete={deleteTask}
                          index={index + filteredActiveTasks.length}
                          moveTask={moveTask}
                          viewType={viewType as 'list' | 'card'}
                          categories={categories}
                          isSelected={selectedTasks.includes(task.id)}
                          onSelect={toggleTaskSelection}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        <Footer
          totalTasks={tasks.filter(t => !t.archived).length}
          completedTasks={completedTasks.length}
          pendingTasks={activeTasks.length}
        />

        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowTaskForm(true)}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-5 rounded-full shadow-2xl transition-all z-40"
          aria-label="Add new task"
        >
          <Plus className="w-7 h-7" />
        </motion.button>

        <AnimatePresence>
          {deletedTask && (
            <motion.button
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              onClick={undoDelete}
              className="fixed bottom-8 left-8 bg-gray-800 hover:bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl transition-colors flex items-center gap-2 z-40"
            >
              <Undo className="w-5 h-5" />
              Undo Delete
            </motion.button>
          )}

          <BulkActions
            selectedTasks={selectedTasks}
            tasks={tasks}
            onBulkComplete={handleBulkComplete}
            onBulkDelete={handleBulkDelete}
            onBulkArchive={handleBulkArchive}
            onClearSelection={() => setSelectedTasks([])}
          />

          {showTaskForm && (
            <TaskForm
              onSubmit={editingTask ? updateTask : addTask}
              onClose={() => {
                setShowTaskForm(false);
                setEditingTask(null);
              }}
              editTask={editingTask}
              categories={categories}
            />
          )}
          
          {showStatistics && (
            <LiveStatistics tasks={tasks.filter(t => !t.archived)} onClose={() => setShowStatistics(false)} />
          )}
          
          {showCategoryManager && (
            <CategoryManager
              categories={categories}
              onAdd={addCategory}
              onEdit={editCategory}
              onDelete={deleteCategory}
              onClose={() => setShowCategoryManager(false)}
            />
          )}
          
          {showExportImport && (
            <ExportImport
              tasks={tasks}
              categories={categories}
              onImport={handleImport}
              onClose={() => setShowExportImport(false)}
            />
          )}

          {showHistory && (
            <TaskHistory
              tasks={tasks}
              onClose={() => setShowHistory(false)}
            />
          )}

          {showAchievements && (
            <Achievements
              tasks={tasks}
              onClose={() => setShowAchievements(false)}
            />
          )}

          {showTemplates && (
            <TaskTemplates
              onClose={() => setShowTemplates(false)}
              onUseTemplate={handleUseTemplate}
            />
          )}

          {timerTask && (
            <PomodoroTimer
              taskTitle={timerTask.title}
              onTimeSpent={(minutes) => handleTimeSpent(timerTask.id, minutes)}
              onClose={() => setTimerTask(null)}
            />
          )}

          {showWelcome && currentUser && (
            <WelcomeModal
              userName={currentUser.name}
              onClose={() => setShowWelcome(false)}
            />
          )}

          {showAllUsers && (
            <AllUsersView onClose={() => setShowAllUsers(false)} />
          )}
        </AnimatePresence>
      </div>
    </DndProvider>
  );
}

export default App;
