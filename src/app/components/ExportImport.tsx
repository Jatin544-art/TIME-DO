import { Download, Upload, FileJson, FileSpreadsheet } from 'lucide-react';
import { Task, Category } from '@/app/types';
import { toast } from 'sonner';

interface ExportImportProps {
  tasks: Task[];
  categories: Category[];
  onImport: (tasks: Task[], categories: Category[]) => void;
  onClose: () => void;
}

export function ExportImport({ tasks, categories, onImport, onClose }: ExportImportProps) {
  const exportToJSON = () => {
    const data = {
      tasks,
      categories,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-do-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully!');
  };

  const exportToCSV = () => {
    const headers = ['Title', 'Description', 'Priority', 'Deadline', 'Category', 'Tags', 'Completed', 'Time Spent (min)'];
    const rows = tasks.map(task => [
      task.title,
      task.description,
      task.priority,
      new Date(task.deadline).toLocaleString(),
      task.category || '',
      task.tags.join('; '),
      task.completed ? 'Yes' : 'No',
      task.timeSpent || 0
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-do-tasks-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Tasks exported to CSV successfully!');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.tasks && Array.isArray(data.tasks)) {
          const importedCategories = data.categories || [];
          onImport(data.tasks, importedCategories);
          toast.success(`Imported ${data.tasks.length} tasks and ${importedCategories.length} categories!`);
          onClose();
        } else {
          toast.error('Invalid file format');
        }
      } catch (error) {
        toast.error('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Export / Import Data</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Export Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Data
            </h3>
            <div className="space-y-3">
              <button
                onClick={exportToJSON}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FileJson className="w-5 h-5" />
                Export as JSON (Full Backup)
              </button>
              <button
                onClick={exportToCSV}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-5 h-5" />
                Export Tasks as CSV
              </button>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                JSON format includes all data (tasks, categories, settings). CSV exports only task data.
              </p>
            </div>
          </div>

          {/* Import Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Import Data
            </h3>
            <div className="space-y-3">
              <label className="block">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                  id="import-file"
                />
                <div className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <Upload className="w-5 h-5" />
                  Import from JSON
                </div>
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                ⚠️ Importing will merge with existing data. Duplicate tasks may be created.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Data</h4>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Total Tasks:</span>
                <span className="font-semibold">{tasks.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Categories:</span>
                <span className="font-semibold">{categories.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <span className="font-semibold">{tasks.filter(t => t.completed).length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
