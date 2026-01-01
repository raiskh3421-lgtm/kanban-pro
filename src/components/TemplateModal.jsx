import { useState, useEffect } from 'react'
import { boardService } from '../services/boardService'

export const TemplateModal = ({ onClose, onSelectTemplate }) => {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [newBoardTitle, setNewBoardTitle] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const data = await boardService.getTemplates()
      setTemplates(data)
    } catch (error) {
      console.error('Error loading templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate || !newBoardTitle.trim()) return
    
    try {
      const newBoard = await boardService.createFromTemplate(selectedTemplate.id, newBoardTitle.trim())
      onSelectTemplate(newBoard)
      onClose()
    } catch (error) {
      console.error('Error creating from template:', error)
    }
  }

  const categoryIcons = {
    agile: '🚀',
    project: '📊',
    personal: '✅',
    marketing: '📱'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Choose a Template</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-gray-600">Loading templates...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      selectedTemplate?.id === template.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{categoryIcons[template.template_category] || '📋'}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{template.title}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                      {selectedTemplate?.id === template.id && (
                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {selectedTemplate && (
                <div className="border-t pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Board Name
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newBoardTitle}
                      onChange={(e) => setNewBoardTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateFromTemplate()}
                      placeholder="Enter board name..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      autoFocus
                    />
                    <button
                      onClick={handleCreateFromTemplate}
                      disabled={!newBoardTitle.trim()}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create Board
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
