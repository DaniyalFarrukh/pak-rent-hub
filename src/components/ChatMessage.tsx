
import React from 'react';
import { Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          message.isBot
            ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            : 'bg-blue-600 text-white'
        }`}
      >
        <div className="flex items-start space-x-2">
          {message.isBot && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
          <div className="flex-1">
            <p className="text-sm">{message.text}</p>
            <p className={`text-xs mt-1 ${
              message.isBot ? 'text-gray-500 dark:text-gray-400' : 'text-blue-100'
            }`}>
              {formatTime(message.timestamp)}
            </p>
          </div>
          {!message.isBot && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
