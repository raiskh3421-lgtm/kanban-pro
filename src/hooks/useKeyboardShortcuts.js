import { useEffect } from 'react'

export const useKeyboardShortcuts = (callbacks) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'n':
            e.preventDefault()
            callbacks.onNewTask?.()
            break
          case 'b':
            e.preventDefault()
            callbacks.onNewBoard?.()
            break
          case 'k':
            e.preventDefault()
            callbacks.onSearch?.()
            break
          case 'f':
            e.preventDefault()
            callbacks.onFilter?.()
            break
          case '/':
            e.preventDefault()
            callbacks.onHelp?.()
            break
          default:
            break
        }
      }

      if (e.key === 'Escape') {
        callbacks.onEscape?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [callbacks])
}
