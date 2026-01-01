import { useState } from 'react'
import { useStore } from '../store/useStore'

export const SearchBar = () => {
  const { searchQuery, setSearchQuery, filters, setFilters, labels, members } = useStore()
  const [showFilters, setShowFilters] = useState(false)

  const clearFilters = () => {
    setFilters({
      priority: null,
      labels: [],
      assignee: null,
      dueDateRange: null
    })
    setSearchQuery('')
  }

  const hasActiveFilters = searchQuery || filters.priority || filters.labels.length > 0 || filters.assignee

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks... (Ctrl+K)"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              showFilters ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-white rounded-full" />
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={filters.priority || ''}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value || null })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
              <select
                value={filters.assignee || ''}
                onChange={(e) => setFilters({ ...filters, assignee: e.target.value || null })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Members</option>
                <option value="unassigned">Unassigned</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Labels</label>
              <div className="flex flex-wrap gap-2">
                {labels.map(label => (
                  <button
                    key={label.id}
                    onClick={() => {
                      const newLabels = filters.labels.includes(label.id)
                        ? filters.labels.filter(id => id !== label.id)
                        : [...filters.labels, label.id]
                      setFilters({ ...filters, labels: newLabels })
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium text-white transition-all ${
                      filters.labels.includes(label.id) ? 'ring-2 ring-offset-2' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: label.color }}
                  >
                    {label.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
