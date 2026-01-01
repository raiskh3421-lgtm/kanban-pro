import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { checklistService } from '../services/checklistService'
import { commentService } from '../services/commentService'
import { taskLabelService } from '../services/taskLabelService'

export const TaskDetailModal = ({ task, onClose, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [priority, setPriority] = useState(task.priority || 'medium')
  const [dueDate, setDueDate] = useState(task.due_date ? task.due_date.split('T')[0] : '')
  const [cardColor, setCardColor] = useState(task.card_color || '')
  const [newChecklistItem, setNewChecklistItem] = useState('')
  const [newComment, setNewComment] = useState('')
  const [selectedLabels, setSelectedLabels] = useState(task.task_labels?.map(tl => tl.label_id) || [])

  const { 
    labels, 
    members, 
    getChecklistItemsByTaskId, 
    getCommentsByTaskId,
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    addComment
  } = useStore()

  const checklistItems = getChecklistItemsByTaskId(task.id)
  const comments = getCommentsByTaskId(task.id)
  const assignedMember = members.find(m => m.id === task.assigned_to)

  useEffect(() => {
    loadChecklistItems()
    loadComments()
  }, [task.id])

  const loadChecklistItems = async () => {
    try {
      const items = await checklistService.getByTaskId(task.id)
      items.forEach(item => addChecklistItem(item))
    } catch (error) {
      console.error('Error loading checklist:', error)
    }
  }

  const loadComments = async () => {
    try {
      const taskComments = await commentService.getByTaskId(task.id)
      taskComments.forEach(comment => addComment(comment))
    } catch (error) {
      console.error('Error loading comments:', error)
    }
  }

  const handleSave = () => {
    const updates = {
      title: title.trim(),
      description: description.trim(),
      priority,
      due_date: dueDate || null,
      card_color: cardColor || null
    }
    onUpdate(task.id, updates)
  }

  const handleAddChecklist = async () => {
    if (newChecklistItem.trim()) {
      try {
        await checklistService.create(task.id, newChecklistItem.trim())
        setNewChecklistItem('')
      } catch (error) {
        console.error('Error adding checklist item:', error)
      }
    }
  }

  const handleToggleChecklist = async (item) => {
    try {
      await checklistService.update(item.id, { completed: !item.completed })
    } catch (error) {
      console.error('Error updating checklist item:', error)
    }
  }

  const handleDeleteChecklist = async (id) => {
    try {
      await checklistService.delete(id)
    } catch (error) {
      console.error('Error deleting checklist item:', error)
    }
  }

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        await commentService.create(task.id, members[0]?.id, newComment.trim())
        setNewComment('')
      } catch (error) {
        console.error('Error adding comment:', error)
      }
    }
  }

  const handleAssignMember = async (memberId) => {
    onUpdate(task.id, { assigned_to: memberId })
  }

  const handleToggleLabel = async (labelId) => {
    try {
      if (selectedLabels.includes(labelId)) {
        await taskLabelService.removeLabel(task.id, labelId)
        setSelectedLabels(selectedLabels.filter(id => id !== labelId))
      } else {
        await taskLabelService.addLabel(task.id, labelId)
        setSelectedLabels([...selectedLabels, labelId])
      }
    } catch (error) {
      console.error('Error toggling label:', error)
    }
  }

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-red-100 text-red-800 border-red-300'
  }

  const cardColors = [
    { name: 'None', value: '' },
    { name: 'Red', value: '#fecaca' },
    { name: 'Orange', value: '#fed7aa' },
    { name: 'Yellow', value: '#fef08a' },
    { name: 'Green', value: '#bbf7d0' },
    { name: 'Blue', value: '#bfdbfe' },
    { name: 'Purple', value: '#e9d5ff' },
    { name: 'Pink', value: '#fbcfe8' }
  ]

  const completedCount = checklistItems.filter(i => i.completed).length
  const progress = checklistItems.length > 0 ? (completedCount / checklistItems.length) * 100 : 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Task Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value)
                  onUpdate(task.id, { priority: e.target.value })
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${priorityColors[priority]}`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value)
                  onUpdate(task.id, { due_date: e.target.value || null })
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
              <select
                value={task.assigned_to || ''}
                onChange={(e) => handleAssignMember(e.target.value || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Unassigned</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Color</label>
            <div className="flex gap-2 flex-wrap">
              {cardColors.map(color => (
                <button
                  key={color.value}
                  onClick={() => {
                    setCardColor(color.value)
                    onUpdate(task.id, { card_color: color.value || null })
                  }}
                  className={`w-12 h-12 rounded-lg border-2 transition-all ${
                    cardColor === color.value ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.value || '#ffffff' }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Labels</label>
            <div className="flex gap-2 flex-wrap">
              {labels.map(label => (
                <button
                  key={label.id}
                  onClick={() => handleToggleLabel(label.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedLabels.includes(label.id) 
                      ? 'ring-2 ring-offset-2' 
                      : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{ 
                    backgroundColor: label.color,
                    color: '#ffffff',
                    ringColor: label.color
                  }}
                >
                  {label.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSave}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Add a description..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Checklist</label>
              {checklistItems.length > 0 && (
                <span className="text-sm text-gray-500">
                  {completedCount}/{checklistItems.length} ({Math.round(progress)}%)
                </span>
              )}
            </div>
            {checklistItems.length > 0 && (
              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            <div className="space-y-2 mb-3">
              {checklistItems.map(item => (
                <div key={item.id} className="flex items-center gap-2 group">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggleChecklist(item)}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                  />
                  <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {item.title}
                  </span>
                  <button
                    onClick={() => handleDeleteChecklist(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddChecklist()}
                placeholder="Add checklist item..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleAddChecklist}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Comments</label>
            <div className="space-y-3 mb-3">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ backgroundColor: comment.members?.color || '#6366f1' }}
                  >
                    {comment.members?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">{comment.members?.name || 'Unknown'}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-between">
          <button
            onClick={() => {
              if (confirm('Delete this task?')) {
                onDelete(task.id)
                onClose()
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Task
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
