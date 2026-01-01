import { useState } from 'react'
import { TemplateModal } from './TemplateModal'
import { ThemeSelector } from './ThemeSelector'
import { LabelManager } from './LabelManager'
import { MemberManager } from './MemberManager'

export const HeaderEnhanced = ({ boards, currentBoard, onSelectBoard, onCreateBoard, onUpdateBoard, onDeleteBoard }) => {
  const [isCreating, setIsCreating] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState('')
  const [isEditingBoard, setIsEditingBoard] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const handleCreate = () => {
    if (newBoardTitle.trim()) {
      onCreateBoard(newBoardTitle.trim())
      setNewBoardTitle('')
      setIsCreating(false)
    }
  }

  const handleUpdate = () => {
    if (editTitle.trim() && currentBoard) {
      onUpdateBoard(currentBoard.id, { title: editTitle.trim() })
      setIsEditingBoard(false)
    }
  }

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      action()
    } else if (e.key === 'Escape') {
      if (action === handleCreate) {
        setNewBoardTitle('')
        setIsCreating(false)
      } else {
        setEditTitle(currentBoard?.title || '')
        setIsEditingBoard(false)
      }
    }
  }

  const handleTemplateSelect = (newBoard) => {
    onSelectBoard(newBoard)
  }

  return (
    <>
      <header className="bg-primary-700 text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                <h1 className="text-2xl font-bold">Kanban Pro</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {currentBoard && (
                <div className="flex items-center gap-2">
                  {isEditingBoard ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, handleUpdate)}
                        className="px-3 py-1 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                        placeholder="Board title"
                        autoFocus
                      />
                      <button
                        onClick={handleUpdate}
                        className="px-3 py-1 bg-primary-800 hover:bg-primary-900 rounded text-sm transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditTitle(currentBoard.title)
                          setIsEditingBoard(false)
                        }}
                        className="px-3 py-1 bg-primary-600 hover:bg-primary-700 rounded text-sm transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <select
                        value={currentBoard.id}
                        onChange={(e) => {
                          const board = boards.find(b => b.id === e.target.value)
                          if (board) onSelectBoard(board)
                        }}
                        className="px-4 py-2 rounded bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300 cursor-pointer transition-colors"
                      >
                        {boards.map(board => (
                          <option key={board.id} value={board.id}>
                            {board.title}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          setEditTitle(currentBoard.title)
                          setIsEditingBoard(true)
                        }}
                        className="p-2 hover:bg-primary-600 rounded transition-colors"
                        title="Rename board"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {boards.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete board "${currentBoard.title}"?`)) {
                              onDeleteBoard(currentBoard.id)
                            }
                          }}
                          className="p-2 hover:bg-red-600 rounded transition-colors"
                          title="Delete board"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 hover:bg-primary-600 rounded transition-colors"
                        title="Board settings"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              )}

              {isCreating ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBoardTitle}
                    onChange={(e) => setNewBoardTitle(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, handleCreate)}
                    className="px-3 py-2 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                    placeholder="Board title"
                    autoFocus
                  />
                  <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-primary-800 hover:bg-primary-900 rounded transition-colors"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setNewBoardTitle('')
                      setIsCreating(false)
                    }}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowTemplateModal(true)}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded flex items-center gap-2 transition-colors"
                    title="Create from template"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    <span>Templates</span>
                  </button>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded flex items-center gap-2 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>New Board</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {showSettings && currentBoard && (
        <div className="absolute top-20 right-6 z-40 space-y-4">
          <ThemeSelector board={currentBoard} onUpdateBoard={onUpdateBoard} />
          <LabelManager boardId={currentBoard.id} />
          <MemberManager />
        </div>
      )}

      {showTemplateModal && (
        <TemplateModal
          onClose={() => setShowTemplateModal(false)}
          onSelectTemplate={handleTemplateSelect}
        />
      )}
    </>
  )
}
