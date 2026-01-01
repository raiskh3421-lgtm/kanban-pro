import { useState } from 'react'

export const Header = ({ boards, currentBoard, onSelectBoard, onCreateBoard, onUpdateBoard, onDeleteBoard }) => {
  const [isCreating, setIsCreating] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState('')
  const [isEditingBoard, setIsEditingBoard] = useState(false)
  const [editTitle, setEditTitle] = useState('')

  const handleCreate = () => {
    if (newBoardTitle.trim()) {
      onCreateBoard(newBoardTitle.trim())
      setNewBoardTitle('')
      setIsCreating(false)
    }
  }

  const handleUpdate = () => {
    if (editTitle.trim() && currentBoard) {
      onUpdateBoard(currentBoard.id, editTitle.trim())
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

  return (
    <header className="bg-primary-700 text-white shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              <h1 className="text-2xl font-bold">Kanban Board</h1>
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
              <button
                onClick={() => setIsCreating(true)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded flex items-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>New Board</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
