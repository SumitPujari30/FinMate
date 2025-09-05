"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageCircle,
  Plus,
  Send,
  Edit2,
  Trash2,
  Check,
  X,
  Sidebar,
  MoreVertical,
  Bot,
  User,
  AlertTriangle,
  BookOpen,
  Calculator,
  Download,
  Mic,
  MicOff,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GlossarySidebar } from "./glossary-sidebar"
import { LoanCalculator } from "./loan-calculator"
import { FraudAlert } from "./fraud-alert"

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: number
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: number
}

export function ChatInterface() {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [glossaryOpen, setGlossaryOpen] = useState(false)
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null)
  const [renamingValue, setRenamingValue] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [fraudAlertOpen, setFraudAlertOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any | null>(null)

  useEffect(() => {
    console.log("[v0] Checking speech recognition support...")

    if (typeof window === "undefined") {
      console.log("[v0] Window not available (SSR)")
      return
    }

    const hasSpeechRecognition = "SpeechRecognition" in window || "webkitSpeechRecognition" in window
    console.log("[v0] Speech recognition available:", hasSpeechRecognition)

    if (hasSpeechRecognition) {
      setSpeechSupported(true)

      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        recognitionRef.current = new SpeechRecognition()

        console.log("[v0] SpeechRecognition instance created")

        if (recognitionRef.current) {
          recognitionRef.current.continuous = false
          recognitionRef.current.interimResults = false
          recognitionRef.current.lang = "en-US"
          recognitionRef.current.maxAlternatives = 1

          recognitionRef.current.onstart = () => {
            console.log("[v0] Speech recognition started")
            setIsListening(true)
            setError(null)
          }

          recognitionRef.current.onresult = (event: any) => {
            console.log("[v0] Speech recognition result:", event)
            const transcript = event.results[0][0]?.transcript || ""
            console.log("[v0] Transcript:", transcript)

            if (transcript.trim()) {
              setInputValue((prev) => {
                const newValue = prev + (prev ? " " : "") + transcript.trim()
                console.log("[v0] Updated input value:", newValue)
                return newValue
              })
            }
          }

          recognitionRef.current.onend = () => {
            console.log("[v0] Speech recognition ended")
            setIsListening(false)
          }

          recognitionRef.current.onerror = (event: any) => {
            console.error("[v0] Speech recognition error:", event.error)
            setIsListening(false)

            let errorMessage = "Voice recognition failed. "
            switch (event.error) {
              case "not-allowed":
                errorMessage += "Please allow microphone access."
                break
              case "no-speech":
                errorMessage += "No speech detected. Please try again."
                break
              case "network":
                errorMessage += "Network error. Please check your connection."
                break
              default:
                errorMessage += "Please try again."
            }
            setError(errorMessage)
          }

          recognitionRef.current.onnomatch = () => {
            console.log("[v0] No speech match found")
            setError("Could not understand speech. Please try again.")
          }
        }
      } catch (error) {
        console.error("[v0] Error creating SpeechRecognition:", error)
        setSpeechSupported(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          console.error("[v0] Error stopping recognition:", error)
        }
      }
    }
  }, [])

  const toggleVoiceRecognition = () => {
    console.log("[v0] Toggle voice recognition clicked")
    console.log("[v0] Speech supported:", speechSupported)
    console.log("[v0] Recognition ref:", !!recognitionRef.current)
    console.log("[v0] Currently listening:", isListening)

    if (!speechSupported || !recognitionRef.current) {
      console.log("[v0] Speech recognition not available")
      setError("Voice recognition is not supported in your browser.")
      return
    }

    try {
      if (isListening) {
        console.log("[v0] Stopping speech recognition")
        recognitionRef.current.stop()
      } else {
        console.log("[v0] Starting speech recognition")
        setError(null)
        recognitionRef.current.start()
      }
    } catch (error) {
      console.error("[v0] Error toggling speech recognition:", error)
      setError("Failed to start voice recognition. Please try again.")
      setIsListening(false)
    }
  }

  useEffect(() => {
    const savedChats = localStorage.getItem("finmate-chats")
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats)
      setChats(parsedChats)
      if (parsedChats.length > 0) {
        setCurrentChatId(parsedChats[0].id)
      }
    }
  }, [])

  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("finmate-chats", JSON.stringify(chats))
    }
  }, [chats])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chats, currentChatId])

  const currentChat = chats.find((chat) => chat.id === currentChatId)

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
    }
    setChats((prev) => [newChat, ...prev])
    setCurrentChatId(newChat.id)
    setSidebarOpen(false)
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: "user",
      timestamp: Date.now(),
    }

    let targetChatId = currentChatId

    // Create chat if none exists
    if (!currentChatId) {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: inputValue.trim().slice(0, 50) + (inputValue.length > 50 ? "..." : ""),
        messages: [userMessage],
        createdAt: Date.now(),
      }
      setChats((prev) => [newChat, ...prev])
      setCurrentChatId(newChat.id)
      targetChatId = newChat.id
    } else {
      // Add message to existing chat
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [...chat.messages, userMessage],
                title:
                  chat.messages.length === 0
                    ? userMessage.content.slice(0, 50) + (userMessage.content.length > 50 ? "..." : "")
                    : chat.title,
              }
            : chat,
        ),
      )
    }

    setInputValue("")
    setIsLoading(true)
    setError(null)

    try {
      const currentChat = chats.find((chat) => chat.id === targetChatId)
      const conversationHistory = currentChat ? currentChat.messages : [userMessage]

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: conversationHistory.slice(-10), // Send last 10 messages for context
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get response")
      }

      const data = await response.json()

      if (data.fraudAlert) {
        setFraudAlertOpen(true)
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply,
        role: "assistant",
        timestamp: Date.now(),
      }

      setChats((prev) =>
        prev.map((chat) => (chat.id === targetChatId ? { ...chat, messages: [...chat.messages, aiMessage] } : chat)),
      )
    } catch (error) {
      console.error("Error sending message:", error)
      setError(error instanceof Error ? error.message : "Failed to send message")

      // Remove the user message if API call failed
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === targetChatId
            ? { ...chat, messages: chat.messages.filter((msg) => msg.id !== userMessage.id) }
            : chat,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const deleteMessage = (messageId: string) => {
    if (!currentChatId) return

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== currentChatId) return chat

        const messageIndex = chat.messages.findIndex((m) => m.id === messageId)
        if (messageIndex === -1) return chat

        const newMessages = [...chat.messages]

        // If deleting a user message, also delete the subsequent AI response
        if (
          chat.messages[messageIndex].role === "user" &&
          messageIndex + 1 < chat.messages.length &&
          chat.messages[messageIndex + 1].role === "assistant"
        ) {
          newMessages.splice(messageIndex, 2)
        } else {
          newMessages.splice(messageIndex, 1)
        }

        return { ...chat, messages: newMessages }
      }),
    )
  }

  const startEditMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId)
    setEditingValue(content)
  }

  const saveEditMessage = () => {
    if (!currentChatId || !editingMessageId) return

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: chat.messages.map((msg) =>
                msg.id === editingMessageId ? { ...msg, content: editingValue.trim() } : msg,
              ),
            }
          : chat,
      ),
    )
    setEditingMessageId(null)
    setEditingValue("")
  }

  const deleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId))
    if (currentChatId === chatId) {
      const remainingChats = chats.filter((chat) => chat.id !== chatId)
      setCurrentChatId(remainingChats.length > 0 ? remainingChats[0].id : null)
    }
  }

  const startRenameChat = (chatId: string, currentTitle: string) => {
    setRenamingChatId(chatId)
    setRenamingValue(currentTitle)
  }

  const saveRenameChat = () => {
    if (!renamingChatId) return

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === renamingChatId ? { ...chat, title: renamingValue.trim() || "Untitled Chat" } : chat,
      ),
    )
    setRenamingChatId(null)
    setRenamingValue("")
  }

  const downloadChat = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId)
    if (!chat) return

    const chatData = {
      title: chat.title,
      createdAt: new Date(chat.createdAt).toLocaleString(),
      messages: chat.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp).toLocaleString(),
      })),
    }

    const dataStr = JSON.stringify(chatData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `finmate-chat-${chat.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex gap-4 h-[600px]">
          {/* Chat Sidebar */}
          <div
            className={`${sidebarOpen ? "block" : "hidden"} md:block w-80 bg-card border border-border rounded-lg shadow-medium`}
          >
            <div className="p-4 border-b border-border">
              <Button
                onClick={createNewChat}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mb-3"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
              <div className="flex gap-2">
                <Button onClick={() => setGlossaryOpen(!glossaryOpen)} variant="outline" size="sm" className="flex-1">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Glossary
                </Button>
                <LoanCalculator
                  trigger={
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Calculator className="h-4 w-4 mr-1" />
                      Calculator
                    </Button>
                  }
                />
              </div>
            </div>
            <ScrollArea className="h-[500px] p-4">
              <div className="space-y-2">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                      currentChatId === chat.id ? "bg-primary/10 border border-primary/20" : "hover:bg-accent"
                    }`}
                    onClick={() => setCurrentChatId(chat.id)}
                  >
                    <MessageCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    {renamingChatId === chat.id ? (
                      <div className="flex-1 flex gap-1">
                        <Input
                          value={renamingValue}
                          onChange={(e) => setRenamingValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveRenameChat()
                            if (e.key === "Escape") setRenamingChatId(null)
                          }}
                          className="h-6 text-sm"
                          autoFocus
                        />
                        <Button size="sm" variant="ghost" onClick={saveRenameChat} className="h-6 w-6 p-0">
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setRenamingChatId(null)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1 text-sm truncate">{chat.title}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => startRenameChat(chat.id, chat.title)}>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => downloadChat(chat.id)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteChat(chat.id)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 bg-card border border-border rounded-lg shadow-medium flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
                <Sidebar className="h-4 w-4" />
              </Button>
              <h3 className="font-serif font-semibold text-foreground flex-1">
                {currentChat?.title || "FinMate Assistant"}
              </h3>
              {currentChat && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadChat(currentChat.id)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              )}
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-4">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {currentChat?.messages.length === 0 || !currentChat ? (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <Bot className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h4 className="text-lg font-serif font-semibold text-foreground mb-2">Welcome to FinMate</h4>
                    <p className="text-muted-foreground">
                      Ask me anything about personal finance, investments, budgeting, or use our financial tools.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentChat.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}

                      <div className={`group max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
                        {editingMessageId === message.id ? (
                          <div className="bg-accent border border-border rounded-lg p-3">
                            <Input
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEditMessage()
                                if (e.key === "Escape") setEditingMessageId(null)
                              }}
                              className="mb-2"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={saveEditMessage}>
                                <Check className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingMessageId(null)}>
                                <X className="h-3 w-3 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`rounded-lg p-3 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-accent text-accent-foreground"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {message.role === "user" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => startEditMessage(message.id, message.content)}
                                  className="h-6 w-6 p-0 hover:bg-primary-foreground/20"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteMessage(message.id)}
                                className="h-6 w-6 p-0 hover:bg-destructive/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {message.role === "user" && (
                        <div className="h-8 w-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-accent-foreground" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="bg-accent text-accent-foreground rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Ask me about your finances..."
                  disabled={isLoading}
                  className="flex-1"
                />
                {speechSupported && (
                  <Button
                    onClick={toggleVoiceRecognition}
                    disabled={isLoading}
                    variant="outline"
                    size="icon"
                    className={`${isListening ? "bg-red-500 hover:bg-red-600 text-white" : "hover:bg-accent"}`}
                    title={isListening ? "Stop recording" : "Start voice input"}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}
                <Button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <GlossarySidebar isOpen={glossaryOpen} />
        </div>

        <FraudAlert isOpen={fraudAlertOpen} onClose={() => setFraudAlertOpen(false)} />
      </div>
    </section>
  )
}
