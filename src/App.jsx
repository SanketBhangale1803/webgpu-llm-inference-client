import { useEffect, useRef, useState } from 'react'
import * as webllm from "@mlc-ai/web-llm"
import { marked } from "marked"
import "./app.css"

// Available models
const AVAILABLE_MODELS = [
  { id: "Llama-3.1-8B-Instruct-q4f32_1-MLC", name: "Llama 3.1 8B", description: "Fast and efficient 8B parameter model" },
  { id: "Llama-3.1-8B-Instruct-q4f16_1-MLC", name: "Llama 3.1 8B (16-bit)", description: "Higher precision 16-bit model" },
  { id: "Phi-3-mini-4k-instruct-q4f32_1-MLC", name: "Phi-3 Mini", description: "Microsoft's efficient 4k context model" },
  { id: "Gemma-2-9b-it-q4f32_1-MLC", name: "Gemma 2 9B", description: "Google's latest Gemma model" },
]

function App() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "You are an AI assistant. Answer the user's questions to the best of your ability."
    }
  ])
  const [engine, setEngine] = useState(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [initProgress, setInitProgress] = useState(0)
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0])
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [showModelSelector, setShowModelSelector] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    initializeModel(selectedModel.id)
  }, [])

  const initializeModel = async (modelId) => {
    setIsModelLoading(true)
    setInitProgress(0)
    
    try {
      const newEngine = await webllm.CreateMLCEngine(modelId, {
        initProgressCallback: (progress) => {
          console.log("initProgress", progress)
          // Try to use percent, fallback to progress, fallback to 1 if finished
          let percent = 0
          if (typeof progress.percent === 'number') {
            percent = progress.percent
          } else if (typeof progress.progress === 'number') {
            percent = progress.progress
          } else if (progress.finished) {
            percent = 1
          }
          setInitProgress(percent)
        }
      })
      
      setEngine(newEngine)
      setIsModelLoading(false)
    } catch (error) {
      console.error("Failed to initialize model:", error)
      setIsModelLoading(false)
    }
  }

  const handleModelChange = async (model) => {
    if (model.id === selectedModel.id) return
    
    setSelectedModel(model)
    setShowModelSelector(false)
    
    // Clear current conversation when switching models
    setMessages([
      {
        role: "system",
        content: "You are an AI assistant. Answer the user's questions to the best of your ability."
      }
    ])
    
    // Initialize new model
    await initializeModel(model.id)
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowWelcome(false)
    }, 10000) // 10 seconds to allow the typewriter effect to complete
    return () => clearTimeout(timeout)
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [input])

  async function sendMessageToLLM() {
    if (!input.trim() || !engine || isLoading) return

    const tempMessages = [...messages, { role: "user", content: input }]
    setMessages(tempMessages)
    setInput("")
    setIsLoading(true)
    setIsTyping(true)

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px'
    }

    try {
      const reply = await engine.chat.completions.create({
        messages: tempMessages,
      })

      console.log("reply: ", reply)
      const text = reply.choices[0].message.content
      
      setMessages([...tempMessages, {
        role: "assistant",
        content: text
      }])
    } catch (error) {
      console.error("Error:", error)
      setMessages([...tempMessages, {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again."
      }])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessageToLLM()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        role: "system",
        content: "You are an AI assistant. Answer the user's questions to the best of your ability."
      }
    ])
  }

  return (
    <main>
      {showWelcome ? (
        <div className="welcome-screen">
          <div className="welcome-content">
            <div className="logo">
              <div className="logo-icon">🤖</div>
              <h1>WebLLM Chat</h1>
            </div>
            <div className="typewriter">
              <span>Welcome to the future of AI conversations</span>
            </div>
            <div className="loading-bar">
              <div className="loading-progress" style={{ width: `${initProgress * 100}%` }}></div>
            </div>
            <p className="loading-text">Initializing AI model... {Math.round(initProgress * 100)}%</p>
          </div>
        </div>
      ) : (
        <section>
          <header className="chat-header">
            <div className="header-content">
              <div className="header-logo">
                <span className="logo-icon">🤖</span>
                <h2>WebLLM Chat</h2>
              </div>
              <div className="header-actions">
                <div className="model-selector">
                  <button 
                    onClick={() => setShowModelSelector(!showModelSelector)}
                    className="model-button"
                    disabled={isModelLoading}
                  >
                    <span className="model-name">{selectedModel.name}</span>
                    <span className="model-status">
                      {isModelLoading ? 'Loading...' : engine ? 'Ready' : 'Initializing...'}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6,9 12,15 18,9"></polyline>
                    </svg>
                  </button>
                  {showModelSelector && (
                    <div className="model-dropdown">
                      {AVAILABLE_MODELS.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => handleModelChange(model)}
                          className={`model-option ${model.id === selectedModel.id ? 'active' : ''}`}
                        >
                          <div className="model-info">
                            <div className="model-name">{model.name}</div>
                            <div className="model-description">{model.description}</div>
                          </div>
                          {model.id === selectedModel.id && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20,6 9,17 4,12"></polyline>
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="status-indicator">
                  <span className={`status-dot ${engine ? 'online' : 'offline'}`}></span>
                  <span className="status-text">{engine ? 'Ready' : 'Initializing...'}</span>
                </div>
                <button onClick={clearChat} className="clear-button" title="Clear chat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          </header>

          <div className="conversation-area">
            <div className="messages">
              {messages.filter(message => message.role !== "system").map((message, index) => (
                <div
                  className={`message ${message.role}`}
                  key={index}
                  dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }}
                />
              ))}
              {isTyping && (
                <div className="message assistant typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="input-area">
              <div className="input-container">
                <textarea
                  ref={textareaRef}
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                  rows="1"
                  disabled={isLoading || isModelLoading}
                />
                <button
                  onClick={sendMessageToLLM}
                  className={`send-button ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading || !input.trim() || isModelLoading}
                >
                  {isLoading ? (
                    <div className="spinner"></div>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22,2 15,22 11,13 2,9"></polygon>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
