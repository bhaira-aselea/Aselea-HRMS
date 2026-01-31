import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserCog, Plus, Edit, Trash2, Mail, Phone, Building2, Shield, Eye, Upload } from 'lucide-react';

interface HRAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  department: string;
  position: string;
  status: 'active' | 'inactive';
  employeesManaged: number;
  joinedDate: string;
  avatar?: string;
  password: string;
  dateOfBirth: string;
  address: string;
  hrId: string;
  reportingTo?: string;
}

const initialHRAccounts: HRAccount[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@aselea.com',
    phone: '+1 (555) 111-2222',
    company: 'Aselea Technologies',
    department: 'Human Resources',
    position: 'HR Manager',
    status: 'active',
    employeesManaged: 45,
    joinedDate: '2024-03-15',
    password: 'hr123',
    dateOfBirth: '1985-03-15',
    address: '123 HR Street, City, State 12345',
    hrId: 'HR-001',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.c@innovation.com',
    phone: '+1 (555) 333-4444',
    company: 'Innovation Corp',
    department: 'HR Operations',
    position: 'Senior HR Manager',
    status: 'active',
    employeesManaged: 32,
    joinedDate: '2024-07-20',
    password: 'michael456',
    dateOfBirth: '1987-07-20',
    address: '456 HR Avenue, City, State 23456',
    hrId: 'HR-002',
  },
];

const AdminHRAccounts = () => {
  const navigate = useNavigate();
  const [hrAccounts, setHRAccounts] = useState<HRAccount[]>(initialHRAccounts);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedHR, setSelectedHR] = useState<HRAccount | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    department: '',
    position: '',
    hrId: '',
    password: '',
    dateOfBirth: '',
    address: '',
    joinedDate: '',
    reportingTo: '',
  });

  const handleCreate = () => {
    const newHR: HRAccount = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      department: formData.department,
      position: formData.position,
      hrId: formData.hrId,
      password: formData.password,
      dateOfBirth: formData.dateOfBirth,
      address: formData.address,
      reportingTo: formData.reportingTo,
      status: 'active',
      employeesManaged: 0,
      joinedDate: formData.joinedDate || new Date().toISOString().split('T')[0],
    };
    setHRAccounts([...hrAccounts, newHR]);
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      company: '', 
      department: '', 
      position: '', 
      hrId: '', 
      password: '', 
      dateOfBirth: '', 
      address: '', 
      joinedDate: '', 
      reportingTo: '' 
    });
    setIsCreateDialogOpen(false);
  };

  const handleEdit = () => {
    if (selectedHR) {
      setHRAccounts(
        hrAccounts.map((hr) =>
          hr.id === selectedHR.id ? { ...selectedHR, ...formData } : hr
        )
      );
      setIsEditDialogOpen(false);
      setSelectedHR(null);
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        company: '', 
        department: '', 
        position: '', 
        hrId: '', 
        password: '', 
        dateOfBirth: '', 
        address: '', 
        joinedDate: '', 
        reportingTo: '' 
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this HR account?')) {
      setHRAccounts(hrAccounts.filter((hr) => hr.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setHRAccounts(
      hrAccounts.map((hr) =>
        hr.id === id
          ? { ...hr, status: hr.status === 'active' ? 'inactive' : 'active' }
          : hr
      )
    );
  };

  const openEditDialog = (hr: HRAccount) => {
    setSelectedHR(hr);
    setFormData({
      name: hr.name,
      email: hr.email,
      phone: hr.phone,
      company: hr.company,
      department: hr.department,
      position: hr.position,
      hrId: hr.hrId,
      password: hr.password,
      dateOfBirth: hr.dateOfBirth,
      address: hr.address,
      joinedDate: hr.joinedDate,
      reportingTo: hr.reportingTo || '',
    });
    setIsEditDialogOpen(true);
  };

  const stats = {
    total: hrAccounts.length,
    active: hrAccounts.filter((hr) => hr.status === 'active').length,
    inactive: hrAccounts.filter((hr) => hr.status === 'inactive').length,
    totalManaged: hrAccounts.reduce((sum, hr) => sum + hr.employeesManaged, 0),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">HR Accounts</h1>
            <p className="text-muted-foreground">Manage HR manager accounts</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="glow-button">
                <Plus className="h-4 w-4 mr-2" />
                Add HR Manager
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New HR Manager</DialogTitle>
                <DialogDescription>Create a new HR manager account with complete details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Profile Photo Upload */}
                <div className="space-y-2">
                  <Label>Profile Photo</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 border-2 border-border">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        <UserCog className="h-10 w-10" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer bg-secondary/30">
                        <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload photo</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Name and HR ID (Username) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Sarah Johnson"
                      className="bg-secondary border-border"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hrId">HR ID (Username) <span className="text-xs text-muted-foreground">- Used for login</span></Label>
                    <Input
                      id="hrId"
                      placeholder="HR-XXX or sarah.johnson"
                      className="bg-secondary border-border"
                      value={formData.hrId}
                      onChange={(e) => setFormData({ ...formData, hrId: e.target.value })}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password <span className="text-xs text-muted-foreground">- Initial login password</span></Label>
                  <Input
                    id="password"
                    type="text"
                    placeholder="Create password for HR manager"
                    className="bg-secondary border-border"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="hr@example.com"
                      className="bg-secondary border-border"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      className="bg-secondary border-border"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    className="bg-secondary border-border"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Full address"
                    className="bg-secondary border-border min-h-[80px]"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                {/* Company and Department */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Select
                      value={formData.company}
                      onValueChange={(val) => setFormData({ ...formData, company: val })}
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aselea Technologies">Aselea Technologies</SelectItem>
                        <SelectItem value="Innovation Corp">Innovation Corp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      placeholder="e.g., Human Resources"
                      className="bg-secondary border-border"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                  </div>
                </div>

                {/* Position and Join Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      placeholder="HR Manager"
                      className="bg-secondary border-border"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joinedDate">Join Date</Label>
                    <Input
                      id="joinedDate"
                      type="date"
                      className="bg-secondary border-border"
                      value={formData.joinedDate}
                      onChange={(e) => setFormData({ ...formData, joinedDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Reporting To */}
                <div className="space-y-2">
                  <Label htmlFor="reportingTo">Reporting To (Optional)</Label>
                  <Input
                    id="reportingTo"
                    placeholder="e.g., Senior HR Manager"
                    className="bg-secondary border-border"
                    value={formData.reportingTo}
                    onChange={(e) => setFormData({ ...formData, reportingTo: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="glow-button"
                  onClick={handleCreate}
                  disabled={!formData.name || !formData.email || !formData.company || !formData.hrId || !formData.password}
                >
                  Create Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <UserCog className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total HR Managers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.inactive}</p>
                  <p className="text-xs text-muted-foreground">Inactive</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <UserCog className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalManaged}</p>
                  <p className="text-xs text-muted-foreground">Employees Managed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* HR Accounts Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>All HR Managers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>HR Manager</TableHead>
                  <TableHead>Login Credentials</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hrAccounts.map((hr) => (
                  <TableRow key={hr.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={hr.avatar} />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {hr.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{hr.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Since {new Date(hr.joinedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <UserCog className="h-3 w-3 text-muted-foreground" />
                          <span className="font-mono text-xs text-foreground">{hr.hrId}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-xs text-muted-foreground">Password:</span>
                          <span className="font-mono text-xs text-primary">{hr.password}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {hr.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {hr.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          <span className="text-sm">{hr.company}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{hr.department}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{hr.position}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{hr.employeesManaged} employees</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={hr.status === 'active' ? 'status-approved' : 'bg-muted cursor-pointer'}
                        onClick={() => toggleStatus(hr.id)}
                      >
                        {hr.status.charAt(0).toUpperCase() + hr.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/hr-accounts/${hr.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(hr)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(hr.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="glass-card max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit HR Manager</DialogTitle>
              <DialogDescription>Update HR manager information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Profile Photo Upload */}
              <div className="space-y-2">
                <Label>Profile Photo</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 border-2 border-border">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      <UserCog className="h-10 w-10" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer bg-secondary/30">
                      <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload photo</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Name and HR ID */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    placeholder="Sarah Johnson"
                    className="bg-secondary border-border"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-hrId">HR ID (Username)</Label>
                  <Input
                    id="edit-hrId"
                    placeholder="HR-XXX"
                    className="bg-secondary border-border"
                    value={formData.hrId}
                    onChange={(e) => setFormData({ ...formData, hrId: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="edit-password">Password</Label>
                <Input
                  id="edit-password"
                  type="text"
                  placeholder="Update password"
                  className="bg-secondary border-border"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="hr@example.com"
                    className="bg-secondary border-border"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    placeholder="+1 (555) 123-4567"
                    className="bg-secondary border-border"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="edit-dateOfBirth">Date of Birth</Label>
                <Input
                  id="edit-dateOfBirth"
                  type="date"
                  className="bg-secondary border-border"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Textarea
                  id="edit-address"
                  placeholder="Full address"
                  className="bg-secondary border-border min-h-[80px]"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              {/* Company and Department */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-company">Company</Label>
                  <Select
                    value={formData.company}
                    onValueChange={(val) => setFormData({ ...formData, company: val })}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aselea Technologies">Aselea Technologies</SelectItem>
                      <SelectItem value="Innovation Corp">Innovation Corp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Input
                    id="edit-department"
                    placeholder="e.g., Human Resources"
                    className="bg-secondary border-border"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
              </div>

              {/* Position and Join Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-position">Position</Label>
                  <Input
                    id="edit-position"
                    placeholder="HR Manager"
                    className="bg-secondary border-border"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-joinedDate">Join Date</Label>
                  <Input
                    id="edit-joinedDate"
                    type="date"
                    className="bg-secondary border-border"
                    value={formData.joinedDate}
                    onChange={(e) => setFormData({ ...formData, joinedDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Reporting To */}
              <div className="space-y-2">
                <Label htmlFor="edit-reportingTo">Reporting To (Optional)</Label>
                <Input
                  id="edit-reportingTo"
                  placeholder="e.g., Senior HR Manager"
                  className="bg-secondary border-border"
                  value={formData.reportingTo}
                  onChange={(e) => setFormData({ ...formData, reportingTo: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="glow-button"
                onClick={handleEdit}
                disabled={!formData.name || !formData.email || !formData.company || !formData.hrId || !formData.password}
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminHRAccounts;
