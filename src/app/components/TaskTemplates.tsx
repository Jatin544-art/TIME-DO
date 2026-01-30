import { useState } from 'react';
import { FileText, Plus, Trash2, Check } from 'lucide-react';
import { Task } from '@/app/types';

interface Template {
  id: string;
  name: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  tags: string[];
  estimatedHours: number;
}

interface TaskTemplatesProps {
  onClose: () => void;
  onUseTemplate: (template: Omit<Task, 'id' | 'completed' | 'createdAt' | 'deadline' | 'subtasks' | 'timeSpent' | 'archived'>) => void;
}

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: '1',
    name: 'Study Session',
    title: 'Study [Subject]',
    description: 'Complete study session with notes and practice problems',
    priority: 'high',
    category: 'Study',
    tags: ['study', 'education'],
    estimatedHours: 2,
  },
  {
    id: '2',
    name: 'Assignment',
    title: '[Course] Assignment',
    description: 'Complete and submit assignment',
    priority: 'high',
    category: 'Homework',
    tags: ['assignment', 'deadline'],
    estimatedHours: 3,
  },
  {
    id: '3',
    name: 'Project Work',
    title: 'Work on [Project Name]',
    description: 'Continue project development and documentation',
    priority: 'medium',
    category: 'Project',
    tags: ['project', 'development'],
    estimatedHours: 4,
  },
  {
    id: '4',
    name: 'Research',
    title: 'Research [Topic]',
    description: 'Gather sources and take notes on topic',
    priority: 'medium',
    category: 'Research',
    tags: ['research', 'reading'],
    estimatedHours: 2,
  },
  {
    id: '5',
    name: 'Meeting',
    title: '[Meeting Name]',
    description: 'Attend meeting and take notes',
    priority: 'medium',
    category: 'Meeting',
    tags: ['meeting', 'collaboration'],
    estimatedHours: 1,
  },
  {
    id: '6',
    name: 'Exercise',
    title: 'Workout Session',
    description: 'Complete daily exercise routine',
    priority: 'low',
    category: 'Health',
    tags: ['health', 'fitness'],
    estimatedHours: 1,
  },
];

export function TaskTemplates({ onClose, onUseTemplate }: TaskTemplatesProps) {
  const [templates, setTemplates] = useState<Template[]>(() => {
    const saved = localStorage.getItem('taskTemplates');
    return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES;
  });

  const [customTemplate, setCustomTemplate] = useState({
    name: '',
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    category: '',
    tags: '',
    estimatedHours: 2,
  });

  const saveTemplates = (newTemplates: Template[]) => {
    setTemplates(newTemplates);
    localStorage.setItem('taskTemplates', JSON.stringify(newTemplates));
  };

  const addCustomTemplate = () => {
    if (!customTemplate.name || !customTemplate.title) return;

    const newTemplate: Template = {
      id: Date.now().toString(),
      name: customTemplate.name,
      title: customTemplate.title,
      description: customTemplate.description,
      priority: customTemplate.priority,
      category: customTemplate.category,
      tags: customTemplate.tags.split(',').map(t => t.trim()).filter(Boolean),
      estimatedHours: customTemplate.estimatedHours,
    };

    saveTemplates([...templates, newTemplate]);
    setCustomTemplate({
      name: '',
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      tags: '',
      estimatedHours: 2,
    });
  };

  const deleteTemplate = (id: string) => {
    saveTemplates(templates.filter(t => t.id !== id));
  };

  const useTemplate = (template: Template) => {
    onUseTemplate({
      title: template.title,
      description: template.description,
      priority: template.priority,
      category: template.category,
      tags: template.tags,
      recurring: undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-600" />
            Task Templates
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Create Custom Template */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create Custom Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={customTemplate.name}
                onChange={(e) => setCustomTemplate({ ...customTemplate, name: e.target.value })}
                placeholder="Template Name"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                value={customTemplate.title}
                onChange={(e) => setCustomTemplate({ ...customTemplate, title: e.target.value })}
                placeholder="Task Title"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                value={customTemplate.description}
                onChange={(e) => setCustomTemplate({ ...customTemplate, description: e.target.value })}
                placeholder="Description"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white md:col-span-2"
              />
              <select
                value={customTemplate.priority}
                onChange={(e) => setCustomTemplate({ ...customTemplate, priority: e.target.value as 'high' | 'medium' | 'low' })}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <input
                type="text"
                value={customTemplate.category}
                onChange={(e) => setCustomTemplate({ ...customTemplate, category: e.target.value })}
                placeholder="Category"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                value={customTemplate.tags}
                onChange={(e) => setCustomTemplate({ ...customTemplate, tags: e.target.value })}
                placeholder="Tags (comma separated)"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white md:col-span-2"
              />
            </div>
            <button
              onClick={addCustomTemplate}
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Template
            </button>
          </div>

          {/* Templates Grid */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Available Templates ({templates.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{template.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{template.title}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      template.priority === 'high'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        : template.priority === 'medium'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    }`}>
                      {template.priority}
                    </div>
                  </div>

                  {template.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
                  )}

                  {template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => useTemplate(template)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Check className="w-4 h-4" />
                      Use Template
                    </button>
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
