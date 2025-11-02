import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { MessageCircle, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import ChatInterface from './ChatInterface';

interface Chat {
  id: string;
  listing_id: number;
  renter_id: string;
  owner_id: string;
  updated_at: string;
  listing_title?: string;
  other_user_name?: string;
  unread_count?: number;
}

const ChatList: React.FC = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  const fetchChats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch all chats where user is involved
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select(`
          *,
          listings (
            id,
            title
          )
        `)
        .or(`renter_id.eq.${user.id},owner_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (chatsError) throw chatsError;

      // Get unread message counts and other user info
      const enrichedChats = await Promise.all(
        (chatsData || []).map(async (chat) => {
          const otherUserId = chat.renter_id === user.id ? chat.owner_id : chat.renter_id;
          
          // Fetch other user's profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', otherUserId)
            .single();

          // Count unread messages
          const { count } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('chat_id', chat.id)
            .eq('receiver_id', user.id)
            .eq('read_status', false);

          return {
            ...chat,
            listing_title: (chat as any).listings?.title || 'Unknown Listing',
            other_user_name: profileData?.display_name || 'User',
            unread_count: count || 0
          };
        })
      );

      setChats(enrichedChats);
    } catch (error: any) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (selectedChat) {
    const otherUserId = selectedChat.renter_id === user?.id 
      ? selectedChat.owner_id 
      : selectedChat.renter_id;

    return (
      <div className="h-[600px]">
        <ChatInterface
          chatId={selectedChat.id}
          receiverId={otherUserId}
          receiverName={selectedChat.other_user_name || 'User'}
          onClose={() => {
            setSelectedChat(null);
            fetchChats(); // Refresh chat list
          }}
        />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Connect. Chat. Rent with Confidence.
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2 font-semibold">No conversations yet</p>
              <p className="text-sm">Start chatting by messaging a listing owner!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm truncate">
                          {chat.other_user_name}
                        </h4>
                        {chat.unread_count! > 0 && (
                          <Badge variant="default" className="bg-blue-500">
                            {chat.unread_count}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mb-1">
                        {chat.listing_title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(chat.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ChatList;