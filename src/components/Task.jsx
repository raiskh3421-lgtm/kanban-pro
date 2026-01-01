import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export const Task = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [showDetails, setShowDetails] = useState(false)

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
  }

  const handleSave = () => {
    if (title.trim()) {
      onUpdate(task.id, { title: title.trim(), description: description.trim() })
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setTitle(task.title)
    setDescription(task.description || '')
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white rounded-lg shadow-sm p-3 mb-2 border border-gray-200"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-1 mb-2 border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Task title"
          autoFocus
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-1 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          placeholder="Add description (optional)"
          rows="2"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 transition-colors"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg shadow-sm p-3 mb-2 border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">{task.title}</h4>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
            className="p-1 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded"
            title="Edit task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (confirm('Delete this task?')) {
                onDelete(task.id)
              }
            }}
            className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
            title="Delete task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      {task.description && showDetails && (
        <p className="mt-2 text-xs text-gray-600 whitespace-pre-wrap">{task.description}</p>
      )}
      {task.description && !showDetails && (
        <p className="mt-1 text-xs text-gray-500">Click to view details</p>
      )}
    </div>
  )
}
