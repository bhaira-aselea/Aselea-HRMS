import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Megaphone,
  Plus,
  Calendar,
  Bell,
  AlertTriangle,
  Info,
  Clock,
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

const announcements: Announcement[] = [
  { 
    id: '1', 
    title: 'Office Closed for Maintenance', 
    content: 'The office will be closed on February 15th for annual maintenance work. Please plan accordingly and work remotely on this day.', 
    author: 'HR Team', 
    date: 'Jan 30, 2026', 
    priority: 'high',
    category: 'Facility'
  },
  { 
    id: '2', 
    title: 'New Health Insurance Benefits', 
    content: 'We are pleased to announce enhanced health insurance benefits starting March 1st. The new plan includes dental and vision coverage.', 
    author: 'Benefits Team', 
    date: 'Jan 28, 2026', 
    priority: 'medium',
    category: 'Benefits'
  },
  { 
    id: '3', 
    title: 'Team Building Event', 
    content: 'Join us for our quarterly team building event on February 20th at the Grand Conference Center. Activities include workshops and networking.', 
    author: 'Culture Committee', 
    date: 'Jan 25, 2026', 
    priority: 'low',
    category: 'Events'
  },
  { 
    id: '4', 
    title: 'Updated Leave Policy', 
    content: 'Please review the updated leave policy document. Key changes include increased casual leave days and new parental leave benefits.', 
    author: 'HR Team', 
    date: 'Jan 22, 2026', 
    priority: 'high',
    category: 'Policy'
  },
  { 
    id: '5', 
    title: 'IT System Upgrade', 
    content: 'The IT team will be performing system upgrades this weekend. Expect brief interruptions to email and internal tools on Saturday.', 
    author: 'IT Department', 
    date: 'Jan 20, 2026', 
    priority: 'medium',
    category: 'IT'
  },
];

interface AnnouncementsModuleProps {
  role: 'admin' | 'hr' | 'employee';
}

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'high':
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    case 'medium':
      return <Bell className="h-4 w-4 text-warning" />;
    default:
      return <Info className="h-4 w-4 text-primary" />;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return <Badge className="status-rejected">Urgent</Badge>;
    case 'medium':
      return <Badge className="status-pending">Important</Badge>;
    case 'low':
      return <Badge className="status-approved">Info</Badge>;
    default:
      return <Badge>{priority}</Badge>;
  }
};

const AnnouncementsModule = ({ role }: AnnouncementsModuleProps) => {
  const [filter, setFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredAnnouncements = announcements.filter(ann => {
    if (filter === 'all') return true;
    return ann.priority === filter;
  });

  // Both Admin and HR can create announcements
  const canCreate = role === 'hr' || role === 'admin';

  return (
    <DashboardLayout>
      <div className="space-y-6 fade-in">
        {/* Header Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="glass-card card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {announcements.filter(a => a.priority === 'high').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Urgent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {announcements.filter(a => a.priority === 'medium').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Important</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Megaphone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{announcements.length}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Announcements */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-primary" />
                  Announcements
                </CardTitle>
                <CardDescription>Company-wide announcements and updates</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[130px] bg-secondary border-border">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="high">Urgent</SelectItem>
                    <SelectItem value="medium">Important</SelectItem>
                    <SelectItem value="low">Info</SelectItem>
                  </SelectContent>
                </Select>
                {canCreate && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="glow-button">
                        <Plus className="h-4 w-4 mr-2" />
                        Create
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card">
                      <DialogHeader>
                        <DialogTitle>Create Announcement</DialogTitle>
                        <DialogDescription>Broadcast a message to all employees</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input placeholder="Enter announcement title" className="bg-secondary border-border" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Category</Label>
                            <Select>
                              <SelectTrigger className="bg-secondary border-border">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="policy">Policy</SelectItem>
                                <SelectItem value="events">Events</SelectItem>
                                <SelectItem value="benefits">Benefits</SelectItem>
                                <SelectItem value="it">IT</SelectItem>
                                <SelectItem value="facility">Facility</SelectItem>
                                <SelectItem value="general">General</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select>
                              <SelectTrigger className="bg-secondary border-border">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Info</SelectItem>
                                <SelectItem value="medium">Important</SelectItem>
                                <SelectItem value="high">Urgent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Content</Label>
                          <Textarea placeholder="Enter announcement content" className="bg-secondary border-border min-h-[120px]" />
                        </div>
                        <Button className="w-full glow-button" onClick={() => setIsDialogOpen(false)}>
                          Publish Announcement
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`p-5 rounded-lg bg-secondary/50 border-l-4 ${
                    announcement.priority === 'high' ? 'border-l-destructive' :
                    announcement.priority === 'medium' ? 'border-l-warning' : 'border-l-primary'
                  } hover:bg-secondary transition-colors`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {getPriorityIcon(announcement.priority)}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{announcement.title}</h3>
                          {getPriorityBadge(announcement.priority)}
                          <Badge variant="outline" className="text-xs">{announcement.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{announcement.content}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{announcement.author}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {announcement.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AnnouncementsModule;
