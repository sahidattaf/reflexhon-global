import { useState } from 'react'

const API_BASE_URL = 'https://reflexhon-global.sahidattaf.workers.dev/api/v1'

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Bon bini na Reflexhon Studio! 🌴 Welcome! Ask me anything about Papiamentu culture, values, emotions, or traditions.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/reflexion/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: input.trim() })
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage = {
          role: 'assistant',
          content: data.output,
          metadata: data.metadata,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(data.error?.message || 'Failed to get response')
      }
    } catch (error) {
      const errorMessage = {
        role: 'error',
        content: `Error: ${error.message}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          💬 Cultural AI Chat
        </h2>
        <p className="text-gray-600 mb-4">
          Powered by Cloudflare AI • Culturally-aligned responses in Papiamentu & English
        </p>

        {/* Chat Messages */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4 h-[500px] overflow-y-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-caribbean-600 text-white'
                    : message.role === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-white text-gray-800 shadow-md border border-gray-200'
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {message.role === 'user' ? 'You' : message.role === 'error' ? 'Error' : '🌴 Reflexhon AI'}
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>

                {/* Metadata */}
                {message.metadata && (
                  <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                    <div className="flex flex-wrap gap-3">
                      {message.metadata.source && (
                        <span className="bg-caribbean-100 text-caribbean-800 px-2 py-1 rounded">
                          Source: {message.metadata.source}
                        </span>
                      )}
                      {message.metadata.model && (
                        <span className="bg-island-100 text-island-800 px-2 py-1 rounded">
                          Model: {message.metadata.model}
                        </span>
                      )}
                      {message.metadata.cultural_context && (
                        <span className="bg-sunset-100 text-sunset-800 px-2 py-1 rounded">
                          Context: {message.metadata.cultural_context}
                        </span>
                      )}
                      {message.metadata.processing_time_ms && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {message.metadata.processing_time_ms}ms
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-400 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 shadow-md border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-caribbean-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-caribbean-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-caribbean-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="ml-2 text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Papiamentu culture, values, traditions..."
            className="input-field flex-1"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>

        {/* Suggestions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <p className="text-sm text-gray-600 w-full mb-2">Try asking:</p>
          {[
            'Kiko ta empatia?',
            'What is love in Papiamentu culture?',
            'Tell me about Caribbean family values',
            'Kiko ta Karnaval?'
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setInput(suggestion)}
              className="text-xs bg-caribbean-50 text-caribbean-700 px-3 py-1.5 rounded-full hover:bg-caribbean-100 transition-colors"
              disabled={isLoading}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
