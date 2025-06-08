
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatSettingsProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  onSave: () => void;
}

const ChatSettings: React.FC<ChatSettingsProps> = ({ apiKey, onApiKeyChange, onSave }) => {
  return (
    <div className="p-4 border-b bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
          OpenAI API Key:
        </label>
        <Input
          type="password"
          placeholder="sk-..."
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          className="text-xs"
        />
        <Button onClick={onSave} size="sm" className="w-full text-xs">
          Save Key
        </Button>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Your API key is stored locally and never shared.
        </p>
      </div>
    </div>
  );
};

export default ChatSettings;
