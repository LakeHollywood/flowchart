import { useFlowStore } from './hooks/useFlowStore';
import { TaskBoard } from './components/TaskBoard';
import { DashboardStats } from './components/DashboardStats';
import { LayoutDashboard, Kanban, Database, Wifi, WifiOff } from 'lucide-react';
import { useState } from 'react';

export default function App() {
  const { tasks, addTask, updateTaskStatus, deleteTask, stats } = useFlowStore();
  const [activeTab, setActiveTab] = useState<'board' | 'dashboard'>('board');
  const [isOnline] = useState(navigator.onLine);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <div>
                  <h1 className="text-base font-bold text-neutral-100 tracking-tight">FlowBoard</h1>
                  <p className="text-[10px] text-neutral-500 -mt-0.5 font-mono">task management</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex items-center gap-1 bg-neutral-900/60 border border-neutral-800 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab('board')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    activeTab === 'board'
                      ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  <Kanban className="w-4 h-4" />
                  <span className="hidden sm:inline">Board</span>
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
              </nav>

              {/* Status */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span className="text-neutral-500 hidden sm:inline font-mono">
                    {isOnline ? 'online' : 'offline'}
                  </span>
                  {isOnline ? (
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-500 bg-neutral-900/60 border border-neutral-800 rounded-lg px-3 py-1.5">
                  <Database className="w-3 h-3" />
                  <span className="font-mono">localStorage</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-100">
              {activeTab === 'board' ? 'Task Board' : 'Analytics Dashboard'}
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              {activeTab === 'board'
                ? 'Drag and drop tasks between columns to update their status.'
                : 'Overview of your task metrics and completion progress.'}
            </p>
          </div>

          {/* Content */}
          {activeTab === 'board' ? (
            <TaskBoard
              tasks={tasks}
              onUpdateStatus={updateTaskStatus}
              onAddTask={addTask}
              onDeleteTask={deleteTask}
            />
          ) : (
            <DashboardStats stats={stats} />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-neutral-800/60 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs text-neutral-600">
                <span className="font-mono">FlowBoard v1.0</span>
                <span className="w-1 h-1 rounded-full bg-neutral-700" />
                <span>Offline-first persistence</span>
                <span className="w-1 h-1 rounded-full bg-neutral-700" />
                <span>{tasks.length} tasks managed</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-600">
                <span className="font-mono">Built with React + @dnd-kit + Tailwind</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
