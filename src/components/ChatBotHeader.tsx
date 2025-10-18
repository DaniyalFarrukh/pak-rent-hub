import React from 'react';
import { Bot, X } from 'lucide-react';

interface ChatBotHeaderProps {
  onClose: () => void;
}

const ChatBotHeader: React.FC<ChatBotHeaderProps> = ({ onClose }) => {
  return (
    <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Bot className="w-5 h-5" />
        <div>
          <h3 className="font-semibold text-sm">AI Assistant</h3>
          <p className="text-xs opacity-90">Pak Rent Hub Helper</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-primary-foreground hover:opacity-75 transition-opacity"
        aria-label="Close chat"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ChatBotHeader;
