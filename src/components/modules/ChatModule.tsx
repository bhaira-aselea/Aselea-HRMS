import { useState } from 'react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatGroup {
  id: string;
  name: string;
  type: 'group' | 'personal';
  avatar?: string;
  lastMessage: string;
  time: string;
  unread: number;
  members?: number;
  online?: boolean;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isMe: boolean;
}

const chatGroups: ChatGroup[] = [
  { id: '1', name: 'Engineering Team', type: 'group', lastMessage: 'Great work on the release!', time: '2m', unread: 3, members: 12 },
  { id: '2', name: 'HR Announcements', type: 'group', lastMessage: 'New policy update...', time: '15m', unread: 1, members: 45 },
  { id: '3', name: 'John Doe', type: 'personal', lastMessage: 'Can we discuss the project?', time: '1h', unread: 0, online: true },
  { id: '4', name: 'Jane Smith', type: 'personal', lastMessage: 'Thanks for the update!', time: '2h', unread: 0, online: false },
  { id: '5', name: 'Project Alpha', type: 'group', lastMessage: 'Meeting scheduled for tomorrow', time: '3h', unread: 5, members: 8 },
  { id: '6', name: 'Mike Johnson', type: 'personal', lastMessage: 'See you at the meeting', time: '5h', unread: 0, online: true },
];

const sampleMessages: Message[] = [
  { id: '1', sender: 'John Doe', content: 'Hey team, just wanted to share some updates on the project.', time: '10:30 AM', isMe: false },
  { id: '2', sender: 'Me', content: 'Thanks John! Looking forward to hearing the details.', time: '10:32 AM', isMe: true },
  { id: '3', sender: 'Jane Smith', content: 'Great! I have some feedback on the design as well.', time: '10:35 AM', isMe: false },
  { id: '4', sender: 'Me', content: 'Perfect, let\'s schedule a call to discuss everything.', time: '10:38 AM', isMe: true },
  { id: '5', sender: 'John Doe', content: 'How about tomorrow at 2 PM?', time: '10:40 AM', isMe: false },
  { id: '6', sender: 'Me', content: 'Works for me! I\'ll send out the calendar invite.', time: '10:42 AM', isMe: true },
];

interface ChatModuleProps {
  role: 'admin' | 'hr' | 'employee';
}

const ChatModule = ({ role }: ChatModuleProps) => {
  const [selectedChat, setSelectedChat] = useState<ChatGroup | null>(chatGroups[0]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chatGroups.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (message.trim()) {
      // In real app, this would send the message
      setMessage('');
    }
  };

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
            <ScrollArea className="h-full">
              <div className="p-2 space-y-1">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
                      selectedChat?.id === chat.id
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
                            chat.name.split(' ').map(n => n[0]).join('')
                          )}
                        </AvatarFallback>
                      </Avatar>
                      {chat.type === 'personal' && chat.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground truncate">{chat.name}</p>
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <Badge className="bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
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
                        selectedChat.name.split(' ').map(n => n[0]).join('')
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{selectedChat.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedChat.type === 'group'
                        ? `${selectedChat.members} members`
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
                <div className="space-y-4">
                  {sampleMessages.map((msg) => (
                    <div
                      key={msg.id}
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
                          <p className="text-xs font-medium text-primary mb-1">{msg.sender}</p>
                        )}
                        <p className="text-sm">{msg.content}</p>
                        <p className={cn(
                          'text-xs mt-1',
                          msg.isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        )}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
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
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-secondary border-border"
                  />
                  <Button onClick={handleSendMessage} className="glow-button">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ChatModule;
