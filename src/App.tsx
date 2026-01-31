import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HRDashboard from "./pages/hr/HRDashboard";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";

// Modules
import ChatModule from "./components/modules/ChatModule";
import AttendanceModule from "./components/modules/AttendanceModule";
import LeaveModule from "./components/modules/LeaveModule";
import TasksModule from "./components/modules/TasksModule";
import ExpensesModule from "./components/modules/ExpensesModule";
import AnnouncementsModule from "./components/modules/AnnouncementsModule";
import CalendarModule from "./components/modules/CalendarModule";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            {/* Admin Routes - Protected */}
            <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/chat" element={<ProtectedRoute allowedRole="admin"><ChatModule role="admin" /></ProtectedRoute>} />
            <Route path="/admin/attendance" element={<ProtectedRoute allowedRole="admin"><AttendanceModule role="admin" /></ProtectedRoute>} />
            <Route path="/admin/leaves" element={<ProtectedRoute allowedRole="admin"><LeaveModule role="admin" /></ProtectedRoute>} />
            <Route path="/admin/tasks" element={<ProtectedRoute allowedRole="admin"><TasksModule role="admin" /></ProtectedRoute>} />
            <Route path="/admin/expenses" element={<ProtectedRoute allowedRole="admin"><ExpensesModule role="admin" /></ProtectedRoute>} />
            <Route path="/admin/announcements" element={<ProtectedRoute allowedRole="admin"><AnnouncementsModule role="admin" /></ProtectedRoute>} />
            <Route path="/admin/*" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />

            {/* HR Routes - Protected */}
            <Route path="/hr" element={<ProtectedRoute allowedRole="hr"><HRDashboard /></ProtectedRoute>} />
            <Route path="/hr/chat" element={<ProtectedRoute allowedRole="hr"><ChatModule role="hr" /></ProtectedRoute>} />
            <Route path="/hr/attendance" element={<ProtectedRoute allowedRole="hr"><AttendanceModule role="hr" /></ProtectedRoute>} />
            <Route path="/hr/leaves" element={<ProtectedRoute allowedRole="hr"><LeaveModule role="hr" /></ProtectedRoute>} />
            <Route path="/hr/tasks" element={<ProtectedRoute allowedRole="hr"><TasksModule role="hr" /></ProtectedRoute>} />
            <Route path="/hr/expenses" element={<ProtectedRoute allowedRole="hr"><ExpensesModule role="hr" /></ProtectedRoute>} />
            <Route path="/hr/announcements" element={<ProtectedRoute allowedRole="hr"><AnnouncementsModule role="hr" /></ProtectedRoute>} />
            <Route path="/hr/*" element={<ProtectedRoute allowedRole="hr"><HRDashboard /></ProtectedRoute>} />

            {/* Employee Routes - Protected */}
            <Route path="/employee" element={<ProtectedRoute allowedRole="employee"><EmployeeDashboard /></ProtectedRoute>} />
            <Route path="/employee/chat" element={<ProtectedRoute allowedRole="employee"><ChatModule role="employee" /></ProtectedRoute>} />
            <Route path="/employee/attendance" element={<ProtectedRoute allowedRole="employee"><AttendanceModule role="employee" /></ProtectedRoute>} />
            <Route path="/employee/calendar" element={<ProtectedRoute allowedRole="employee"><CalendarModule role="employee" /></ProtectedRoute>} />
            <Route path="/employee/leave" element={<ProtectedRoute allowedRole="employee"><LeaveModule role="employee" /></ProtectedRoute>} />
            <Route path="/employee/tasks" element={<ProtectedRoute allowedRole="employee"><TasksModule role="employee" /></ProtectedRoute>} />
            <Route path="/employee/expenses" element={<ProtectedRoute allowedRole="employee"><ExpensesModule role="employee" /></ProtectedRoute>} />
            <Route path="/employee/announcements" element={<ProtectedRoute allowedRole="employee"><AnnouncementsModule role="employee" /></ProtectedRoute>} />
            <Route path="/employee/*" element={<ProtectedRoute allowedRole="employee"><EmployeeDashboard /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
