'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your URBANFLOW assistant. I can help you with information about Kilimani development projects, building ratings, and community feedback. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('project') || input.includes('development')) {
      return 'I can help you find development projects in Kilimani! Currently, there are several active projects including the Yaya Centre Extension and Green Residences Phase 2. Would you like to know more about any specific project or see projects near your location?'
    }
    
    if (input.includes('feedback') || input.includes('comment')) {
      return 'Great question about feedback! You can provide feedback on both ongoing projects and completed buildings. For projects, you can give structured feedback on design, environmental impact, and community benefits. For buildings, you can rate walkability, biophilic design, and energy efficiency. Would you like me to guide you through the feedback process?'
    }
    
    if (input.includes('building') || input.includes('rate')) {
      return 'I can help you explore buildings in Kilimani! You can view detailed information about buildings including their sustainability scores, community ratings, and amenities. Popular buildings include Yaya Centre, Kilimani Plaza, and Green Towers. Which building would you like to learn more about?'
    }
    
    if (input.includes('map') || input.includes('location')) {
      return 'The interactive map shows all projects and buildings in Kilimani with real-time data on traffic density, green spaces, noise levels, and more. You can filter by different layers and click on any location to get detailed information. Would you like me to explain how to use specific map features?'
    }
    
    if (input.includes('payment') || input.includes('earning') || input.includes('incentive')) {
      return 'You can earn incentives for providing quality feedback on development projects! Approved feedback typically earns between KSh 200-500 depending on the detail and usefulness. Payments are processed weekly and you can track your earnings in the Payments section. Would you like to know more about the incentive criteria?'
    }
    
    if (input.includes('hello') || input.includes('hi') || input.includes('help')) {
      return 'Hello! I\'m here to help you navigate URBANFLOW. I can assist with finding projects, understanding the feedback system, exploring buildings, using the interactive map, or checking your earnings. What would you like to know more about?'
    }
    
    return 'I understand you\'re asking about urban development in Kilimani. I can help you with information about projects, buildings, feedback systems, the interactive map, or your earnings. Could you please be more specific about what you\'d like to know?'
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300",
          "bg-primary hover:bg-primary/90 text-white",
          isOpen && "rotate-180"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-96 h-[500px] shadow-2xl border-0 animate-scale-in">
          <CardHeader className="bg-primary text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span>URBANFLOW Assistant</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-[calc(500px-80px)]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start space-x-2",
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      "max-w-[80%] p-3 rounded-lg text-sm",
                      message.sender === 'user'
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-muted text-foreground rounded-bl-none'
                    )}
                  >
                    {message.content}
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg rounded-bl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about Kilimani development..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
