import { useState } from 'react'
import ChatInterface from './components/ChatInterface'
import DatasetExplorer from './components/DatasetExplorer'
import AnalyticsDashboard from './components/AnalyticsDashboard'

function App() {
  const [activeTab, setActiveTab] = useState('chat')

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-caribbean-600 to-caribbean-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">🌴 Reflexhon Studio</h1>
              <p className="text-caribbean-100 text-lg">
                Human-Centered Intelligence • Papiamentu Cultural AI
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-caribbean-200">Reflexhon Global 2027</p>
              <p className="text-xs text-caribbean-300">Caribbean • Aruba • Bonaire • Curaçao</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'chat'
                  ? 'border-caribbean-600 text-caribbean-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              💬 AI Chat
            </button>
            <button
              onClick={() => setActiveTab('explorer')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'explorer'
                  ? 'border-caribbean-600 text-caribbean-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📚 Dataset Explorer
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'analytics'
                  ? 'border-caribbean-600 text-caribbean-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {activeTab === 'chat' && <ChatInterface />}
        {activeTab === 'explorer' && <DatasetExplorer />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center text-gray-600 text-sm">
            <p className="mb-2">
              <span className="font-bold text-caribbean-600">v2.0.0</span> • Powered by Cloudflare Workers AI • Built with Cultural Alignment
            </p>
            <p className="text-xs text-gray-500">
              70+ culturally-aligned Papiamentu datasets • Real-time Analytics • Smart AI Recommendations • Caribbean heritage preservation
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
