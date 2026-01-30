import { Search, Grid, List, Filter, Calendar, ArrowUpDown } from 'lucide-react';
import { FilterType, ViewType, SortType } from '@/app/types';

interface FiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priorityFilter: 'all' | 'high' | 'medium' | 'low';
  onPriorityFilterChange: (filter: 'all' | 'high' | 'medium' | 'low') => void;
  dateFilter: FilterType;
  onDateFilterChange: (filter: FilterType) => void;
  viewType: ViewType;
  onViewTypeChange: (view: ViewType) => void;
  sortType: SortType;
  onSortTypeChange: (sort: SortType) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  categories: string[];
}

export function Filters({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  dateFilter,
  onDateFilterChange,
  viewType,
  onViewTypeChange,
  sortType,
  onSortTypeChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
}: FiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewTypeChange('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewType === 'list'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewTypeChange('card')}
              className={`p-2 rounded-lg transition-colors ${
                viewType === 'card'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              aria-label="Card view"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewTypeChange('calendar')}
              className={`p-2 rounded-lg transition-colors ${
                viewType === 'calendar'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              aria-label="Calendar view"
            >
              <Calendar className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Date:</span>
            <div className="flex gap-2">
              {(['all', 'today', 'tomorrow', 'week'] as FilterType[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => onDateFilterChange(filter)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    dateFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter === 'today' ? 'Today' : filter === 'tomorrow' ? 'Tomorrow' : 'This Week'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority:</span>
            <div className="flex gap-2">
              {(['all', 'high', 'medium', 'low'] as const).map((priority) => (
                <button
                  key={priority}
                  onClick={() => onPriorityFilterChange(priority)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    priorityFilter === priority
                      ? priority === 'high'
                        ? 'bg-red-600 text-white'
                        : priority === 'medium'
                        ? 'bg-yellow-600 text-white'
                        : priority === 'low'
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {categories.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => onCategoryFilterChange(e.target.value)}
                className="px-3 py-1 rounded-lg text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort:</span>
            <select
              value={sortType}
              onChange={(e) => onSortTypeChange(e.target.value as SortType)}
              className="px-3 py-1 rounded-lg text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
            >
              <option value="deadline">Deadline</option>
              <option value="priority">Priority</option>
              <option value="created">Date Created</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
