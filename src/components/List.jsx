import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TaskEnhanced } from './TaskEnhanced'
import { useStore } from '../store/useStore'

export const List = ({ list, tasks, onUpdateList, onDeleteList, onCreateTask, onUpdateTask, onDeleteTask }) => {
  const { labels, members } = useStore()
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(list.title)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const { setNodeRef } = useDroppable({ id: list.id })

  const handleSaveTitle = () => {
    if (title.trim() && title !== list.title) {
      onUpdateList(list.id, title.trim())
    }
    setIsEditingTitle(false)
  }

  const handleCancelTitle = () => {
    setTitle(list.title)
    setIsEditingTitle(false)
  }

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onCreateTask(newTaskTitle.trim(), list.id)
      setNewTaskTitle('')
      setIsAddingTask(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (isEditingTitle) {
        handleSaveTitle()
      } else if (isAddingTask) {
        handleAddTask()
      }
    } else if (e.key === 'Escape') {
      if (isEditingTitle) {
        handleCancelTitle()
      } else if (isAddingTask) {
        setNewTaskTitle('')
        setIsAddingTask(false)
      }
    }
  }

  return (
    <div className="bg-gray-100 rounded-lg p-3 w-80 flex-shrink-0 flex flex-col max-h-full">
      <div className="flex items-center justify-between mb-3 gap-2">
        {isEditingTitle ? (
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveTitle}
              className="flex-1 px-2 py-1 border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
          </div>
        ) : (
          <>
            <h3
              className="font-semibold text-gray-800 flex-1 cursor-pointer hover:text-primary-600"
              onClick={() => setIsEditingTitle(true)}
            >
              {list.title}
            </h3>
            <div className="flex gap-1">
              <button
                onClick={() => setIsEditingTitle(true)}
                className="p-1 text-gray-500 hover:text-primary-600 hover:bg-white rounded"
                title="Edit list"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete list "${list.title}" and all its tasks?`)) {
                    onDeleteList(list.id)
                  }
                }}
                className="p-1 text-gray-500 hover:text-red-600 hover:bg-white rounded"
                title="Delete list"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      <div ref={setNodeRef} className="flex-1 overflow-y-auto min-h-[100px] mb-2">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskEnhanced
              key={task.id}
              task={task}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
              members={members}
              labels={labels}
            />
          ))}
        </SortableContext>
      </div>

      {isAddingTask ? (
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter task title"
            className="w-full px-2 py-1 mb-2 border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddTask}
              className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setNewTaskTitle('')
                setIsAddingTask(false)
              }}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingTask(true)}
          className="w-full py-2 text-gray-600 hover:bg-white hover:text-gray-900 rounded flex items-center justify-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm">Add task</span>
        </button>
      )}
    </div>
  )
}
