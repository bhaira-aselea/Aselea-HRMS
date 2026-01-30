import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Receipt,
  Plus,
  Calendar,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  FileText,
} from 'lucide-react';

interface Expense {
  id: string;
  employeeName: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  receipt: boolean;
}

const expenses: Expense[] = [
  { id: '1', employeeName: 'John Doe', category: 'Travel', amount: 450, description: 'Client meeting travel expenses', date: 'Jan 28, 2026', status: 'pending', receipt: true },
  { id: '2', employeeName: 'Jane Smith', category: 'Meals', amount: 85, description: 'Team lunch meeting', date: 'Jan 27, 2026', status: 'approved', receipt: true },
  { id: '3', employeeName: 'Mike Johnson', category: 'Supplies', amount: 120, description: 'Office supplies purchase', date: 'Jan 25, 2026', status: 'pending', receipt: true },
  { id: '4', employeeName: 'Sarah Wilson', category: 'Training', amount: 299, description: 'Online course subscription', date: 'Jan 24, 2026', status: 'rejected', receipt: false },
  { id: '5', employeeName: 'Tom Brown', category: 'Equipment', amount: 650, description: 'Ergonomic keyboard and mouse', date: 'Jan 23, 2026', status: 'approved', receipt: true },
];

interface ExpensesModuleProps {
  role: 'admin' | 'hr' | 'employee';
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return <Badge className="status-approved">Approved</Badge>;
    case 'pending':
      return <Badge className="status-pending">Pending</Badge>;
    case 'rejected':
      return <Badge className="status-rejected">Rejected</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const ExpensesModule = ({ role }: ExpensesModuleProps) => {
  const [filter, setFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredExpenses = expenses.filter(expense => {
    if (filter === 'all') return true;
    return expense.status === filter;
  });

  const stats = {
    pending: expenses.filter(e => e.status === 'pending').length,
    approved: expenses.filter(e => e.status === 'approved').length,
    rejected: expenses.filter(e => e.status === 'rejected').length,
    total: expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0),
  };

  const canApprove = role === 'hr';
  const canSubmit = role === 'employee' || role === 'hr';

  return (
    <DashboardLayout>
      <div className="space-y-6 fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-card card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.approved}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.rejected}</p>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">${stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expenses List */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-primary" />
                  Expense Claims
                </CardTitle>
                <CardDescription>
                  {canApprove ? 'Review and approve expense claims' : 'Your expense claim history'}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[130px] bg-secondary border-border">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                {canSubmit && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="glow-button">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Expense
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card">
                      <DialogHeader>
                        <DialogTitle>Submit Expense</DialogTitle>
                        <DialogDescription>Submit a new expense claim for approval</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select>
                            <SelectTrigger className="bg-secondary border-border">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="travel">Travel</SelectItem>
                              <SelectItem value="meals">Meals</SelectItem>
                              <SelectItem value="supplies">Supplies</SelectItem>
                              <SelectItem value="equipment">Equipment</SelectItem>
                              <SelectItem value="training">Training</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Amount ($)</Label>
                            <Input type="number" placeholder="0.00" className="bg-secondary border-border" />
                          </div>
                          <div className="space-y-2">
                            <Label>Date</Label>
                            <Input type="date" className="bg-secondary border-border" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea placeholder="Enter expense description" className="bg-secondary border-border" />
                        </div>
                        <div className="space-y-2">
                          <Label>Receipt</Label>
                          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, PDF up to 10MB</p>
                          </div>
                        </div>
                        <Button className="w-full glow-button" onClick={() => setIsDialogOpen(false)}>
                          Submit Expense
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
              {filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {expense.employeeName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">${expense.amount}</p>
                          <Badge variant="outline" className="text-xs">{expense.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{expense.description}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>{expense.employeeName}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {expense.date}
                          </span>
                          {expense.receipt && (
                            <span className="flex items-center gap-1 text-success">
                              <FileText className="h-3 w-3" />
                              Receipt
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(expense.status)}
                      {canApprove && expense.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="text-success hover:text-success hover:bg-success/10">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
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

export default ExpensesModule;
