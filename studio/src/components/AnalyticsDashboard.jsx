import { useState, useEffect } from 'react'

const API_BASE = 'https://reflexhon-global.sahidattaf.workers.dev'

function AnalyticsDashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [trending, setTrending] = useState([])
  const [searches, setSearches] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('24h')
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAnalytics()
    // Refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000)
    return () => clearInterval(interval)
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch dashboard data
      const dashboardRes = await fetch(`${API_BASE}/api/v1/analytics/dashboard?range=${timeRange}`)
      const dashboardData = await dashboardRes.json()

      // Fetch trending datasets
      const trendingRes = await fetch(`${API_BASE}/api/v1/analytics/trending?limit=5`)
      const trendingData = await trendingRes.json()

      // Fetch popular searches
      const searchesRes = await fetch(`${API_BASE}/api/v1/analytics/searches?limit=5`)
      const searchesData = await searchesRes.json()

      setDashboard(dashboardData.data)
      setTrending(trendingData.data || [])
      setSearches(searchesData.data || [])
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
      setError('Failed to load analytics data')
      setLoading(false)
    }
  }

  if (loading && !dashboard) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-caribbean-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">⚠️ {error}</p>
        <button
          onClick={fetchAnalytics}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  const overview = dashboard?.overview || {}
  const topEndpoints = dashboard?.topEndpoints || []
  const statusBreakdown = dashboard?.statusBreakdown || []

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">📊 Live Analytics Dashboard</h2>
          <p className="text-gray-600">Real-time insights from your Cultural AI API</p>
        </div>
        <div className="flex gap-2">
          {['1h', '24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === range
                  ? 'bg-caribbean-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon="📈"
          title="Total Requests"
          value={overview.totalRequests?.toLocaleString() || '0'}
          subtitle="API calls"
          color="blue"
        />
        <StatCard
          icon="👥"
          title="Unique Visitors"
          value={overview.uniqueVisitors?.toLocaleString() || '0'}
          subtitle="Worldwide"
          color="green"
        />
        <StatCard
          icon="⚡"
          title="Cache Hit Rate"
          value={`${overview.cacheHitRate?.toFixed(1) || '0'}%`}
          subtitle={`${overview.cacheHits || 0} hits / ${overview.cacheMisses || 0} misses`}
          color="purple"
        />
        <StatCard
          icon="🌍"
          title="Global Edge"
          value="300+"
          subtitle="Cloudflare locations"
          color="orange"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Endpoints */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Top Endpoints</h3>
          {topEndpoints.length > 0 ? (
            <div className="space-y-3">
              {topEndpoints.map((endpoint, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-mono text-sm text-gray-800 font-medium">{endpoint.request_path}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Avg: {endpoint.avg_time?.toFixed(0) || 0}ms
                    </p>
                  </div>
                  <span className="ml-4 px-3 py-1 bg-caribbean-100 text-caribbean-700 rounded-full text-sm font-bold">
                    {endpoint.requests}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Status Codes</h3>
          {statusBreakdown.length > 0 ? (
            <div className="space-y-3">
              {statusBreakdown.map((status, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className={`font-bold ${getStatusColor(status.status_group)}`}>
                        {status.status_group}
                      </span>
                      <span className="text-gray-600 font-medium">{status.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getStatusBarColor(status.status_group)}`}
                        style={{
                          width: `${(status.count / statusBreakdown.reduce((sum, s) => sum + s.count, 0)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>

        {/* Trending Datasets */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🔥 Trending Datasets</h3>
          {trending.length > 0 ? (
            <div className="space-y-3">
              {trending.map((dataset, index) => (
                <div key={dataset.id} className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}</span>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{dataset.input}</p>
                      <div className="flex gap-3 mt-2 text-xs text-gray-600">
                        <span className="px-2 py-1 bg-white rounded">{dataset.category}</span>
                        <span className="px-2 py-1 bg-white rounded">👁️ {dataset.usage_count}</span>
                        {dataset.total_clicks > 0 && (
                          <span className="px-2 py-1 bg-white rounded">👆 {dataset.total_clicks} clicks</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No trending data yet</p>
          )}
        </div>

        {/* Popular Searches */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🔍 Popular Searches</h3>
          {searches.length > 0 ? (
            <div className="space-y-3">
              {searches.map((search, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">"{search.search_query}"</span>
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-bold">
                      {search.search_count}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-2 text-xs text-gray-600">
                    <span>Avg results: {search.avg_results?.toFixed(1)}</span>
                    {search.click_through_rate && (
                      <span className="text-green-600 font-medium">
                        CTR: {search.click_through_rate.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No search data yet</p>
          )}
        </div>
      </div>

      {/* Performance Badge */}
      <div className="bg-gradient-to-r from-caribbean-500 to-caribbean-700 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">⚡ Performance Metrics</h3>
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-caribbean-200">Response Time</p>
                <p className="text-2xl font-bold">&lt; 100ms</p>
              </div>
              <div>
                <p className="text-caribbean-200">Uptime</p>
                <p className="text-2xl font-bold">99.9%+</p>
              </div>
              <div>
                <p className="text-caribbean-200">API Version</p>
                <p className="text-2xl font-bold">v2.0.0</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-caribbean-200">Powered by</p>
            <p className="text-xl font-bold">Cloudflare Edge Network</p>
            <p className="text-xs text-caribbean-300 mt-1">Global CDN • 300+ locations</p>
          </div>
        </div>
      </div>

      {/* Auto-refresh indicator */}
      <div className="text-center text-sm text-gray-500">
        <p>🔄 Auto-refreshing every 30 seconds • Last updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ icon, title, value, subtitle, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-700',
    green: 'from-green-500 to-green-700',
    purple: 'from-purple-500 to-purple-700',
    orange: 'from-orange-500 to-orange-700',
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg shadow-lg p-6 text-white`}>
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-sm opacity-90 mb-1">{title}</p>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-xs opacity-75">{subtitle}</p>
    </div>
  )
}

// Helper functions for status colors
function getStatusColor(status) {
  switch (status) {
    case '2xx': return 'text-green-600'
    case '4xx': return 'text-yellow-600'
    case '5xx': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

function getStatusBarColor(status) {
  switch (status) {
    case '2xx': return 'bg-green-500'
    case '4xx': return 'bg-yellow-500'
    case '5xx': return 'bg-red-500'
    default: return 'bg-gray-500'
  }
}

export default AnalyticsDashboard
