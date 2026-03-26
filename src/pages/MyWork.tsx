import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { CURRENT_USER } from "@/contexts/RoleContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusTag } from "@/components/shared/StatusTag";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Play, Send, ChevronDown, ChevronUp, Archive, FolderOpen, CheckCircle2, Zap, Star, Trophy, Lock, Clock, Users, BarChart2 } from "lucide-react";
import { toast } from "sonner";

type TaskStatus = "open" | "in-progress" | "in-review" | "revision" | "approved";

interface Task {
  id: string; name: string; assigned: string;
  difficulty: "Easy" | "Medium" | "Hard"; deadline: string; status: TaskStatus;
}

interface Project {
  id: string; name: string; owner: string; progress: number;
  isOwner: boolean;
  isCompleted: boolean;
  completedAt?: string;
  xpEarned?: number;
  repGained?: number;
  myContribution?: string;
  myTasksDone?: number;
  myTasksTotal?: number;
  tasks: Task[];
  members: { name: string; initials: string; role: string }[];
}

const allProjects: Project[] = [
  {
    id: "2", name: "Campus Events App", owner: "Vikram Nair", progress: 60, isOwner: false,
    isCompleted: false,
    members: [
      { name: "Vikram Nair",  initials: "VN", role: "Owner"        },
      { name: "Arjun Sharma", initials: "AS", role: "Collaborator" },
      { name: "Priya Patel",  initials: "PP", role: "Collaborator" },
      { name: "Ananya Reddy", initials: "AR", role: "Collaborator" },
    ],
    tasks: [
      { id: "t6", name: "Build event listing page",  assigned: "Arjun Sharma", difficulty: "Medium", deadline: "Mar 12", status: "in-review"   },
      { id: "t7", name: "RSVP functionality",        assigned: "Priya Patel",  difficulty: "Hard",   deadline: "Mar 20", status: "open"        },
      { id: "t8", name: "Push notification service", assigned: "Ananya Reddy", difficulty: "Hard",   deadline: "Mar 25", status: "in-progress" },
      { id: "t9", name: "Map integration",           assigned: "Unassigned",   difficulty: "Medium", deadline: "Mar 28", status: "open"        },
    ],
  },
  {
    id: "3", name: "EcoTracker", owner: "Ananya Reddy", progress: 100, isOwner: false,
    isCompleted: true,
    completedAt: "Feb 2026",
    xpEarned: 120,
    repGained: 8,
    myContribution: "Integrated carbon footprint API with full error boundary handling",
    myTasksDone: 3,
    myTasksTotal: 3,
    members: [
      { name: "Ananya Reddy", initials: "AR", role: "Owner"        },
      { name: "Arjun Sharma", initials: "AS", role: "Collaborator" },
      { name: "Kiran Bose",   initials: "KB", role: "Collaborator" },
    ],
    tasks: [
      { id: "t10", name: "Carbon footprint tracker", assigned: "Arjun Sharma", difficulty: "Hard",   deadline: "Mar 8",  status: "approved" },
      { id: "t11", name: "Gamification module",      assigned: "Kiran Bose",   difficulty: "Medium", deadline: "Mar 18", status: "approved" },
      { id: "t12", name: "Final integration tests",  assigned: "Arjun Sharma", difficulty: "Easy",   deadline: "Mar 30", status: "approved" },
    ],
  },
];

const collaboratorProjects = allProjects.filter(p => !p.isOwner);
const active    = collaboratorProjects.filter(p => !p.isCompleted);
const completed = collaboratorProjects.filter(p => p.isCompleted);

const DifficultyBadge = ({ d }: { d: string }) => (
  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
    d === "Easy" ? "bg-success/10 text-success" : d === "Medium" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
  }`}>{d}</span>
);

function ContributionSummaryDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  if (!project) return null;
  return (
    <Dialog open={!!project} onOpenChange={o => { if (!o) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" /> Your Contribution Summary
          </DialogTitle>
          <DialogDescription>{project.name} · Completed {project.completedAt}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "XP Earned",  value: `+${project.xpEarned}`,   icon: Zap,          color: "text-warning" },
              { label: "Rep Gained", value: `+${project.repGained}`,   icon: Star,         color: "text-info"    },
              { label: "My Tasks",   value: `${project.myTasksDone}/${project.myTasksTotal}`, icon: CheckCircle2, color: "text-success" },
            ].map(s => (
              <div key={s.label} className="bg-secondary/50 rounded-xl p-3 text-center">
                <s.icon className={`h-4 w-4 mx-auto mb-1 ${s.color}`} />
                <p className="text-lg font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="font-medium text-foreground flex items-center gap-1.5"><BarChart2 className="h-4 w-4 text-primary" /> Task Completion</span>
              <span className="font-bold text-success">100%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-success rounded-full w-full" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Contribution</p>
            <p className="text-sm text-muted-foreground">{project.myContribution}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Team</p>
            <div className="flex gap-2 flex-wrap">
              {project.members.map(m => (
                <div key={m.name} className="flex items-center gap-1.5">
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold">{m.initials}</div>
                  <span className="text-xs text-muted-foreground">{m.name.split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/40 rounded-lg px-3 py-2">
            <Lock className="h-3.5 w-3.5 shrink-0" />
            This project is archived. The workspace is read-only.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const MyWork = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(active.map(p => ({ ...p })));
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ "2": true });
  const [summaryProject, setSummaryProject] = useState<Project | null>(null);

  const updateStatus = (projectId: string, taskId: string, status: TaskStatus) => {
    setProjects(prev => prev.map(p =>
      p.id !== projectId ? p :
      { ...p, tasks: p.tasks.map(t => t.id === taskId ? { ...t, status } : t) }
    ));
    toast.success(`Task status updated to ${status.replace("-", " ")}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Work</h1>
        <p className="text-sm text-muted-foreground mt-1">Projects where you are a collaborator.</p>
      </div>

      {/* Active projects */}
      {projects.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <FolderOpen className="h-4 w-4" /> Active ({projects.length})
          </h2>
          {projects.map(project => {
            const isExpanded = !!expanded[project.id];
            const myTasks = project.tasks.filter(t => t.assigned === CURRENT_USER.name);
            return (
              <div key={project.id} className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
                <div
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-secondary/30 transition-colors"
                  onClick={() => setExpanded(prev => ({ ...prev, [project.id]: !prev[project.id] }))}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-foreground">{project.name}</h3>
                      <span className="text-xs text-muted-foreground">owned by {project.owner}</span>
                      <Badge variant="outline" className="text-xs">
                        {myTasks.length} task{myTasks.length !== 1 ? "s" : ""} assigned to you
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <Progress value={project.progress} className="h-1.5 flex-1 max-w-48" />
                      <span className="text-xs text-muted-foreground">{project.progress}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <Button variant="outline" size="sm"
                      onClick={e => { e.stopPropagation(); navigate(`/workspace/${project.id}`); }}>
                      Open Workspace
                    </Button>
                    {isExpanded
                      ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t border-border">
                    <div className="px-5 py-3 bg-secondary/20 flex items-center gap-4">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">All Tasks</span>
                      <span className="text-xs text-muted-foreground">You can only act on tasks assigned to you</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-secondary/30">
                            <th className="text-left p-4 font-medium text-muted-foreground">Task</th>
                            <th className="text-left p-4 font-medium text-muted-foreground">Assigned To</th>
                            <th className="text-left p-4 font-medium text-muted-foreground">Difficulty</th>
                            <th className="text-left p-4 font-medium text-muted-foreground">Deadline</th>
                            <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                            <th className="text-left p-4 font-medium text-muted-foreground">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {project.tasks.map(task => {
                            const isMyTask = task.assigned === CURRENT_USER.name;
                            return (
                              <tr key={task.id}
                                className={`border-b border-border last:border-none transition-colors ${isMyTask ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-secondary/20"}`}
                              >
                                <td className="p-4">
                                  <span className="font-medium text-foreground">{task.name}</span>
                                  {isMyTask && <span className="ml-2 text-xs text-primary font-medium">(you)</span>}
                                </td>
                                <td className="p-4 text-muted-foreground">
                                  {task.assigned === "Unassigned"
                                    ? <span className="italic text-muted-foreground/60">Unassigned</span>
                                    : task.assigned}
                                </td>
                                <td className="p-4"><DifficultyBadge d={task.difficulty} /></td>
                                <td className="p-4 text-muted-foreground">{task.deadline}</td>
                                <td className="p-4"><StatusTag status={task.status} /></td>
                                <td className="p-4">
                                  {isMyTask ? (
                                    <div className="flex gap-1.5">
                                      {task.status === "open" && (
                                        <Button variant="outline" size="sm"
                                          onClick={() => updateStatus(project.id, task.id, "in-progress")}>
                                          <Play className="h-3.5 w-3.5 mr-1" /> Start Work
                                        </Button>
                                      )}
                                      {(task.status === "in-progress" || task.status === "revision") && (
                                        <Button variant="outline" size="sm"
                                          onClick={() => updateStatus(project.id, task.id, "in-review")}>
                                          <Send className="h-3.5 w-3.5 mr-1" /> Submit
                                        </Button>
                                      )}
                                      {task.status === "in-review" && <span className="text-xs text-muted-foreground italic">Awaiting review</span>}
                                      {task.status === "approved"  && <span className="text-xs text-success italic">✓ Approved</span>}
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">—</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Completed / Archived */}
      {completed.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Archive className="h-4 w-4" /> Completed ({completed.length})
          </h2>
          {completed.map(p => (
            <div key={p.id} className="bg-card rounded-xl border border-border p-5 shadow-card opacity-90">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-foreground">{p.name}</h3>
                    <Badge className="bg-success/10 text-success border-success/30 text-xs gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Completed
                    </Badge>
                    <span className="text-xs text-muted-foreground">owned by {p.owner}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Completed {p.completedAt} · {p.myTasksDone}/{p.myTasksTotal} of your tasks done
                  </p>
                  <Progress value={100} className="h-1.5 max-w-xs" />
                  {/* XP/Rep earned */}
                  <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 text-warning font-semibold"><Zap className="h-3.5 w-3.5" /> +{p.xpEarned} XP</span>
                    <span className="flex items-center gap-1 text-info font-semibold"><Star className="h-3.5 w-3.5" /> +{p.repGained} Rep</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Button size="sm" variant="outline" className="gap-1.5"
                    onClick={() => setSummaryProject(p)}>
                    <Trophy className="h-3.5 w-3.5" /> My Summary
                  </Button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" /> Archived — workspace is read-only
              </div>
            </div>
          ))}
        </div>
      )}

      {projects.length === 0 && completed.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">You are not a collaborator on any projects yet.</p>
        </div>
      )}

      <ContributionSummaryDialog project={summaryProject} onClose={() => setSummaryProject(null)} />
    </div>
  );
};

export default MyWork;
