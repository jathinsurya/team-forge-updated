import { useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { useRole } from "@/contexts/RoleContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, ExternalLink, User, ChevronDown, ChevronUp, Award, Info } from "lucide-react";
import { toast } from "sonner";

type AppStatus = "pending" | "approved" | "rejected";

const statusBadge: Record<AppStatus, string> = {
  pending:  "bg-warning/10 text-warning border-warning/30",
  approved: "bg-success/10 text-success border-success/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/30",
};
const statusIcon: Record<AppStatus, React.ElementType> = {
  pending:  Clock,
  approved: CheckCircle2,
  rejected: XCircle,
};

const AdminMentorApplications = () => {
  const { mentorApplications, approveMentorApplication, rejectMentorApplication } = useAdmin();
  const { setMentorApproved } = useRole();
  const [filter, setFilter]   = useState<"all" | AppStatus>("pending");
  const [expanded, setExpanded] = useState<string | null>("app-1");
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: "approve" | "reject" } | null>(null);

  const shown = filter === "all" ? mentorApplications : mentorApplications.filter(a => a.status === filter);
  const counts = {
    all:      mentorApplications.length,
    pending:  mentorApplications.filter(a => a.status === "pending").length,
    approved: mentorApplications.filter(a => a.status === "approved").length,
    rejected: mentorApplications.filter(a => a.status === "rejected").length,
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    const { id, action } = confirmAction;
    const app = mentorApplications.find(a => a.id === id);
    if (action === "approve") {
      approveMentorApplication(id);
      if (id === "app-1") setMentorApproved(true); // unlock in main app
      toast.success(`Approved mentor application for ${app?.userName}`);
    } else {
      rejectMentorApplication(id);
      toast.success(`Rejected application for ${app?.userName}`);
    }
    setConfirmAction(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mentor Applications</h1>
        <p className="text-sm text-muted-foreground mt-1">Review LinkedIn profiles and approve or reject mentor privilege requests.</p>
      </div>

      {/* Criteria */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-card">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5" /> Eligibility Criteria (SRS §13)
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "Min. 4–5 years professional experience",
            "Complete & authentic LinkedIn profile",
            "Consistent relevant career history",
            "Professional conduct — no misconduct record",
          ].map(c => (
            <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground border border-border">
              ✓ {c}
            </span>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 flex-wrap">
        {(["pending", "approved", "rejected", "all"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Confirm modal */}
      {confirmAction && (() => {
        const app = mentorApplications.find(a => a.id === confirmAction.id);
        const isApprove = confirmAction.action === "approve";
        return (
          <div className="fixed inset-0 bg-foreground/20 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full shadow-elevated">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${isApprove ? "bg-success/10" : "bg-destructive/10"}`}>
                {isApprove ? <CheckCircle2 className="h-6 w-6 text-success" /> : <XCircle className="h-6 w-6 text-destructive" />}
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {isApprove ? `Approve ${app?.userName} as Mentor?` : `Reject ${app?.userName}'s Application?`}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {isApprove
                  ? "This grants full mentor privileges — accepting requests, guiding teams, and issuing recommendation badges."
                  : "The applicant will be notified their application did not meet eligibility criteria."}
              </p>
              {isApprove && app?.id === "app-1" && (
                <div className="flex items-center gap-2 text-xs text-accent bg-accent/5 border border-accent/20 rounded-lg px-3 py-2 mb-4">
                  <Award className="h-3.5 w-3.5 shrink-0" />
                  This also unlocks the Mentor role for Arjun Sharma in the main app.
                </div>
              )}
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleConfirm}>
                  {isApprove ? "Approve" : "Reject"}
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setConfirmAction(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Application cards */}
      {shown.length === 0 && (
        <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
          <p className="text-sm">No {filter === "all" ? "" : filter} applications.</p>
        </div>
      )}

      <div className="space-y-3">
        {shown.map(app => {
          const StatusIcon = statusIcon[app.status];
          const isOpen = expanded === app.id;
          const meetsExp = app.experience >= 4;

          return (
            <div key={app.id} className={`bg-card rounded-xl border shadow-card overflow-hidden ${
              app.status === "pending" ? "border-warning/30" : "border-border"
            }`}>
              {/* Row */}
              <div className="flex items-center gap-4 p-5 cursor-pointer hover:bg-secondary/30 transition-colors"
                onClick={() => setExpanded(isOpen ? null : app.id)}>
                <div className="h-11 w-11 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                  {app.userInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{app.userName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{app.university} · Submitted {app.submittedAt}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:block text-xs text-muted-foreground">{app.expertise.split(",")[0]}</span>
                  <Badge variant="outline" className={`text-xs gap-1 ${statusBadge[app.status]}`}>
                    <StatusIcon className="h-3 w-3" />
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </Badge>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </div>

              {/* Expanded */}
              {isOpen && (
                <div className="border-t border-border p-5 space-y-5 bg-secondary/10">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Expertise</p>
                      <p className="text-sm text-foreground">{app.expertise}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Experience</p>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold ${meetsExp ? "text-success" : "text-destructive"}`}>
                          {app.experience} years
                        </p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${meetsExp ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                          {meetsExp ? "✓ Meets criteria" : "✗ Below minimum"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">LinkedIn</p>
                      <a href={app.linkedin} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                        className="text-sm text-info hover:text-info/80 flex items-center gap-1 transition-colors">
                        View Profile <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">University</p>
                      <p className="text-sm text-foreground flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-muted-foreground" /> {app.university}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Motivation</p>
                    <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3 leading-relaxed">
                      "{app.motivation}"
                    </p>
                  </div>

                  {app.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setConfirmAction({ id: app.id, action: "approve" })} className="gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve Application
                      </Button>
                      <Button size="sm" variant="outline"
                        className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5"
                        onClick={() => setConfirmAction({ id: app.id, action: "reject" })}>
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </Button>
                    </div>
                  )}
                  {app.status === "approved" && (
                    <p className="text-sm text-success flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="h-4 w-4" /> Mentor privileges active
                    </p>
                  )}
                  {app.status === "rejected" && (
                    <p className="text-sm text-muted-foreground italic">Application rejected — did not meet eligibility criteria.</p>
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

export default AdminMentorApplications;
