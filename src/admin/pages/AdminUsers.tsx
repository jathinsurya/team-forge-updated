import { useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, AlertTriangle, Ban, RotateCcw, Flag, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

const statusBadge: Record<string, string> = {
  active:    "bg-success/10 text-success border-success/30",
  warned:    "bg-warning/10 text-warning border-warning/30",
  suspended: "bg-destructive/10 text-destructive border-destructive/30",
};

const AdminUsers = () => {
  const { users, warnUser, suspendUser, reinstateUser } = useAdmin();
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState<"all" | "active" | "warned" | "suspended" | "flagged">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ userId: string; action: "warn" | "suspend" | "reinstate" } | null>(null);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.university.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" ? true : filter === "flagged" ? u.flagged : u.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all:       users.length,
    active:    users.filter(u => u.status === "active").length,
    warned:    users.filter(u => u.status === "warned").length,
    suspended: users.filter(u => u.status === "suspended").length,
    flagged:   users.filter(u => u.flagged).length,
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    const { userId, action } = confirmAction;
    const user = users.find(u => u.id === userId);
    if (action === "warn")      { warnUser(userId);      toast.success(`Warning issued to ${user?.name} · −15 reputation`); }
    if (action === "suspend")   { suspendUser(userId);   toast.success(`${user?.name}'s account suspended`); }
    if (action === "reinstate") { reinstateUser(userId); toast.success(`${user?.name}'s account reinstated`); }
    setConfirmAction(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor accounts, issue warnings, and manage suspensions.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or university..." className="pl-9" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "active", "warned", "suspended", "flagged"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}>
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          ))}
        </div>
      </div>

      {/* Confirm modal */}
      {confirmAction && (() => {
        const user = users.find(u => u.id === confirmAction.userId);
        const cfg = {
          warn:      { title: `Issue warning to ${user?.name}?`,  desc: "Deducts 15 reputation and flags the account.", btnLabel: "Issue Warning",   btnClass: "bg-warning text-warning-foreground hover:bg-warning/90" },
          suspend:   { title: `Suspend ${user?.name}?`,           desc: "The user will lose all platform access.",      btnLabel: "Suspend Account", btnClass: "bg-destructive text-destructive-foreground hover:bg-destructive/90" },
          reinstate: { title: `Reinstate ${user?.name}?`,         desc: "Restores full platform access.",               btnLabel: "Reinstate",       btnClass: "bg-success text-success-foreground hover:bg-success/90" },
        }[confirmAction.action];
        return (
          <div className="fixed inset-0 bg-foreground/20 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full shadow-elevated">
              <h3 className="font-semibold text-foreground mb-2">{cfg.title}</h3>
              <p className="text-sm text-muted-foreground mb-5">{cfg.desc}</p>
              <div className="flex gap-2">
                <Button className={`flex-1 ${cfg.btnClass}`} onClick={handleConfirm}>{cfg.btnLabel}</Button>
                <Button variant="outline" className="flex-1" onClick={() => setConfirmAction(null)}>Cancel</Button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* User list */}
      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
          <p className="text-sm">No users match this filter.</p>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map(user => {
          const isExpanded = expanded === user.id;
          return (
            <div key={user.id} className={`bg-card rounded-xl border shadow-card overflow-hidden ${
              user.flagged ? "border-warning/40" : "border-border"
            }`}>
              <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                onClick={() => setExpanded(isExpanded ? null : user.id)}>
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                  {user.initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{user.name}</p>
                    {user.flagged && <Flag className="h-3 w-3 text-warning" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{user.university} · {user.role}</p>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-5 text-xs text-muted-foreground">
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{user.xp.toLocaleString()}</p>
                    <p>XP</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{user.reputation}</p>
                    <p>Rep</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{user.projects}</p>
                    <p>Projects</p>
                  </div>
                </div>

                {/* Status */}
                <Badge variant="outline" className={`text-xs ${statusBadge[user.status]}`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Badge>

                {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
              </div>

              {/* Expanded actions */}
              {isExpanded && (
                <div className="border-t border-border px-4 py-4 bg-secondary/20">
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>Joined: <span className="text-foreground">{user.joinedAt}</span></p>
                      <p>ID: <span className="text-foreground font-mono">{user.id}</span></p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {user.status !== "suspended" && (
                        <Button size="sm" variant="outline"
                          className="gap-1.5 text-warning border-warning/30 hover:bg-warning/5"
                          onClick={() => setConfirmAction({ userId: user.id, action: "warn" })}>
                          <AlertTriangle className="h-3.5 w-3.5" /> Issue Warning
                        </Button>
                      )}
                      {(user.status === "active" || user.status === "warned") ? (
                        <Button size="sm" variant="outline"
                          className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5"
                          onClick={() => setConfirmAction({ userId: user.id, action: "suspend" })}>
                          <Ban className="h-3.5 w-3.5" /> Suspend
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline"
                          className="gap-1.5 text-success border-success/30 hover:bg-success/5"
                          onClick={() => setConfirmAction({ userId: user.id, action: "reinstate" })}>
                          <RotateCcw className="h-3.5 w-3.5" /> Reinstate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminUsers;
