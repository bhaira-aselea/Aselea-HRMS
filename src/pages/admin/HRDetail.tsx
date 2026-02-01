import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { adminAPI } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  UserCog,
  Key,
  Clock,
  MessageSquare,
  ClipboardList,
  Edit,
  Building2,
  Users,
  Loader2,
} from 'lucide-react';

// Section type for navigation
type Section = 'overview' | 'employees' | 'tasks' | 'chat';

// HR Account interface
interface HRAccount {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: { name: string; _id: string };
  department: string;
  position: string;
  status: 'active' | 'inactive';
  joinedDate: string;
  avatar?: string;
  dateOfBirth: string;
  address: string;
  employeeId: string;
  reportingTo?: string;
}

const HRDetail = () => {
  const { hrId } = useParams<{ hrId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [hrAccount, setHrAccount] = useState<HRAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHRDetail = async () => {
      if (!hrId) return;
      
      try {
        setLoading(true);
        const response = await adminAPI.getHRDetail(hrId);
        if (response.data.success) {
          setHrAccount(response.data.data);
        }
      } catch (error: any) {
        console.error('Failed to fetch HR details:', error);
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to load HR details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHRDetail();
  }, [hrId, toast]);

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  // Find HR account by ID - now using state from API

  // If HR account not found, show error state
  if (!hrAccount) {
    return (
      <DashboardLayout>
        <div className="space-y-6 fade-in">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/admin/hr-accounts')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to HR Accounts
            </Button>
          </div>
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <UserCog className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">HR Account Not Found</h2>
              <p className="text-muted-foreground">The HR account you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Helper function for status styling
  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-approved';
      case 'inactive':
        return 'bg-muted';
      default:
        return 'bg-muted';
    }
  };

  // Helper function for status display text
  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 fade-in">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin/hr-accounts')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to HR Accounts
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">HR Manager Profile</h1>
              <p className="text-muted-foreground">Complete HR manager information and details</p>
            </div>
          </div>
          <Button className="glow-button">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Profile Card and Navigation Menu */}
          <div className="lg:col-span-3 space-y-4">
            {/* Profile Card */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-28 w-28 mb-4 border-4 border-primary/20 ring-2 ring-primary/10">
                    <AvatarImage src={hrAccount.avatar} alt={hrAccount.name} />
                    <AvatarFallback className="bg-primary/20 text-primary text-3xl font-semibold">
                      {hrAccount.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold text-foreground mb-1">{hrAccount.name}</h2>
                  <p className="text-sm text-muted-foreground mb-3">{hrAccount.position}</p>
                  <div className="flex flex-col gap-2 w-full">
                    <Badge variant="outline" className="bg-primary/10 border-primary/30 text-xs justify-center">
                      {hrAccount.department}
                    </Badge>
                    <Badge variant="outline" className={`${getStatusClassName(hrAccount.status)} text-xs justify-center`}>
                      {getStatusText(hrAccount.status)}
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs justify-center">
                      {hrAccount.employeeId}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">-</p>
                    <p className="text-xs text-muted-foreground">Employees Managed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Menu */}
            <Card className="glass-card">
              <CardContent className="p-3">
                <nav className="space-y-1">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      activeSection === 'overview'
                        ? 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary nav-active'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    onClick={() => setActiveSection('overview')}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Overview
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      activeSection === 'employees'
                        ? 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary nav-active'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    onClick={() => setActiveSection('employees')}
                  >
                    <Users className="h-4 w-4 mr-3" />
                    Employees
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      activeSection === 'tasks'
                        ? 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary nav-active'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    onClick={() => setActiveSection('tasks')}
                  >
                    <ClipboardList className="h-4 w-4 mr-3" />
                    Tasks
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      activeSection === 'chat'
                        ? 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary nav-active'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    onClick={() => setActiveSection('chat')}
                  >
                    <MessageSquare className="h-4 w-4 mr-3" />
                    Chat
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Dynamic Content Area */}
          <div className="lg:col-span-9">
            {activeSection === 'overview' && (
              <div className="space-y-6">
                {/* Information Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <Card className="glass-card">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-xl">Personal Information</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start justify-between py-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span className="text-sm">Full Name</span>
                        </div>
                        <span className="text-sm font-medium text-foreground text-right">{hrAccount.name}</span>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="flex items-start justify-between py-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">Email Address</span>
                        </div>
                        <span className="text-sm font-medium text-foreground text-right break-all">{hrAccount.email}</span>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="flex items-start justify-between py-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm">Phone Number</span>
                        </div>
                        <span className="text-sm font-medium text-foreground text-right">{hrAccount.phone}</span>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="flex items-start justify-between py-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">Date of Birth</span>
                        </div>
                        <span className="text-sm font-medium text-foreground text-right">
                          {hrAccount.dateOfBirth || 'Not provided'}
                        </span>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="flex items-start justify-between py-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">Address</span>
                        </div>
                        <span className="text-sm font-medium text-foreground text-right max-w-xs">
                          {hrAccount.address || 'Not provided'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Employment Information */}
                  <Card className="glass-card">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Briefcase className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-xl">Employment Information</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start justify-between py-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <UserCog className="h-4 w-4" />
                          <span className="text-sm">HR ID</span>
                        </div>
                        <span className="text-sm font-medium text-foreground text-right font-mono">
                          {hrAccount.employeeId}
                        </span>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="flex items-start justify-between py-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          <span className="text-sm">Company</span>
                        </div>
                        <span className="text-sm font-medium text-foreground text-right">{hrAccount.company?.name || 'N/A'}</span>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="flex items-start justify-between py-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                          <span className="text-sm">Department</span>
                        </div>
                        <span className="text-sm font-medium text-foreground text-right">{hrAccount.department}</span>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="flex items-start justify-between py-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                          <span className="text-sm">Position</span>
                        </div>
                        <span className="text-sm font-medium text-foreground text-right">{hrAccount.position}</span>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="flex items-start justify-between py-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">Join Date</span>
                        </div>
                        <span className="text-sm font-medium text-foreground text-right">{hrAccount.joinedDate}</span>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="flex items-start justify-between py-3">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span className="text-sm">Reporting To</span>
                        </div>
                        <span className="text-sm font-medium text-foreground text-right">
                          {hrAccount.reportingTo || 'Not assigned'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Login Credentials Card */}
                <Card className="glass-card border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Key className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Login Credentials</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          HR Manager access credentials for the system
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <UserCog className="h-4 w-4" />
                        <span className="text-sm">Employee ID (Username)</span>
                      </div>
                      <div className="bg-muted/50 px-4 py-3 rounded-lg font-mono text-sm font-medium">
                        {hrAccount.employeeId}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Use this Employee ID as username to login to the system
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'employees' && (
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Managed Employees</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-12 text-center">
                  <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Employee Management</h3>
                  <p className="text-muted-foreground">
                    Employees managed by {hrAccount.name} will be displayed here.
                  </p>
                </CardContent>
              </Card>
            )}

            {activeSection === 'tasks' && (
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <ClipboardList className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Assigned Tasks</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-12 text-center">
                  <ClipboardList className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Tasks Module</h3>
                  <p className="text-muted-foreground">
                    Task management and assignments for {hrAccount.name} will be displayed here.
                  </p>
                </CardContent>
              </Card>
            )}

            {activeSection === 'chat' && (
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Chat with {hrAccount.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Chat Module</h3>
                  <p className="text-muted-foreground">
                    Direct messaging interface with {hrAccount.name} will be displayed here.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HRDetail;
