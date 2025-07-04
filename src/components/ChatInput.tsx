
import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  value, 
  onChange, 
  onSend, 
  onKeyPress, 
  disabled 
}) => {
  return (
    <div className="border-t border-border p-4">
      <div className="flex space-x-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Ask me anything about Easy Lease..."
          className="flex-1"
          disabled={disabled}
        />
        <Button
          onClick={onSend}
          disabled={!value.trim() || disabled}
          size="sm"
          className="bg-primary hover:bg-primary/90"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        AI-powered support • Usually replies instantly
      </p>
    </div>
  );
};

export default ChatInput;
