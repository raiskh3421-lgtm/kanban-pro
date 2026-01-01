import { useState } from 'react'
import { useMembers } from '../hooks/useMembers'

export const MemberManager = () => {
  const { members, createMember, deleteMember } = useMembers()
  const [isAdding, setIsAdding] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [newMemberColor, setNewMemberColor] = useState('#6366f1')

  const predefinedColors = [
    '#ef4444', '#f59e0b', '#10b981', '#06b6d4',
    '#3b82f6', '#8b5cf6', '#ec4899', '#6366f1'
  ]

  const handleCreate = async () => {
    if (newMemberName.trim()) {
      await createMember(newMemberName.trim(), newMemberEmail.trim(), newMemberColor)
      setNewMemberName('')
      setNewMemberEmail('')
      setIsAdding(false)
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">Team Members</h3>
      
      <div className="space-y-2 mb-4">
        {members.map(member => (
          <div key={member.id} className="flex items-center gap-3 group">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: member.color }}
            >
              {member.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm text-gray-900">{member.name}</div>
              {member.email && (
                <div className="text-xs text-gray-500">{member.email}</div>
              )}
            </div>
            <button
              onClick={() => {
                if (confirm(`Remove ${member.name}?`)) {
                  deleteMember(member.id)
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
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            placeholder="Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            autoFocus
          />
          <input
            type="email"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            placeholder="Email (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <div className="grid grid-cols-4 gap-2">
            {predefinedColors.map(color => (
              <button
                key={color}
                onClick={() => setNewMemberColor(color)}
                className={`w-full h-8 rounded-full border-2 ${
                  newMemberColor === color ? 'border-gray-900 ring-2 ring-gray-400' : 'border-gray-300'
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
              Add Member
            </button>
            <button
              onClick={() => {
                setNewMemberName('')
                setNewMemberEmail('')
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
          <span className="text-sm">Add Member</span>
        </button>
      )}
    </div>
  )
}
