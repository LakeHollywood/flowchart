import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../hooks/useFlowStore';
import { GripVertical, Trash2, Plus, ChevronDown } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  onUpdateStatus: (id: string, status: Task['status']) => void;
  onAddTask: (title: string, desc?: string, priority?: Task['priority']) => void;
  onDeleteTask: (id: string) => void;
}

const COLUMNS: { id: Task['status']; title: string; color: string; icon: string }[] = [
  { id: 'todo', title: 'To Do', color: 'border-amber-500/30 bg-amber-500/5', icon: '○' },
  { id: 'in_progress', title: 'In Progress', color: 'border-blue-500/30 bg-blue-500/5', icon: '◐' },
  { id: 'completed', title: 'Completed', color: 'border-emerald-500/30 bg-emerald-500/5', icon: '●' },
];

export function TaskBoard({ tasks, onUpdateStatus, onAddTask, onDeleteTask }: TaskBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<Task['priority']>('medium');

  // Sensors for mouse, touch, and keyboard accessibility
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id as string;
    const targetColumn = COLUMNS.find(c => c.id === overId);

    if (targetColumn && activeTask.status !== targetColumn.id) {
      onUpdateStatus(activeTask.id, targetColumn.id);
    } else {
      const overTask = tasks.find(t => t.id === overId);
      if (overTask && activeTask.status !== overTask.status) {
        onUpdateStatus(activeTask.id, overTask.status);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(newTitle.trim(), newDesc.trim() || undefined, newPriority);
    setNewTitle('');
    setNewDesc('');
    setNewPriority('medium');
    setShowAddForm(false);
  };

  const activeTask = tasks.find(t => t.id === activeId);

  return (
    <div className="space-y-6">
      {/* Quick Add Section */}
      <div className="bg-neutral-900/60 rounded-xl border border-neutral-800 backdrop-blur-sm overflow-hidden">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-800/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <Plus className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-sm font-medium text-neutral-300">Add New Task</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${showAddForm ? 'rotate-180' : ''}`} />
        </button>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="px-4 pb-4 space-y-3 border-t border-neutral-800/60 pt-4">
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Task title..."
              autoFocus
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <textarea
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="Description (optional)..."
              rows={2}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500">Priority:</span>
                {(['low', 'medium', 'high'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNewPriority(p)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                      newPriority === p
                        ? p === 'high'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : p === 'medium'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                        : 'bg-neutral-800/50 text-neutral-500 border-neutral-700 hover:border-neutral-600'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="flex-1" />
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Task
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Kanban Board Layout */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {COLUMNS.map(col => {
            const columnTasks = tasks.filter(t => t.status === col.id);
            return (
              <div
                key={col.id}
                id={col.id}
                className={`rounded-2xl border ${col.color} p-4 flex flex-col min-h-[400px] shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800/60">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{col.icon}</span>
                    <h3 className="font-semibold text-neutral-200 text-sm tracking-wide uppercase">
                      {col.title}
                    </h3>
                  </div>
                  <span className="text-xs bg-neutral-800 text-neutral-400 px-2.5 py-0.5 rounded-full font-mono">
                    {columnTasks.length}
                  </span>
                </div>

                <SortableContext
                  items={columnTasks.map(t => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex-1 space-y-3">
                    {columnTasks.map(task => (
                      <SortableTaskCard
                        key={task.id}
                        task={task}
                        onDelete={onDeleteTask}
                      />
                    ))}
                    {columnTasks.length === 0 && (
                      <div className="h-28 flex items-center justify-center border border-dashed border-neutral-800 rounded-xl text-neutral-600 text-xs font-mono">
                        Drop tasks here
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCardContent task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function SortableTaskCard({ task, onDelete }: { task: Task; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TaskCardContent task={task} onDelete={onDelete} dragListeners={listeners} />
    </div>
  );
}

function TaskCardContent({
  task,
  onDelete,
  dragListeners,
  isOverlay = false,
}: {
  task: Task;
  onDelete?: (id: string) => void;
  dragListeners?: any;
  isOverlay?: boolean;
}) {
  const priorityColor =
    task.priority === 'high'
      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
      : task.priority === 'medium'
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      : 'bg-blue-500/10 text-blue-400 border-blue-500/20';

  return (
    <div
      className={`group bg-neutral-900 border border-neutral-800 rounded-xl p-4 shadow-sm hover:border-neutral-700 transition-all ${
        isOverlay ? 'shadow-2xl ring-2 ring-blue-500/50 cursor-grabbing' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-neutral-200 leading-snug">{task.title}</h4>
        <div className="flex items-center gap-1">
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="text-neutral-500 hover:text-rose-400 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <div
            {...dragListeners}
            className="text-neutral-500 hover:text-neutral-300 p-1 cursor-grab active:cursor-grabbing rounded"
            title="Drag task"
          >
            <GripVertical className="w-4 h-4" />
          </div>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{task.description}</p>
      )}

      <div className="mt-3 flex items-center justify-between pt-2 border-t border-neutral-800/80">
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${priorityColor}`}>
          {task.priority}
        </span>
        <span className="text-[10px] text-neutral-500 font-mono">
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
