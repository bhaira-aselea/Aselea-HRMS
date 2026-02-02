import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  Search,
  Users,
  User,
  Paperclip,
  Image,
  MoreVertical,
  Phone,
  Video,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApi } from '@/hooks/useApi';
import { chatAPI } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';

interface ChatGroup {
  _id: string;
  otherUser?: { _id: string; name: string };
  name?: string;
  type: 'group' | 'personal';
  lastMessage?: { content: string; createdAt: string };
  unreadCount?: number;
  members?: number;
  online?: boolean;
}

interface Message {
  _id: string;
  sender: { _id: string; name: string };
  content: string;
  createdAt: string;
  isMe?: boolean;
}

interface ChatModuleProps {
  role: 'admin' | 'hr' | 'employee';
}

const ChatModule = ({ role }: ChatModuleProps) => {
  const [selectedChat, setSelectedChat] = useState<ChatGroup | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<ChatGroup[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const { loading, execute } = useApi();
  const { toast } = useToast();

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedChat?.otherUser?._id) {
      fetchMessages(selectedChat.otherUser._id);
    }
  }, [selectedChat]);

  const fetchConversations = async () => {
    try {
      const result = await execute(() => chatAPI.getConversations());
      if (result?.data) {
        setConversations(result.data);
        if (result.data.length > 0 && !selectedChat) {
          setSelectedChat(result.data[0]);
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch conversations',
        variant: 'destructive',
      });
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      const result = await execute(() => chatAPI.getMessages(userId));
      if (result?.data) {
        setMessages(result.data);
      }
      // Mark as read
      await chatAPI.markAsRead(userId);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch messages',
        variant: 'destructive',
      });
    }
  };

  const handleSendMessage = async () => {
    if (!selectedChat?.otherUser?._id || !message.trim()) return;
    
    try {
      await execute(() => chatAPI.sendMessage(selectedChat.otherUser._id, message));
      setMessage('');
      fetchMessages(selectedChat.otherUser._id);
      fetchConversations();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send message',
        variant: 'destructive',
      });
    }
  };

  const filteredChats = conversations.filter(chat => {
    const chatName = chat.otherUser?.name || chat.name || '';
    return chatName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex gap-4 fade-in">
        {/* Chat List Sidebar */}
        <Card className="w-80 flex-shrink-0 glass-card flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Messages</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            {loading && conversations.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="p-2 space-y-1">
                  {filteredChats.map((chat) => {
                    const chatName = chat.otherUser?.name || chat.name || 'Unknown';
                    const lastMsg = chat.lastMessage?.content || 'No messages yet';
                    const timeAgo = chat.lastMessage?.createdAt 
                      ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '';
                    
                    return (
                      <div
                        key={chat._id}
                        onClick={() => setSelectedChat(chat)}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
                          selectedChat?._id === chat._id
                            ? 'bg-primary/15 border border-primary/20'
                            : 'hover:bg-secondary'
                        )}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarFallback className="bg-primary/20 text-primary">
                              {chat.type === 'group' ? (
                                <Users className="h-4 w-4" />
                              ) : (
                                chatName.split(' ').map(n => n[0]).join('')
                              )}
                            </AvatarFallback>
                          </Avatar>
                          {chat.type === 'personal' && chat.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground truncate">{chatName}</p>
                            <span className="text-xs text-muted-foreground">{timeAgo}</span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{lastMsg}</p>
                        </div>
                        {(chat.unreadCount || 0) > 0 && (
                          <Badge className="bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 glass-card flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {selectedChat.type === 'group' ? (
                        <Users className="h-4 w-4" />
                      ) : (
                        (selectedChat.otherUser?.name || selectedChat.name || 'U').split(' ').map(n => n[0]).join('')
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{selectedChat.otherUser?.name || selectedChat.name || 'Chat'}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedChat.type === 'group'
                        ? `${selectedChat.members || 0} members`
                        : selectedChat.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {loading && messages.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No messages yet. Start a conversation!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => {
                      const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      
                      return (
                        <div
                          key={msg._id}
                          className={cn(
                            'flex',
                            msg.isMe ? 'justify-end' : 'justify-start'
                          )}
                        >
                          <div
                            className={cn(
                              'max-w-[70%] p-3 rounded-2xl',
                              msg.isMe
                                ? 'bg-primary text-primary-foreground rounded-br-sm'
                                : 'bg-secondary text-foreground rounded-bl-sm'
                            )}
                          >
                            {!msg.isMe && (
                              <p className="text-xs font-medium mb-1">{msg.sender.name}</p>
                            )}
                            <p className="text-sm">{msg.content}</p>
                            <p
                              className={cn(
                                'text-xs mt-1',
                                msg.isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                              )}
                            >
                              {time}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Image className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 bg-secondary border-border"
                  />
                  <Button 
                    size="icon" 
                    className="glow-button"
                    onClick={handleSendMessage}
                    disabled={loading || !message.trim()}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Select a conversation to start chatting</p>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ChatModule;
