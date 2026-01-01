import { useState } from 'react'
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { List } from './List'
import { TaskEnhanced } from './TaskEnhanced'
import { useLists } from '../hooks/useLists'
import { useTasks } from '../hooks/useTasks'
import { useLabels } from '../hooks/useLabels'
import { useStore } from '../store/useStore'

export const Board = ({ board }) => {
  const [activeTask, setActiveTask] = useState(null)
  const [isAddingList, setIsAddingList] = useState(false)
  const [newListTitle, setNewListTitle] = useState('')

  const { lists, createList, updateList, deleteList } = useLists(board.id)
  const { tasks, createTask, updateTask, deleteTask, updateTaskPositions } = useTasks(board.id)
  useLabels(board.id)
  const { getTasksByListId, labels, members } = useStore()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event) => {
    const { active } = event
    const task = tasks.find(t => t.id === active.id)
    setActiveTask(task)
  }

  const handleDragOver = (event) => {
    const { active, over } = event
    if (!over) return

    const activeTask = tasks.find(t => t.id === active.id)
    if (!activeTask) return

    const overTask = tasks.find(t => t.id === over.id)
    const overList = lists.find(l => l.id === over.id)

    if (overTask && activeTask.list_id !== overTask.list_id) {
      const updates = [{
        id: activeTask.id,
        list_id: overTask.list_id,
        position: overTask.position
      }]
      updateTaskPositions(updates)
    } else if (overList && activeTask.list_id !== overList.id) {
      const targetListTasks = getTasksByListId(overList.id)
      const newPosition = targetListTasks.length
      const updates = [{
        id: activeTask.id,
        list_id: overList.id,
        position: newPosition
      }]
      updateTaskPositions(updates)
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over || active.id === over.id) return

    const activeTask = tasks.find(t => t.id === active.id)
    const overTask = tasks.find(t => t.id === over.id)

    if (!activeTask) return

    if (overTask && activeTask.list_id === overTask.list_id) {
      const listTasks = getTasksByListId(activeTask.list_id)
      const oldIndex = listTasks.findIndex(t => t.id === active.id)
      const newIndex = listTasks.findIndex(t => t.id === over.id)

      const reorderedTasks = arrayMove(listTasks, oldIndex, newIndex)
      const updates = reorderedTasks.map((task, index) => ({
        id: task.id,
        list_id: task.list_id,
        position: index
      }))
      updateTaskPositions(updates)
    }
  }

  const handleAddList = () => {
    if (newListTitle.trim()) {
      createList(newListTitle.trim())
      setNewListTitle('')
      setIsAddingList(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddList()
    } else if (e.key === 'Escape') {
      setNewListTitle('')
      setIsAddingList(false)
    }
  }

  return (
    <div className="flex-1 overflow-x-auto p-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 h-full">
          {lists.map((list) => (
            <List
              key={list.id}
              list={list}
              tasks={getTasksByListId(list.id)}
              onUpdateList={updateList}
              onDeleteList={deleteList}
              onCreateTask={createTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          ))}

          {isAddingList ? (
            <div className="bg-gray-100 rounded-lg p-3 w-80 flex-shrink-0">
              <input
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter list title"
                className="w-full px-3 py-2 mb-2 border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddList}
                  className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 transition-colors"
                >
                  Add List
                </button>
                <button
                  onClick={() => {
                    setNewListTitle('')
                    setIsAddingList(false)
                  }}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingList(true)}
              className="bg-gray-100 hover:bg-gray-200 rounded-lg p-3 w-80 flex-shrink-0 h-fit flex items-center justify-center gap-2 text-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add List</span>
            </button>
          )}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="w-80">
              <TaskEnhanced
                task={activeTask}
                onUpdate={() => {}}
                onDelete={() => {}}
                members={members}
                labels={labels}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
