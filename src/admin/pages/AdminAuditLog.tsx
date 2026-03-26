import { useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Input } from "@/components/ui/input";
import { Search, Lock } from "lucide-react";

const typeStyle: Record<string, string> = {
  task:       "bg-info/10 text-info",
  xp:         "bg-success/10 text-success",
  reputation: "bg-warning/10 text-warning",
  warning:    "bg-warning/10 text-warning",
  suspension: "bg-destructive/10 text-destructive",
  mentor:     "bg-accent/10 text-accent",
  system:     "bg-secondary text-muted-foreground",
};

const typeLabel: Record<string, string> = {
  task: "TASK", xp: "XP", reputation: "REP", warning: "WARN",
  suspension: "SUSPEND", mentor: "MENTOR", system: "SYSTEM",
};

const AdminAuditLog = () => {
  const { auditLog } = useAdmin();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const types = ["all", "task", "xp", "reputation", "warning", "suspension", "mentor", "system"];

  const filtered = auditLog.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || [e.event, e.actor, e.target, e.details].some(f => f.toLowerCase().includes(q));
    const matchType = typeFilter === "all" || e.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Log</h1>
          <p className="text-sm text-muted-foreground mt-1">Immutable record of all significant platform events.</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs text-muted-foreground">
          <Lock className="h-3 w-3" /> Read-only · Cannot be modified
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search events, actors, targets..." className="pl-9" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {types.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                typeFilter === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} event{filtered.length !== 1 ? "s" : ""} shown</p>

      {/* Log */}
      <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No events match this filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {/* Header */}
            <div className="grid grid-cols-[100px_1fr_1fr_1fr_2fr] gap-4 px-5 py-3 bg-secondary/40">
              {["Type", "Event", "Actor", "Target", "Details"].map(h => (
                <p key={h} className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{h}</p>
              ))}
            </div>
            {filtered.map(entry => (
              <div key={entry.id} className="grid grid-cols-[100px_1fr_1fr_1fr_2fr] gap-4 px-5 py-3.5 hover:bg-secondary/20 transition-colors items-start">
                <div className="pt-0.5">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${typeStyle[entry.type] || typeStyle.system}`}>
                    {typeLabel[entry.type] || "SYS"}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{entry.event}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{entry.timestamp}</p>
                </div>
                <p className="text-xs text-muted-foreground pt-0.5">{entry.actor}</p>
                <p className="text-xs text-muted-foreground pt-0.5">{entry.target}</p>
                <p className="text-xs text-muted-foreground pt-0.5 leading-relaxed">{entry.details}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditLog;
