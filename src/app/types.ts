export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  completed: boolean;
  createdAt: string;
  category: string;
  tags: string[];
  subtasks: SubTask[];
  recurring?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
  };
  timeSpent: number; // in minutes
  archived: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export type FilterType = 'all' | 'today' | 'tomorrow' | 'week';
export type ViewType = 'list' | 'card' | 'calendar';
export type SortType = 'deadline' | 'priority' | 'created' | 'alphabetical';
