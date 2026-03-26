import { useNavigate, NavLink, Outlet } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Shield, LayoutDashboard, Users, BookOpen, ScrollText, LogOut, Bell, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard",       path: "/admin/dashboard",           icon: LayoutDashboard },
  { label: "User Management", path: "/admin/users",               icon: Users           },
  { label: "Mentor Apps",     path: "/admin/mentor-applications", icon: BookOpen        },
  { label: "Audit Log",       path: "/admin/audit-log",           icon: ScrollText      },
];

export function AdminLayout() {
  const { setAdminLoggedIn, mentorApplications } = useAdmin();
  const navigate = useNavigate();
  const pendingApps = mentorApplications.filter(a => a.status === "pending").length;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-border bg-card flex flex-col">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground tracking-tight">TeamForge</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-3 mb-2">Administration</p>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  isActive ? "bg-secondary text-primary font-semibold" : "text-foreground hover:bg-secondary"
                }`
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.label === "Mentor Apps" && pendingApps > 0 && (
                <span className="h-5 min-w-5 px-1 rounded-full bg-warning/20 text-warning text-[10px] font-bold flex items-center justify-center">
                  {pendingApps}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-border space-y-1">
          <div className="px-3 py-2.5 rounded-md bg-secondary/60">
            <p className="text-xs font-semibold text-foreground">Administrator</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">admin@teamforge.io</p>
          </div>
          <button
            onClick={() => { setAdminLoggedIn(false); navigate("/admin/login"); }}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>TeamForge</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Admin Panel</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-4 w-4" />
              {pendingApps > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />}
            </Button>
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
