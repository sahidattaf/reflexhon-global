import { useState, useEffect } from 'react'

const API_BASE_URL = 'https://reflexhon-global.sahidattaf.workers.dev/api/v1'

const CATEGORIES = {
  all: '📚 All Categories',
  emotions: '❤️ Emotions',
  values: '⭐ Values',
  family: '👨‍👩‍👧‍👦 Family',
  community: '🏘️ Community',
  culture: '🎭 Culture',
  language: '🗣️ Language',
  respect: '🙏 Respect'
}

export default function DatasetExplorer() {
  const [datasets, setDatasets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDatasets()
  }, [])

  const fetchDatasets = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/datasets`)
      const data = await response.json()

      if (data.success) {
        setDatasets(data.data)
      } else {
        throw new Error(data.error?.message || 'Failed to load datasets')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredDatasets = datasets.filter(dataset => {
    const matchesCategory = selectedCategory === 'all' || dataset.category === selectedCategory
    const matchesSearch = searchQuery === '' ||
      dataset.input.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.output.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  const categoryStats = datasets.reduce((acc, dataset) => {
    acc[dataset.category] = (acc[dataset.category] || 0) + 1
    return acc
  }, {})

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-caribbean-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading cultural datasets...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card bg-red-50 border-red-200">
        <h3 className="text-red-800 font-bold mb-2">Error Loading Datasets</h3>
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Stats */}
      <div className="card mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          📚 Cultural Dataset Explorer
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-caribbean-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-caribbean-700">{datasets.length}</div>
            <div className="text-sm text-caribbean-600 mt-1">Total Entries</div>
          </div>
          <div className="bg-island-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-island-700">{Object.keys(categoryStats).length}</div>
            <div className="text-sm text-island-600 mt-1">Categories</div>
          </div>
          <div className="bg-sunset-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-sunset-700">🌴</div>
            <div className="text-sm text-sunset-600 mt-1">Caribbean</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-700">PAP</div>
            <div className="text-sm text-purple-600 mt-1">Papiamentu</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search datasets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field"
          >
            {Object.entries(CATEGORIES).map(([key, label]) => (
              <option key={key} value={key}>
                {label} {key !== 'all' && categoryStats[key] ? `(${categoryStats[key]})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        Showing {filteredDatasets.length} of {datasets.length} entries
      </div>

      {/* Dataset Grid */}
      <div className="grid gap-4">
        {filteredDatasets.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg">No datasets found matching your criteria.</p>
          </div>
        ) : (
          filteredDatasets.map((dataset) => (
            <div key={dataset.id} className="card hover:border-caribbean-300 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-gray-500">{dataset.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      dataset.category === 'emotions' ? 'bg-red-100 text-red-700' :
                      dataset.category === 'values' ? 'bg-blue-100 text-blue-700' :
                      dataset.category === 'family' ? 'bg-green-100 text-green-700' :
                      dataset.category === 'community' ? 'bg-purple-100 text-purple-700' :
                      dataset.category === 'culture' ? 'bg-pink-100 text-pink-700' :
                      dataset.category === 'language' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {CATEGORIES[dataset.category] || dataset.category}
                    </span>
                    {dataset.cultural_context && (
                      <span className="text-xs px-2 py-1 rounded-full bg-caribbean-100 text-caribbean-700">
                        {dataset.cultural_context}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {dataset.input}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {dataset.output}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
