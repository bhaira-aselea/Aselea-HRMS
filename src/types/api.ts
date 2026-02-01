// API Response Types

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr' | 'employee';
  company?: Company | string;
  department?: string;
  position?: string;
  phone?: string;
  avatar?: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface Company {
  _id: string;
  name: string;
  industry?: string;
  address?: string;
  phone?: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Leave {
  _id: string;
  employee: User | string;
  company: Company | string;
  leaveType: 'sick' | 'casual' | 'annual' | 'unpaid';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  assignedTo: User | string;
  assignedBy: User | string;
  company: Company | string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  progress?: number;
  createdAt?: string;
}

export interface Expense {
  _id: string;
  employee: User | string;
  company: Company | string;
  amount: number;
  category: string;
  description: string;
  date: string;
  receipt?: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  createdAt?: string;
}

export interface Attendance {
  _id: string;
  employee: User | string;
  company: Company | string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'on-leave';
  workHours?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface Message {
  _id: string;
  sender: User | string;
  receiver: User | string;
  company: Company | string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'holiday';
  author: User | string;
  company?: Company | string;
  createdAt: string;
}
