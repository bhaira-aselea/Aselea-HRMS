import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { UserCog, Plus, Edit, Trash2, Mail, Phone, Building2, Shield } from 'lucide-react';

interface HRAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  department: string;
  status: 'active' | 'inactive';
  employeesManaged: number;
  joinedDate: string;
  avatar?: string;
}

const initialHRAccounts: HRAccount[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@aselea.com',
    phone: '+1 (555) 111-2222',
    company: 'Aselea Technologies',
    department: 'Human Resources',
    status: 'active',
    employeesManaged: 45,
    joinedDate: '2024-03-15',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.c@innovation.com',
    phone: '+1 (555) 333-4444',
    company: 'Innovation Corp',
    department: 'HR Operations',
    status: 'active',
    employeesManaged: 32,
    joinedDate: '2024-07-20',
  },
];

const AdminHRAccounts = () => {
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
  });

  const handleCreate = () => {
    const newHR: HRAccount = {
      id: Date.now().toString(),
      ...formData,
      status: 'active',
      employeesManaged: 0,
      joinedDate: new Date().toISOString(),
    };
    setHRAccounts([...hrAccounts, newHR]);
    setFormData({ name: '', email: '', phone: '', company: '', department: '' });
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
      setFormData({ name: '', email: '', phone: '', company: '', department: '' });
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
            <DialogContent className="bg-background max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New HR Manager</DialogTitle>
                <DialogDescription>Create a new HR manager account</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="hr@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Select
                      value={formData.company}
                      onValueChange={(val) => setFormData({ ...formData, company: val })}
                    >
                      <SelectTrigger>
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
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!formData.name || !formData.email || !formData.company}
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
                  <TableHead>Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Department</TableHead>
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
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        {hr.company}
                      </div>
                    </TableCell>
                    <TableCell>{hr.department}</TableCell>
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
          <DialogContent className="bg-background max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit HR Manager</DialogTitle>
              <DialogDescription>Update HR manager information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="hr@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-company">Company</Label>
                  <Select
                    value={formData.company}
                    onValueChange={(val) => setFormData({ ...formData, company: val })}
                  >
                    <SelectTrigger>
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
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                disabled={!formData.name || !formData.email || !formData.company}
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
