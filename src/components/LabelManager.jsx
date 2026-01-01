import { useState } from 'react'
import { useLabels } from '../hooks/useLabels'

export const LabelManager = ({ boardId }) => {
  const { labels, createLabel, updateLabel, deleteLabel } = useLabels(boardId)
  const [isAdding, setIsAdding] = useState(false)
  const [newLabelName, setNewLabelName] = useState('')
  const [newLabelColor, setNewLabelColor] = useState('#10b981')

  const predefinedColors = [
    '#ef4444', '#f59e0b', '#10b981', '#06b6d4',
    '#3b82f6', '#8b5cf6', '#ec4899', '#6366f1'
  ]

  const handleCreate = async () => {
    if (newLabelName.trim()) {
      await createLabel(newLabelName.trim(), newLabelColor)
      setNewLabelName('')
      setIsAdding(false)
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">Manage Labels</h3>
      
      <div className="space-y-2 mb-4">
        {labels.map(label => (
          <div key={label.id} className="flex items-center gap-2 group">
            <div
              className="w-16 h-8 rounded"
              style={{ backgroundColor: label.color }}
            />
            <span className="flex-1 text-sm font-medium text-gray-900">{label.name}</span>
            <button
              onClick={() => {
                if (confirm(`Delete label "${label.name}"?`)) {
                  deleteLabel(label.id)
                }
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-red-600 hover:text-red-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={newLabelName}
            onChange={(e) => setNewLabelName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="Label name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            autoFocus
          />
          <div className="grid grid-cols-4 gap-2">
            {predefinedColors.map(color => (
              <button
                key={color}
                onClick={() => setNewLabelColor(color)}
                className={`w-full h-8 rounded border-2 ${
                  newLabelColor === color ? 'border-gray-900 ring-2 ring-gray-400' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"
            >
              Create
            </button>
            <button
              onClick={() => {
                setNewLabelName('')
                setIsAdding(false)
              }}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-2 text-primary-600 hover:bg-primary-50 rounded flex items-center justify-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm">Add Label</span>
        </button>
      )}
    </div>
  )
}
