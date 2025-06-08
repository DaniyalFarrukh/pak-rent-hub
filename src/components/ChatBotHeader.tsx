
import React from 'react';
import { Bot, X, Settings } from 'lucide-react';

interface ChatBotHeaderProps {
  onClose: () => void;
  onSettingsToggle: () => void;
}

const ChatBotHeader: React.FC<ChatBotHeaderProps> = ({ onClose, onSettingsToggle }) => {
  return (
    <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Bot className="w-5 h-5" />
        <div>
          <h3 className="font-semibold text-sm">AI Assistant</h3>
          <p className="text-xs opacity-90">Powered by OpenAI</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onSettingsToggle}
          className="text-white hover:text-gray-200 transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatBotHeader;
