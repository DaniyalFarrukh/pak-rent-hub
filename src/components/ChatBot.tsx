
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ChatBotHeader from './ChatBotHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatSettings from './ChatSettings';
import TypingIndicator from './TypingIndicator';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant for Easy Lease. I can help you with rentals, bookings, payments, and any questions about our platform. How can I assist you today?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai-api-key', apiKey.trim());
      setShowSettings(false);
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been saved locally.",
      });
    }
  };

  const getAIResponse = async (userMessage: string): Promise<string> => {
    if (!apiKey) {
      return "Please set your OpenAI API key in the settings to use the AI chatbot. Click the settings icon to configure it.";
    }

    try {
      const systemPrompt = `You are a helpful customer service AI assistant for Easy Lease, a rental marketplace platform in Pakistan. 

About Easy Lease:
- It's Pakistan's trusted rental marketplace connecting renters and customers
- Users can rent vehicles, wedding dresses, tools, electronics, event equipment, and more
- We operate across major cities in Pakistan (Karachi, Lahore, Islamabad, etc.)
- We offer secure payments through EasyPaisa, JazzCash, bank transfers, and cash on delivery
- We have verified renters and quality-checked items
- 24/7 customer support is available

Key features to mention:
- Browse and search functionality
- Secure booking system
- Multiple payment options
- Verified renters with CNIC checks
- Quality guarantee on all items
- Delivery options available
- 24-hour cancellation policy

Be helpful, friendly, and informative. Provide specific information about Easy Lease when relevant. Keep responses concise but comprehensive.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.';
    } catch (error) {
      console.error('AI API Error:', error);
      return 'I\'m experiencing some technical difficulties. Please contact our support team at support@easylease.com or call +92-300-EASYLEASE for immediate assistance.';
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResponse = await getAIResponse(inputMessage);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize for the technical issue. Please contact our support team for assistance.',
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 z-40 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        aria-label="Open AI chat assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border z-50 flex flex-col dark:bg-gray-800 dark:border-gray-700">
          <ChatBotHeader 
            onClose={() => setIsOpen(false)}
            onSettingsToggle={() => setShowSettings(!showSettings)}
          />

          {showSettings && (
            <ChatSettings 
              apiKey={apiKey}
              onApiKeyChange={setApiKey}
              onSave={saveApiKey}
            />
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput 
            value={inputMessage}
            onChange={setInputMessage}
            onSend={handleSendMessage}
            onKeyPress={handleKeyPress}
            disabled={isTyping}
          />
        </div>
      )}
    </>
  );
};

export default ChatBot;
