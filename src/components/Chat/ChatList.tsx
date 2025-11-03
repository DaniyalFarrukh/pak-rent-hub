import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { MessageCircle, User, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
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
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredChats = chats.filter(chat =>
    chat.other_user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.listing_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedChat) {
    const otherUserId = selectedChat.renter_id === user?.id 
      ? selectedChat.owner_id 
      : selectedChat.renter_id;

    return (
      <div className="h-[calc(100vh-8rem)] max-h-[700px]">
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
    <Card className="w-full shadow-xl border-2 dark:border-gray-700">
      <CardHeader className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white rounded-t-lg pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <MessageCircle className="w-6 h-6" />
          Messages
        </CardTitle>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20 focus:border-white/40"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-16rem)] max-h-[600px]">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-blue-500 dark:text-blue-400" />
              </div>
              <p className="mb-2 font-semibold text-lg">
                {searchTerm ? 'No conversations found' : 'No conversations yet'}
              </p>
              <p className="text-sm">
                {searchTerm ? 'Try a different search term' : 'Start chatting by messaging a listing owner!'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className="p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800/50 dark:hover:to-gray-800/30 cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:border-blue-500"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="w-14 h-14 border-2 border-gray-200 dark:border-gray-700">
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 text-white font-semibold text-lg">
                          {chat.other_user_name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-base truncate">
                          {chat.other_user_name}
                        </h4>
                        {chat.unread_count! > 0 && (
                          <Badge variant="default" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-2">
                            {chat.unread_count}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate mb-1 font-medium">
                        {chat.listing_title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(chat.updated_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
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