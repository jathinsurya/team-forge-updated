import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  FolderOpen, CheckCircle2, Users, Zap, Star, Trophy,
  Lock, ExternalLink, BarChart2, Clock, Archive
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  progress: number;
  tasks: number;
  completedTasks: number;
  members: number;
  duration: string;
  skills: string[];
  isCompleted: boolean;
  totalXp: number;
  repGained: number;
  highlights: string[];
}

const initialProjects: Project[] = [
  {
    id: "1", name: "AI Study Planner", progress: 35, tasks: 5,
    completedTasks: 1, members: 3, duration: "Dec 2025 – present",
    skills: ["React", "Python", "OpenAI API", "TypeScript"],
    isCompleted: false, totalXp: 0, repGained: 0, highlights: [],
  },
  {
    id: "budget", name: "Budget Buddy", progress: 100, tasks: 8,
    completedTasks: 8, members: 3, duration: "Oct 2025 – Dec 2025",
    skills: ["Node.js", "PostgreSQL", "REST API", "React"],
    isCompleted: true, totalXp: 340, repGained: 14,
    highlights: [
      "All 8 tasks approved — 100% completion rate",
      "Team maintained 95% on-time submission rate",
      "Featured project on the platform homepage",
    ],
  },
];

function CompletionSummaryDialog({
  project, onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  if (!project) return null;
  return (
    <Dialog open={!!project} onOpenChange={o => { if (!o) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" /> Project Completed
          </DialogTitle>
          <DialogDescription>Final summary for {project.name}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          {/* XP / Rep / Tasks */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "XP Earned",     value: `+${project.totalXp}`, icon: Zap,          color: "text-warning"     },
              { label: "Rep Gained",    value: `+${project.repGained}`, icon: Star,        color: "text-info"        },
              { label: "Tasks Done",    value: `${project.completedTasks}/${project.tasks}`, icon: CheckCircle2, color: "text-success" },
            ].map(s => (
              <div key={s.label} className="bg-secondary/50 rounded-xl p-3 text-center">
                <s.icon className={`h-4 w-4 mx-auto mb-1 ${s.color}`} />
                <p className="text-lg font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Completion bar */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="font-medium text-foreground flex items-center gap-1.5"><BarChart2 className="h-4 w-4 text-primary" /> Task Completion</span>
              <span className="font-bold text-success">100%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-success rounded-full w-full" />
            </div>
          </div>

          {/* Duration + members */}
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {project.duration}</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {project.members} members</span>
          </div>

          {/* Highlights */}
          {project.highlights.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4 space-y-2">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-success" /> Highlights
              </h3>
              <ul className="space-y-1.5">
                {project.highlights.map((h, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-success shrink-0">✓</span> {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Skills Applied</p>
            <div className="flex flex-wrap gap-2">
              {project.skills.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/40 rounded-lg px-3 py-2">
            <Lock className="h-3.5 w-3.5 shrink-0" />
            This project is archived. The workspace is read-only.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const MyProjects = () => {
  const navigate = useNavigate();
  const [summaryProject, setSummaryProject] = useState<Project | null>(null);

  const active    = initialProjects.filter(p => !p.isCompleted);
  const completed = initialProjects.filter(p => p.isCompleted);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Projects</h1>
        <p className="text-sm text-muted-foreground mt-1">Projects you own and manage.</p>
      </div>

      {/* Active projects */}
      {active.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <FolderOpen className="h-4 w-4" /> Active ({active.length})
          </h2>
          {active.map(p => (
            <div
              key={p.id}
              onClick={() => navigate(`/workspace/${p.id}`)}
              className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-foreground">{p.name}</h3>
                <span className="text-sm font-semibold text-foreground">{p.progress}%</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {p.completedTasks}/{p.tasks} tasks completed · {p.members} members · {p.duration}
              </p>
              <Progress value={p.progress} className="h-1.5" />
              <div className="flex flex-wrap gap-1.5 mt-3">
                {p.skills.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed / Archived projects */}
      {completed.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Archive className="h-4 w-4" /> Completed ({completed.length})
          </h2>
          {completed.map(p => (
            <div key={p.id} className="bg-card rounded-xl border border-border p-5 shadow-card opacity-90">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{p.name}</h3>
                    <Badge className="bg-success/10 text-success border-success/30 text-xs gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Completed
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {p.completedTasks}/{p.tasks} tasks · {p.members} members · {p.duration}
                  </p>
                  <Progress value={100} className="h-1.5 max-w-xs" />
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {p.skills.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Button size="sm" variant="outline" className="gap-1.5"
                    onClick={() => setSummaryProject(p)}>
                    <Trophy className="h-3.5 w-3.5" /> View Summary
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-1.5 text-muted-foreground"
                    onClick={() => navigate(`/workspace/${p.id}`)}>
                    <ExternalLink className="h-3.5 w-3.5" /> Workspace
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

      <CompletionSummaryDialog project={summaryProject} onClose={() => setSummaryProject(null)} />
    </div>
  );
};

export default MyProjects;
