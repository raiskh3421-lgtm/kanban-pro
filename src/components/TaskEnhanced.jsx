import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TaskDetailModal } from './TaskDetailModal'

export const TaskEnhanced = ({ task, onUpdate, onDelete, members, labels }) => {
  const [showModal, setShowModal] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: task.card_color || '#ffffff'
  }

  const priorityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  }

  const assignedMember = members?.find(m => m.id === task.assigned_to)
  const taskLabels = task.task_labels?.map(tl => 
    labels?.find(l => l.id === tl.label_id)
  ).filter(Boolean) || []

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed
  const isDueSoon = task.due_date && 
    new Date(task.due_date) > new Date() && 
    new Date(task.due_date) < new Date(Date.now() + 24 * 60 * 60 * 1000)

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-white rounded-lg shadow-sm p-3 mb-2 border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
        onClick={() => setShowModal(true)}
      >
        <div className="flex items-start gap-2 mb-2">
          <div className={`w-1 h-full rounded-full ${priorityColors[task.priority || 'medium']}`} />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="text-sm font-medium text-gray-900 flex-1">{task.title}</h4>
              {assignedMember && (
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                  style={{ backgroundColor: assignedMember.color }}
                  title={assignedMember.name}
                >
                  {assignedMember.name.charAt(0)}
                </div>
              )}
            </div>

            {taskLabels.length > 0 && (
              <div className="flex gap-1 flex-wrap mb-2">
                {taskLabels.map(label => (
                  <span
                    key={label.id}
                    className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: label.color }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 text-xs text-gray-500">
              {task.due_date && (
                <div className={`flex items-center gap-1 ${
                  isOverdue ? 'text-red-600 font-medium' : 
                  isDueSoon ? 'text-yellow-600 font-medium' : ''
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(task.due_date).toLocaleDateString()}
                </div>
              )}
              
              {task.description && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <TaskDetailModal
          task={task}
          onClose={() => setShowModal(false)}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}
    </>
  )
}
