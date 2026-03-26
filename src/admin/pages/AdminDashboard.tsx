import { useAdmin } from "@/contexts/AdminContext";
import { useNavigate } from "react-router-dom";
import { Users, BookOpen, ScrollText, AlertTriangle, TrendingUp, ShieldAlert, Clock, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const auditTypeBadge: Record<string, string> = {
  task:       "bg-info/10 text-info",
  xp:         "bg-success/10 text-success",
  reputation: "bg-warning/10 text-warning",
  warning:    "bg-warning/10 text-warning",
  suspension: "bg-destructive/10 text-destructive",
  mentor:     "bg-accent/10 text-accent",
  system:     "bg-secondary text-muted-foreground",
};

const AdminDashboard = () => {
  const { users, mentorApplications, auditLog } = useAdmin();
  const navigate = useNavigate();

  const activeUsers    = users.filter(u => u.status === "active").length;
  const suspendedUsers = users.filter(u => u.status === "suspended").length;
  const warnedUsers    = users.filter(u => u.status === "warned").length;
  const pendingApps    = mentorApplications.filter(a => a.status === "pending").length;
  const flaggedUsers   = users.filter(u => u.flagged).length;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Platform Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time snapshot of TeamForge activity.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users"         value={users.length}   icon={Users}          color="info"    trend={`${activeUsers} active`} />
        <StatCard label="Pending Mentor Apps" value={pendingApps}    icon={BookOpen}       color="accent"  trend="Awaiting review" />
        <StatCard label="Flagged / Warned"    value={flaggedUsers}   icon={AlertTriangle}  color="warning" trend={`${suspendedUsers} suspended`} />
        <StatCard label="Audit Events"        value={auditLog.length} icon={ScrollText}    color="primary" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Review Mentor Applications", count: pendingApps,     sub: "pending",    path: "/admin/mentor-applications", icon: BookOpen    },
          { label: "Manage Flagged Users",       count: flaggedUsers,    sub: "flagged",    path: "/admin/users",               icon: ShieldAlert },
          { label: "View Full Audit Log",        count: auditLog.length, sub: "entries",    path: "/admin/audit-log",           icon: ScrollText  },
        ].map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="text-left p-5 bg-card border border-border rounded-xl shadow-card hover:shadow-card-hover transition-shadow group"
          >
            <div className="flex items-center justify-between mb-3">
              <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-2xl font-bold text-foreground">{item.count}</span>
            </div>
            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{item.count} {item.sub}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User health */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> User Health
          </h2>
          <div className="space-y-4">
            {[
              { label: "Active",    value: activeUsers,    total: users.length, color: "bg-success"     },
              { label: "Warned",    value: warnedUsers,    total: users.length, color: "bg-warning"     },
              { label: "Suspended", value: suspendedUsers, total: users.length, color: "bg-destructive" },
            ].map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-semibold text-foreground">{item.value} / {item.total}</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${(item.value / item.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent audit */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-primary" /> Recent Events
          </h2>
          <div className="space-y-3">
            {auditLog.slice(0, 5).map(entry => (
              <div key={entry.id} className="flex items-start gap-3">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${auditTypeBadge[entry.type] || auditTypeBadge.system}`}>
                  {entry.type.toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{entry.event} · {entry.target}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{entry.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="mt-3 w-full text-muted-foreground"
            onClick={() => navigate("/admin/audit-log")}>
            View full audit log →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
