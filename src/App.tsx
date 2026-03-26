import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Contexts
import { RoleProvider } from "@/contexts/RoleContext";
import { AdminProvider } from "@/contexts/AdminContext";

// Main app layout + pages
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Leaderboard from "@/pages/Leaderboard";
import Notifications from "@/pages/Notifications";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";
import Projects from "@/pages/Projects";
import ProjectDetails from "@/pages/ProjectDetails";
import AppliedProjects from "@/pages/AppliedProjects";
import MyWork from "@/pages/MyWork";
import ProjectWorkspace from "@/pages/ProjectWorkspace";
import CreateProject from "@/pages/CreateProject";
import MyProjects from "@/pages/MyProjects";
import Mentors from "@/pages/Mentors";
import MentorApplication from "@/pages/MentorApplication";
import MentorRequests from "@/pages/MentorRequests";
import MentoredProjects from "@/pages/MentoredProjects";
import NotFound from "@/pages/NotFound";

// Admin
import AdminLogin from "@/admin/pages/AdminLogin";
import AdminDashboard from "@/admin/pages/AdminDashboard";
import AdminUsers from "@/admin/pages/AdminUsers";
import AdminMentorApplications from "@/admin/pages/AdminMentorApplications";
import AdminAuditLog from "@/admin/pages/AdminAuditLog";
import { AdminLayout } from "@/admin/components/AdminLayout";
import { AdminAuthGuard } from "@/admin/components/AdminAuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/*
          AdminProvider wraps everything so admin state (including mentor approval)
          is accessible across both main app and admin panel.
          RoleProvider is nested inside so AdminMentorApplications can call setMentorApproved.
        */}
        <AdminProvider>
          <RoleProvider>
            <Routes>
              {/* ── Main app ─────────────────────────────────── */}
              <Route element={<AppLayout />}>
                <Route path="/"                    element={<Dashboard />} />
                <Route path="/leaderboard"         element={<Leaderboard />} />
                <Route path="/notifications"       element={<Notifications />} />
                <Route path="/profile"             element={<Profile />} />
                <Route path="/settings"            element={<Settings />} />
                <Route path="/help"                element={<Help />} />
                <Route path="/projects"            element={<Projects />} />
                <Route path="/projects/:id"        element={<ProjectDetails />} />
                <Route path="/applied-projects"    element={<AppliedProjects />} />
                <Route path="/my-work"             element={<MyWork />} />
                <Route path="/workspace/:id"       element={<ProjectWorkspace />} />
                <Route path="/create-project"      element={<CreateProject />} />
                <Route path="/my-projects"         element={<MyProjects />} />
                <Route path="/mentors"             element={<Mentors />} />
                <Route path="/mentor-application"  element={<MentorApplication />} />
                <Route path="/mentor-requests"     element={<MentorRequests />} />
                <Route path="/mentored-projects"   element={<MentoredProjects />} />
              </Route>

              {/* ── Admin panel ──────────────────────────────── */}
              <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<AdminAuthGuard />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard"           element={<AdminDashboard />} />
                  <Route path="/admin/users"               element={<AdminUsers />} />
                  <Route path="/admin/mentor-applications" element={<AdminMentorApplications />} />
                  <Route path="/admin/audit-log"           element={<AdminAuditLog />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </RoleProvider>
        </AdminProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
