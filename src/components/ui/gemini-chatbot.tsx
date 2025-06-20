import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Send, Bot, User, Sparkles, Rocket, MessageCircle, X, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { ScrollArea } from './scroll-area';
import { Badge } from './badge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isKidsMode?: boolean;
}

interface GeminiChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

// Space-themed prompts for different user types
const SYSTEM_PROMPTS = {
  kids: `You are Astro, a friendly space explorer robot! You help kids learn about space in a fun and exciting way. 
  
  Guidelines:
  - Keep answers simple and use age-appropriate language (ages 6-14)
  - Use lots of emojis (🚀🌟⭐🪐🌍🌙🛸👨‍🚀)
  - Make everything sound like an adventure
  - Use exciting words like "wow", "amazing", "incredible", "awesome", "super cool"
  - Give fun comparisons (like "Jupiter is so big that 1,300 Earths could fit inside it!")
  - Always encourage more questions and curiosity
  - Include interesting space facts that kids love
  - If asked about scary space things, make them less frightening but still educational`,
  
  research: `You are AstroAgent AI, an advanced space research assistant specializing in:
  
  CORE EXPERTISE:
  - Astronomy and astrophysics (stellar evolution, cosmology, galaxy formation)
  - Planetary science (exoplanets, solar system dynamics, astrobiology)
  - Space missions (NASA, ESA, SpaceX, international space programs)
  - Space technology (rockets, satellites, space telescopes, propulsion systems)
  - Current space developments and news
  - Space exploration history and future missions
  
  RESPONSE STYLE:
  - Provide scientifically accurate, detailed information
  - Include relevant data, statistics, and measurements when appropriate
  - Mention credible sources (NASA, ESA, peer-reviewed journals, space agencies)
  - Offer to provide specific mission details or technical specifications
  - Use proper scientific terminology while remaining accessible
  - When possible, include quotes from astronauts, scientists, or mission engineers
  - Suggest related topics for further research`
};

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({ 
  isOpen, 
  onClose, 
  className = "" 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isKidsMode, setIsKidsMode] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const genAI = useRef<GoogleGenerativeAI | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);  useEffect(() => {
    // Use environment variable API key as default
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const storedApiKey = localStorage.getItem('gemini-api-key');
    
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setShowApiKeyInput(false);
      genAI.current = new GoogleGenerativeAI(storedApiKey);
    } else if (envApiKey) {
      // Use environment API key
      setApiKey(envApiKey);
      setShowApiKeyInput(false);
      genAI.current = new GoogleGenerativeAI(envApiKey);
      // Don't store env key in localStorage to keep it secure
    }
  }, []);
  const handleApiKeySubmit = () => {
    // Use existing API key or the one in the input
    const keyToUse = apiKey.trim();
    if (keyToUse) {
      localStorage.setItem('gemini-api-key', keyToUse);
      genAI.current = new GoogleGenerativeAI(keyToUse);
      setShowApiKeyInput(false);
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: isKidsMode 
          ? "🚀 Hi there, space explorer! I'm Astro, your friendly space robot! Ask me anything about planets, stars, rockets, astronauts, and all the cool stuff in space! Want to know how big Jupiter is? Or how rockets work? Just ask! 🌟✨"
          : "Welcome to AstroAgent AI, your advanced space research assistant. I can help you with detailed information about astronomy, astrophysics, space missions, planetary science, and current space developments. I can provide scientific explanations, mission data, and credible sources for your research. How can I assist you today?",
        timestamp: new Date(),
        isKidsMode
      };
      setMessages([welcomeMessage]);
    }
  };

  const speakMessage = (text: string) => {
    if (isSpeechEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = isKidsMode ? 0.9 : 0.8;
      utterance.pitch = isKidsMode ? 1.2 : 1.0;
      speechSynthesis.speak(utterance);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !genAI.current || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      isKidsMode
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);    try {
      const model = genAI.current.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const systemPrompt = isKidsMode ? SYSTEM_PROMPTS.kids : SYSTEM_PROMPTS.research;
      const fullPrompt = `${systemPrompt}\n\nUser question: ${inputMessage}`;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text,
        timestamp: new Date(),
        isKidsMode
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response if speech is enabled
      if (isSpeechEnabled) {
        speakMessage(text);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: isKidsMode 
          ? "Oops! Something went wrong in my space circuits! 🤖 Can you try asking again?"
          : "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
        isKidsMode
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleMode = () => {
    setIsKidsMode(!isKidsMode);
    setMessages([]); // Clear messages when switching modes
  };

  const clearApiKey = () => {
    localStorage.removeItem('gemini-api-key');
    setApiKey('');
    setShowApiKeyInput(true);
    setMessages([]);
    genAI.current = null;
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`fixed inset-4 z-50 flex items-center justify-center ${className}`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Chatbot Container */}
      <Card className={`relative w-full h-full min-h-[320px] min-w-[320px] max-w-[420px] max-h-[420px] flex flex-col justify-between bg-gradient-to-br from-gray-900/95 to-blue-900/95 border-blue-500/30 backdrop-blur-sm`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isKidsMode ? 'bg-orange-500/20' : 'bg-blue-500/20'}`}>
              {isKidsMode ? (
                <Rocket className={`w-5 h-5 ${isKidsMode ? 'text-orange-400' : 'text-blue-400'}`} />
              ) : (
                <Bot className={`w-5 h-5 ${isKidsMode ? 'text-orange-400' : 'text-blue-400'}`} />
              )}
            </div>
            <div>
              <CardTitle className="text-white">
                {isKidsMode ? "🚀 Astro Explorer" : "AstroAgent AI"}
              </CardTitle>
              <Badge variant={isKidsMode ? "destructive" : "secondary"} className="text-xs mt-1">
                {isKidsMode ? "Kids Mode" : "Research Mode"}
              </Badge>
              <span className="block text-xs text-blue-300 mt-1">You can switch to Kids Mode for a fun, friendly experience! <span className='inline-block align-middle ml-1'>31680</span></span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
              className="text-gray-300 hover:text-white"
            >
              {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMode}
              className="text-gray-300 hover:text-white"
            >
              <Sparkles className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col h-full p-0">
          {showApiKeyInput ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center space-y-4 max-w-md">
                <div className="p-4 rounded-full bg-blue-500/20 w-fit mx-auto">
                  <Bot className="w-8 h-8 text-blue-400" />
                </div>                <h3 className="text-xl font-semibold text-white">
                  Ready to Explore Space! 🚀
                </h3>
                <p className="text-gray-300 text-sm">
                  Your AI space assistant is ready with a configured API key! 
                  You can start chatting immediately or use your own Gemini API key for a personalized experience.
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={handleApiKeySubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    🚀 Start Space Chat!
                  </Button>
                  <div className="text-xs text-gray-400 text-center">or</div>
                  <Input
                    type="password"
                    placeholder="Enter your own Gemini API key (optional)..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-gray-800/50 border-gray-600 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleApiKeySubmit()}
                  />
                  <Button 
                    onClick={handleApiKeySubmit}
                    variant="outline"
                    className="w-full"
                    disabled={!apiKey.trim()}
                  >
                    Use Custom API Key
                  </Button>
                </div>
                <p className="text-xs text-gray-400">
                  Your API key is stored locally and never shared.{' '}
                  <button 
                    onClick={clearApiKey}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Clear stored key
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Messages Area */}
              <ScrollArea className="flex-1 px-6">
                <div className="space-y-4 py-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === 'user' 
                          ? 'bg-blue-500/20' 
                          : message.isKidsMode 
                            ? 'bg-orange-500/20' 
                            : 'bg-green-500/20'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-4 h-4 text-blue-400" />
                        ) : message.isKidsMode ? (
                          <Rocket className="w-4 h-4 text-orange-400" />
                        ) : (
                          <Bot className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                      
                      <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800/50 text-gray-100 border border-gray-700'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3"
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isKidsMode ? 'bg-orange-500/20' : 'bg-green-500/20'
                      }`}>
                        {isKidsMode ? (
                          <Rocket className="w-4 h-4 text-orange-400" />
                        ) : (
                          <Bot className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t border-gray-700 p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isKidsMode 
                      ? "Ask me about space! 🚀" 
                      : "Ask about space research, missions, or astronomy..."
                    }
                    className="flex-1 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                  <span>
                    {isKidsMode ? "🌟 Fun space learning mode" : "📚 Research assistance mode"}
                  </span>
                  <button 
                    onClick={clearApiKey}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Change API Key
                  </button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GeminiChatbot;
