import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusTag } from "@/components/shared/StatusTag";
import { Users, CheckCircle2, Clock, Award, ChevronDown, ChevronUp, MessageSquare, Star, ExternalLink, Link } from "lucide-react";
import { toast } from "sonner";

type TaskStatus = "open" | "in-progress" | "in-review" | "revision" | "approved";

interface Member { name: string; initials: string; role: string; hasBadge: boolean }
interface Task { id: string; name: string; assigned: string; difficulty: "Easy" | "Medium" | "Hard"; status: TaskStatus; proofLink?: string }
interface Project {
  id: string; name: string; owner: string; ownerInitials: string;
  description: string; progress: number; skills: string[];
  members: Member[]; tasks: Task[];
  nextCheckIn: string; mentorNote: string;
}

const initialProjects: Project[] = [
  {
    id: "3", name: "EcoTracker", owner: "Ananya Reddy", ownerInitials: "AR",
    description: "Gamified carbon footprint tracker with third-party API integration and data visualisation challenges.",
    progress: 80, skills: ["React", "API Integration", "Charts"], nextCheckIn: "Mar 12, 2026",
    mentorNote: "Strong progress. Focus next session on chart render performance and ensuring API error boundaries are solid.",
    members: [
      { name: "Ananya Reddy", initials: "AR", role: "Owner",        hasBadge: false },
      { name: "Kiran Bose",   initials: "KB", role: "Collaborator", hasBadge: false },
      { name: "Meera Pillai", initials: "MP", role: "Collaborator", hasBadge: false },
    ],
    tasks: [
      { id: "t1", name: "Carbon footprint tracker",  assigned: "Kiran Bose",   difficulty: "Hard",   status: "approved"    },
      { id: "t2", name: "Gamification module",       assigned: "Meera Pillai", difficulty: "Medium", status: "in-review",  proofLink: "https://github.com/ecotracker/gamification/pr/12" },
      { id: "t3", name: "Carbon API integration",    assigned: "Ananya Reddy", difficulty: "Hard",   status: "approved"    },
      { id: "t4", name: "Final integration tests",   assigned: "Kiran Bose",   difficulty: "Easy",   status: "in-progress" },
    ],
  },
  {
    id: "4", name: "Study Group Finder", owner: "Priya Patel", ownerInitials: "PP",
    description: "Match students with compatible study partners based on courses, schedule, and learning preferences.",
    progress: 20, skills: ["React", "Node.js", "Algorithms"], nextCheckIn: "Mar 15, 2026",
    mentorNote: "Early stage. Help team narrow down the matching algorithm scope. Suggest starting with a simple compatibility score before scaling up.",
    members: [
      { name: "Priya Patel",  initials: "PP", role: "Owner",        hasBadge: false },
      { name: "Rohan Mehta",  initials: "RM", role: "Collaborator", hasBadge: false },
    ],
    tasks: [
      { id: "t5", name: "Project setup & architecture",  assigned: "Priya Patel", difficulty: "Easy",   status: "approved"    },
      { id: "t6", name: "User matching algorithm",       assigned: "Rohan Mehta", difficulty: "Hard",   status: "in-progress" },
      { id: "t7", name: "Profile creation UI",           assigned: "Priya Patel", difficulty: "Medium", status: "open"        },
      { id: "t8", name: "Chat integration",              assigned: "Unassigned",  difficulty: "Hard",   status: "open"        },
    ],
  },
];

const DiffBadge = ({ d }: { d: string }) => (
  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
    d === "Easy" ? "bg-success/10 text-success" : d === "Medium" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
  }`}>{d}</span>
);

const MentoredProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(initialProjects);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ "3": true });
  const [confirmBadge, setConfirmBadge] = useState<{ projectId: string; memberName: string } | null>(null);

  const awardBadge = (projectId: string, memberName: string) => {
    setProjects(prev => prev.map(p =>
      p.id !== projectId ? p : {
        ...p,
        members: p.members.map(m => m.name === memberName ? { ...m, hasBadge: true } : m),
      }
    ));
    setConfirmBadge(null);
    toast.success(`🏅 Mentor Recommendation badge awarded to ${memberName}!`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mentored Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Projects you are actively guiding as a mentor.</p>
        </div>
        <Badge className="bg-accent/10 text-accent border border-accent/30 gap-1.5 px-3 py-1.5">
          <Star className="h-3.5 w-3.5" /> {projects.length} Active
        </Badge>
      </div>

      <div className="space-y-4">
        {projects.map(project => {
          const isOpen = !!expanded[project.id];
          const done = project.tasks.filter(t => t.status === "approved").length;

          return (
            <div key={project.id} className="bg-card rounded-xl border border-border shadow-card overflow-hidden">

              {/* Project header */}
              <div
                className="p-5 cursor-pointer hover:bg-secondary/20 transition-colors"
                onClick={() => setExpanded(p => ({ ...p, [project.id]: !p[project.id] }))}
              >
                <div className="flex items-start gap-4 justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-foreground">{project.name}</h3>
                      <Badge variant="outline" className="text-xs text-success border-success/40 gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Mentoring Active
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.skills.map(s => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">{s}</span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {project.members.length} members</span>
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> {done}/{project.tasks.length} tasks done</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Check-in: {project.nextCheckIn}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-bold text-foreground">{project.progress}%</p>
                      <div className="w-20">
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline"
                        onClick={e => { e.stopPropagation(); navigate(`/workspace/${project.id}`); }}
                        className="gap-1">
                        <ExternalLink className="h-3.5 w-3.5" /> Workspace
                      </Button>
                      {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {isOpen && (
                <div className="border-t border-border divide-y divide-border/60">

                  {/* Mentor note */}
                  <div className="px-5 py-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" /> Your Notes
                    </h4>
                    <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                      "{project.mentorNote}"
                    </p>
                  </div>

                  {/* Team + badge awarding */}
                  <div className="px-5 py-4">
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" /> Team Members
                    </h4>
                    <div className="space-y-2.5">
                      {project.members.map(m => (
                        <div key={m.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                              {m.initials}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="text-sm font-medium text-foreground">{m.name}</p>
                                {m.hasBadge && (
                                  <span className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 font-medium">
                                    <Award className="h-2.5 w-2.5" /> Recommended
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{m.role}</p>
                            </div>
                          </div>
                          {!m.hasBadge ? (
                            confirmBadge?.projectId === project.id && confirmBadge.memberName === m.name ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Award badge?</span>
                                <Button size="sm" className="h-7 text-xs gap-1"
                                  onClick={() => awardBadge(project.id, m.name)}>
                                  <Award className="h-3 w-3" /> Confirm
                                </Button>
                                <Button size="sm" variant="outline" className="h-7 text-xs"
                                  onClick={() => setConfirmBadge(null)}>
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <Button size="sm" variant="outline" className="h-7 text-xs gap-1"
                                onClick={() => setConfirmBadge({ projectId: project.id, memberName: m.name })}>
                                <Award className="h-3 w-3" /> Give Badge
                              </Button>
                            )
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Badge awarded</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Task overview — read-only */}
                  <div className="px-5 py-4">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Task Overview</h4>
                    <div className="overflow-x-auto rounded-lg border border-border">
                      <table className="w-full text-sm">
                        <thead className="bg-secondary/40">
                          <tr>
                            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Task</th>
                            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Assigned</th>
                            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Difficulty</th>
                            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Status</th>
                            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Proof</th>
                          </tr>
                        </thead>
                        <tbody>
                          {project.tasks.map((task, i) => (
                            <tr key={task.id} className={`border-t border-border/50 ${i % 2 === 0 ? "" : "bg-secondary/10"}`}>
                              <td className="px-4 py-2.5 font-medium text-foreground">{task.name}</td>
                              <td className="px-4 py-2.5 text-muted-foreground">{task.assigned}</td>
                              <td className="px-4 py-2.5"><DiffBadge d={task.difficulty} /></td>
                              <td className="px-4 py-2.5"><StatusTag status={task.status} /></td>
                              <td className="px-4 py-2.5">
                                {task.proofLink ? (
                                  <a
                                    href={task.proofLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-info/10 text-info border border-info/20 hover:bg-info/20 transition-colors"
                                  >
                                    <ExternalLink className="h-3 w-3" /> View
                                  </a>
                                ) : (
                                  <span className="text-xs text-muted-foreground">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      Mentors have read-only access to tasks. Open workspace to view full project details.
                    </p>
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

export default MentoredProjects;
