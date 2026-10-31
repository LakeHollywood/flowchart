import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

const STORAGE_KEY = 'flowboard_tasks_v1';

const INITIAL_TASKS: Task[] = [
  { id: uuidv4(), title: 'Audit core cryptography wrappers', description: 'Verify Ed25519 signature validation paths.', status: 'in_progress', priority: 'high', createdAt: new Date().toISOString() },
  { id: uuidv4(), title: 'Configure Jetson AGX Orin systemd units', description: 'Ensure crash-safe fsync on SEALedger appends.', status: 'todo', priority: 'medium', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: uuidv4(), title: 'Polish FlowBoard analytics panel', description: 'Connect Recharts to real-time telemetry stream.', status: 'completed', priority: 'low', createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: uuidv4(), title: 'Implement zero-knowledge proof module', description: 'Set up zk-SNARK circuit for identity verification.', status: 'todo', priority: 'high', createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: uuidv4(), title: 'Optimize WebSocket heartbeat interval', description: 'Reduce idle bandwidth by 40% on mobile clients.', status: 'in_progress', priority: 'medium', createdAt: new Date(Date.now() - 345600000).toISOString() },
  { id: uuidv4(), title: 'Write integration tests for auth flow', description: 'Cover OAuth2 PKCE + magic link edge cases.', status: 'completed', priority: 'medium', createdAt: new Date(Date.now() - 432000000).toISOString() },
  { id: uuidv4(), title: 'Deploy staging environment to Fly.io', description: 'Configure health checks and auto-scaling rules.', status: 'todo', priority: 'low', createdAt: new Date(Date.now() - 518400000).toISOString() },
];

export function useFlowStore() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.warn('Failed to load tasks from localStorage', e);
    }
    return INITIAL_TASKS;
  });

  // Persist tasks locally on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
  }, [tasks]);

  const addTask = useCallback((title: string, description?: string, priority: Task['priority'] = 'medium') => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      status: 'todo',
      priority,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const updateTaskStatus = useCallback((taskId: string, newStatus: Task['status']) => {
    setTasks(prev =>
      prev.map(task => (task.id === taskId ? { ...task, status: newStatus } : task))
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  // Dashboard stats
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    highPriority: tasks.filter(t => t.priority === 'high').length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0,
  };

  return {
    tasks,
    addTask,
    updateTaskStatus,
    deleteTask,
    stats,
  };
}
