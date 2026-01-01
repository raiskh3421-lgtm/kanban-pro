import { useEffect, useState } from 'react'
import { HeaderEnhanced } from './components/HeaderEnhanced'
import { Board } from './components/Board'
import { SearchBar } from './components/SearchBar'
import { useBoards } from './hooks/useBoards'
import { useMembers } from './hooks/useMembers'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useStore } from './store/useStore'

function App() {
  const { boards, createBoard, updateBoard, deleteBoard } = useBoards()
  useMembers()
  const { currentBoard, setCurrentBoard, loading, error, darkMode } = useStore()
  const [initialized, setInitialized] = useState(false)
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false)

  useKeyboardShortcuts({
    onSearch: () => document.querySelector('input[placeholder*="Search"]')?.focus(),
    onHelp: () => setShowShortcutsHelp(true),
    onEscape: () => setShowShortcutsHelp(false)
  })

  useEffect(() => {
    if (boards.length > 0 && !currentBoard && !initialized) {
      setCurrentBoard(boards[0])
      setInitialized(true)
    }
  }, [boards, currentBoard, initialized])

  const handleDeleteBoard = async (id) => {
    await deleteBoard(id)
    if (currentBoard?.id === id && boards.length > 1) {
      const remainingBoard = boards.find(b => b.id !== id)
      if (remainingBoard) {
        setCurrentBoard(remainingBoard)
      }
    }
  }

  if (loading && boards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">Loading boards...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900">Connection Error</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Please check your Supabase configuration in the .env file.
          </p>
        </div>
      </div>
    )
  }

  if (boards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
        <HeaderEnhanced
          boards={boards}
          currentBoard={currentBoard}
          onSelectBoard={setCurrentBoard}
          onCreateBoard={createBoard}
          onUpdateBoard={updateBoard}
          onDeleteBoard={handleDeleteBoard}
        />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No Boards Yet</h2>
            <p className="text-gray-500 mb-6">Create your first board to get started</p>
            <button
              onClick={() => createBoard('My First Board')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
            >
              Create Board
            </button>
          </div>
        </div>
      </div>
    )
  }

  const boardStyle = currentBoard?.background_image 
    ? { background: currentBoard.background_image }
    : { backgroundColor: currentBoard?.background_color || '#0ea5e9' }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <HeaderEnhanced
        boards={boards}
        currentBoard={currentBoard}
        onSelectBoard={setCurrentBoard}
        onCreateBoard={createBoard}
        onUpdateBoard={updateBoard}
        onDeleteBoard={handleDeleteBoard}
      />
      {currentBoard && <SearchBar />}
      {currentBoard && (
        <div className="flex-1 overflow-hidden" style={boardStyle}>
          <Board board={currentBoard} />
        </div>
      )}

      {showShortcutsHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowShortcutsHelp(false)}>
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Keyboard Shortcuts</h2>
              <button onClick={() => setShowShortcutsHelp(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-700">Search tasks</span>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">Ctrl+K</kbd>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-700">New board</span>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">Ctrl+B</kbd>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-700">New task</span>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">Ctrl+N</kbd>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-700">Toggle filters</span>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">Ctrl+F</kbd>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-700">Show shortcuts</span>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">Ctrl+/</kbd>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-700">Close dialog</span>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">Esc</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
