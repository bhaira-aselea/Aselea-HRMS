import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import SelectRole from "./pages/SelectRole";
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
            <Route path="/select-role" element={<SelectRole />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/chat" element={<ChatModule role="admin" />} />
            <Route path="/admin/attendance" element={<AttendanceModule role="admin" />} />
            <Route path="/admin/leaves" element={<LeaveModule role="admin" />} />
            <Route path="/admin/tasks" element={<TasksModule role="admin" />} />
            <Route path="/admin/expenses" element={<ExpensesModule role="admin" />} />
            <Route path="/admin/announcements" element={<AnnouncementsModule role="admin" />} />
            <Route path="/admin/*" element={<AdminDashboard />} />

            {/* HR Routes */}
            <Route path="/hr" element={<HRDashboard />} />
            <Route path="/hr/chat" element={<ChatModule role="hr" />} />
            <Route path="/hr/attendance" element={<AttendanceModule role="hr" />} />
            <Route path="/hr/leaves" element={<LeaveModule role="hr" />} />
            <Route path="/hr/tasks" element={<TasksModule role="hr" />} />
            <Route path="/hr/expenses" element={<ExpensesModule role="hr" />} />
            <Route path="/hr/announcements" element={<AnnouncementsModule role="hr" />} />
            <Route path="/hr/*" element={<HRDashboard />} />

            {/* Employee Routes */}
            <Route path="/employee" element={<EmployeeDashboard />} />
            <Route path="/employee/chat" element={<ChatModule role="employee" />} />
            <Route path="/employee/attendance" element={<AttendanceModule role="employee" />} />
            <Route path="/employee/calendar" element={<CalendarModule role="employee" />} />
            <Route path="/employee/leave" element={<LeaveModule role="employee" />} />
            <Route path="/employee/tasks" element={<TasksModule role="employee" />} />
            <Route path="/employee/expenses" element={<ExpensesModule role="employee" />} />
            <Route path="/employee/announcements" element={<AnnouncementsModule role="employee" />} />
            <Route path="/employee/*" element={<EmployeeDashboard />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
