import { useStore } from '../store/useStore'

export const ThemeSelector = ({ board, onUpdateBoard }) => {
  const { darkMode, setDarkMode } = useStore()

  const backgroundColors = [
    { name: 'Blue', value: '#0ea5e9' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Indigo', value: '#6366f1' }
  ]

  const gradientBackgrounds = [
    { name: 'Ocean', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'Forest', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { name: 'Fire', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }
  ]

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Board Theme</h3>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? (
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Solid Colors</label>
          <div className="grid grid-cols-4 gap-2">
            {backgroundColors.map(color => (
              <button
                key={color.value}
                onClick={() => onUpdateBoard(board.id, { background_color: color.value, background_image: null })}
                className={`w-12 h-12 rounded-lg border-2 transition-all ${
                  board.background_color === color.value && !board.background_image
                    ? 'border-gray-900 ring-2 ring-gray-400'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gradients</label>
          <div className="grid grid-cols-2 gap-2">
            {gradientBackgrounds.map(bg => (
              <button
                key={bg.name}
                onClick={() => onUpdateBoard(board.id, { background_color: null, background_image: bg.value })}
                className={`h-12 rounded-lg border-2 transition-all ${
                  board.background_image === bg.value
                    ? 'border-gray-900 ring-2 ring-gray-400'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ background: bg.value }}
                title={bg.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
