import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/contexts/RoleContext";
import { CheckCircle2, XCircle, Clock, Users, Calendar, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

type ReqStatus = "pending" | "accepted" | "rejected";

interface RequestItem {
  id: string;
  project: string;
  owner: string;
  ownerInitials: string;
  description: string;
  skills: string[];
  members: string[];
  deadline: string;
  status: ReqStatus;
}

const initialStatic: RequestItem[] = [
  {
    id: "1", project: "AI Study Planner", owner: "Arjun Sharma", ownerInitials: "AS",
    description: "An intelligent study scheduling app using ML to adapt to student learning patterns. The team needs guidance on model selection, API architecture, and scalable backend design.",
    skills: ["React", "Python", "Machine Learning"],
    members: ["Arjun Sharma", "Rohan Mehta", "Sneha Iyer"],
    deadline: "Mar 30, 2026", status: "pending",
  },
  {
    id: "2", project: "Code Review Hub", owner: "Vikram Nair", ownerInitials: "VN",
    description: "Peer code review platform with scoring and structured feedback. Looking for guidance on code quality metrics, Git API integration, and reviewer matching algorithms.",
    skills: ["React", "Git API", "Node.js"],
    members: ["Vikram Nair", "Ananya Reddy"],
    deadline: "Apr 10, 2026", status: "pending",
  },
  {
    id: "3", project: "EcoTracker", owner: "Ananya Reddy", ownerInitials: "AR",
    description: "Gamified carbon footprint tracker with third-party API integration and data visualisation. Team needs help with chart performance and data modelling best practices.",
    skills: ["React", "API Integration", "Data Viz"],
    members: ["Ananya Reddy", "Kiran Bose", "Meera Pillai"],
    deadline: "Apr 5, 2026", status: "accepted",
  },
];

const statusConfig: Record<ReqStatus, { label: string; style: string; icon: React.ElementType }> = {
  pending:  { label: "Pending",  style: "text-warning border-warning/40",              icon: Clock         },
  accepted: { label: "Accepted", style: "text-success border-success/40 bg-success/5", icon: CheckCircle2  },
  rejected: { label: "Declined", style: "text-destructive border-destructive/30",       icon: XCircle       },
};

const MentorRequests = () => {
  const { mentorRequests, updateMentorRequestStatus } = useRole();
  const [requests, setRequests] = useState(initialStatic);
  const [filter, setFilter] = useState<"all" | ReqStatus>("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ "1": true });

  const handleAction = (id: string, status: "accepted" | "rejected") => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    const r = requests.find(r => r.id === id);
    toast.success(status === "accepted"
      ? `✅ Accepted mentorship for "${r?.project}"`
      : `Declined mentorship for "${r?.project}"`
    );
  };

  // Dynamic requests sent via the Mentors page (owner → mentor flow)
  const dynamicItems: RequestItem[] = mentorRequests.map(r => ({
    id: `dyn-${r.projectId}`, project: r.projectName, owner: "Project Owner", ownerInitials: "PO",
    description: `You've been requested to mentor "${r.projectName}".`,
    skills: [r.expertise], members: [], deadline: "TBD", status: r.status,
  }));

  const all = [...requests, ...dynamicItems];
  const shown = filter === "all" ? all : all.filter(r => r.status === filter);
  const counts = { all: all.length, pending: all.filter(r => r.status === "pending").length, accepted: all.filter(r => r.status === "accepted").length, rejected: all.filter(r => r.status === "rejected").length };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mentor Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">Project teams are requesting your guidance and expertise.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "pending", "accepted", "rejected"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 && (
        <div className="text-center py-16 bg-card rounded-xl border border-border text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No {filter === "all" ? "" : filter} requests.</p>
        </div>
      )}

      <div className="space-y-3">
        {shown.map(r => {
          const cfg = statusConfig[r.status];
          const Icon = cfg.icon;
          const isOpen = !!expanded[r.id];

          return (
            <div key={r.id} className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
              {/* Card header — always visible */}
              <div
                className="p-5 cursor-pointer hover:bg-secondary/20 transition-colors"
                onClick={() => setExpanded(p => ({ ...p, [r.id]: !p[r.id] }))}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                      {r.ownerInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{r.project}</p>
                      <p className="text-xs text-muted-foreground">Requested by {r.owner}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Skill pills preview */}
                    <div className="hidden sm:flex gap-1">
                      {r.skills.slice(0, 2).map(s => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{s}</span>
                      ))}
                      {r.skills.length > 2 && <span className="text-xs text-muted-foreground">+{r.skills.length - 2}</span>}
                    </div>
                    <Badge variant="outline" className={`text-xs gap-1 ${cfg.style}`}>
                      <Icon className="h-3 w-3" /> {cfg.label}
                    </Badge>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {isOpen && (
                <div className="border-t border-border px-5 pb-5 pt-4 space-y-4">
                  <p className="text-sm text-muted-foreground">{r.description}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {r.skills.map(s => (
                      <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">{s}</span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {r.members.length > 0 && (
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {r.members.length} member{r.members.length !== 1 ? "s" : ""}:&nbsp;
                        <span className="text-foreground">{r.members.slice(0, 3).join(", ")}{r.members.length > 3 ? ` +${r.members.length - 3}` : ""}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Deadline: <span className="text-foreground">{r.deadline}</span>
                    </span>
                  </div>

                  {r.status === "pending" && (
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" onClick={() => handleAction(r.id, "accepted")}>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Accept Mentorship
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleAction(r.id, "rejected")}>
                        <XCircle className="h-3.5 w-3.5 mr-1" /> Decline
                      </Button>
                    </div>
                  )}

                  {r.status === "accepted" && (
                    <p className="text-sm text-success font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> You are actively mentoring this project.
                    </p>
                  )}
                  {r.status === "rejected" && (
                    <p className="text-sm text-muted-foreground italic">You declined this request.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MentorRequests;
