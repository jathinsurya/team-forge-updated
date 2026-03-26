import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useRole, CURRENT_USER } from "@/contexts/RoleContext";
import { Zap, Star, FolderOpen, CheckCircle2, Award, Clock, TrendingUp, GitPullRequest, FileText, Users, BarChart2, CalendarCheck, Archive, ChevronRight, ArrowLeft, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserProfile {
  name: string; initials: string; title: string; university: string;
  bio: string; joinedDate: string;
  xp: number; rep: number; projects: number; tasks: number;
  skills: string[];
  hasMentorBadge: boolean;
  projectList: { name: string; role: string; status: string; contribution: string }[];
  activity: { action: string; project: string; time: string }[];
  stats: { label: string; value: string }[];
}

// ─── Project report generator ─────────────────────────────────────────────────
interface ProjectReport {
  name: string;
  role: string;
  contribution: string;
  duration: string;
  tasksCompleted: number;
  totalTasks: number;
  xpEarned: number;
  repGained: number;
  skills: string[];
  highlights: string[];
  outcome: string;
}

const PROJECT_REPORTS: Record<string, ProjectReport> = {
  "EcoTracker": {
    name: "EcoTracker", role: "Collaborator", contribution: "Integrated carbon footprint API",
    duration: "Jan 2026 – Feb 2026", tasksCompleted: 3, totalTasks: 3, xpEarned: 120, repGained: 8,
    skills: ["React", "API Integration", "Charts"],
    highlights: [
      "Integrated third-party carbon footprint API with full error boundary handling",
      "All 3 tasks approved on first submission — 100% approval rate",
      "Delivered 4 days ahead of project deadline",
    ],
    outcome: "Project shipped successfully with 80% of core features implemented. Received positive feedback from the project owner on code quality and documentation.",
  },
  "Budget Buddy": {
    name: "Budget Buddy", role: "Owner", contribution: "Led design and backend architecture",
    duration: "Oct 2025 – Dec 2025", tasksCompleted: 7, totalTasks: 8, xpEarned: 340, repGained: 14,
    skills: ["Node.js", "PostgreSQL", "REST API", "React"],
    highlights: [
      "Architected the full backend with role-based access control",
      "Led a team of 3 collaborators across 8 tasks",
      "Maintained 88% task approval rate across the project lifecycle",
    ],
    outcome: "Project completed with all core financial features live. Team achieved a combined 95% on-time submission rate. Selected as a featured project on the platform homepage.",
  },
  "Study Group Finder": {
    name: "Study Group Finder", role: "Collaborator", contribution: "Implemented matching algorithm frontend",
    duration: "Nov 2025 – Jan 2026", tasksCompleted: 2, totalTasks: 3, xpEarned: 90, repGained: 6,
    skills: ["React", "Algorithms", "TypeScript"],
    highlights: [
      "Built the compatibility score UI with real-time filtering",
      "Contributed frontend implementation of the matching algorithm visualization",
      "Collaborated closely with the backend team to align API contracts",
    ],
    outcome: "Matching feature launched successfully, enabling 40+ student pairs in the first week. Project owner rated collaboration experience 5/5.",
  },
  "MicroService Hub": {
    name: "MicroService Hub", role: "Owner", contribution: "Led full backend architecture",
    duration: "Aug 2025 – Nov 2025", tasksCompleted: 10, totalTasks: 10, xpEarned: 480, repGained: 20,
    skills: ["Go", "Docker", "Kubernetes", "PostgreSQL"],
    highlights: [
      "Designed microservices architecture handling 10k+ requests/day",
      "100% task completion rate — all 10 tasks approved without revision",
      "Onboarded and guided 2 junior collaborators through the codebase",
    ],
    outcome: "Platform achieved 99.9% uptime in the first month post-launch. Cited as a model project by platform mentors.",
  },
  "Code Review Hub": {
    name: "Code Review Hub", role: "Owner", contribution: "Designed entire review interface",
    duration: "Sep 2025 – Nov 2025", tasksCompleted: 5, totalTasks: 6, xpEarned: 220, repGained: 10,
    skills: ["React", "TypeScript", "Figma", "Tailwind CSS"],
    highlights: [
      "Designed and implemented the complete PR review UI from scratch",
      "Built inline commenting system with diff highlighting",
      "Integrated live status updates via polling",
    ],
    outcome: "Tool adopted by 3 other teams on the platform as their default code review interface. Positive feedback on UX quality.",
  },
  "NLP Classifier": {
    name: "NLP Classifier", role: "Owner", contribution: "Fine-tuned transformer models",
    duration: "Jun 2025 – Sep 2025", tasksCompleted: 8, totalTasks: 8, xpEarned: 400, repGained: 16,
    skills: ["Python", "TensorFlow", "Hugging Face", "MLOps"],
    highlights: [
      "Fine-tuned BERT model achieving 94.2% accuracy on test set",
      "Built end-to-end MLOps pipeline with automated retraining",
      "Published model to internal registry for reuse across 2 other projects",
    ],
    outcome: "Classifier deployed to production and integrated into AI Research Hub. Benchmarks exceeded initial targets by 12%.",
  },
  "Predictive Analytics Tool": {
    name: "Predictive Analytics Tool", role: "Collaborator", contribution: "Built forecasting models",
    duration: "Mar 2025 – Jun 2025", tasksCompleted: 6, totalTasks: 6, xpEarned: 280, repGained: 12,
    skills: ["Python", "Pandas", "scikit-learn", "R"],
    highlights: [
      "Built ARIMA and Prophet forecasting models for time-series data",
      "All 6 tasks submitted and approved with zero revisions required",
      "Documented model selection rationale and accuracy trade-offs",
    ],
    outcome: "Forecasting accuracy improved by 23% over the baseline heuristics. Models now serve as reference implementations for the team.",
  },
};


// ─── Other users (viewed from leaderboard) ────────────────────────────────────
const otherProfiles: Record<string, UserProfile> = {
  "Dr. Divya Krishnan": {
    name: "Dr. Divya Krishnan", initials: "DK",
    title: "Machine Learning Engineer", university: "IIT Bombay",
    bio: "Researcher and engineer with 8+ years building production ML systems. Passionate about helping students break into AI and data science through hands-on project mentorship.",
    joinedDate: "Jan 2023", xp: 4200, rep: 96, projects: 8, tasks: 42,
    skills: ["Python", "Machine Learning", "TensorFlow", "Data Science", "R", "Pandas", "MLOps"],
    hasMentorBadge: false,
    projectList: [
      { name: "AI Research Hub",           role: "Owner",        status: "Active",    contribution: "Architected the full ML pipeline"  },
      { name: "Predictive Analytics Tool", role: "Collaborator", status: "Completed", contribution: "Built forecasting models"           },
      { name: "NLP Classifier",            role: "Owner",        status: "Completed", contribution: "Fine-tuned transformer models"      },
    ],
    activity: [
      { action: "Approved task 'Model Training Pipeline'", project: "AI Research Hub",           time: "2 hours ago" },
      { action: "Left review on PR #31",                   project: "Predictive Analytics Tool", time: "1 day ago"   },
      { action: "Completed 'NLP Module'",                  project: "NLP Classifier",            time: "3 days ago"  },
    ],
    stats: [{ label: "Avg XP / Task", value: "100" }, { label: "Approval Rate", value: "98%" }, { label: "Tasks on Time", value: "95%" }],
  },
  "Priya Patel": {
    name: "Priya Patel", initials: "PP",
    title: "Backend Engineer", university: "BITS Pilani",
    bio: "Backend specialist focused on scalable systems and cloud infrastructure. Love building robust APIs and mentoring juniors on distributed systems concepts.",
    joinedDate: "Mar 2023", xp: 3850, rep: 93, projects: 7, tasks: 38,
    skills: ["Java", "Spring Boot", "Kubernetes", "AWS", "PostgreSQL", "Go", "Docker"],
    hasMentorBadge: true,
    projectList: [
      { name: "Budget Buddy",     role: "Collaborator", status: "Active",    contribution: "Designed the financial API layer"  },
      { name: "MicroService Hub", role: "Owner",        status: "Completed", contribution: "Led full backend architecture"      },
    ],
    activity: [
      { action: "Submitted 'API Rate Limiting Module'", project: "Budget Buddy",     time: "5 hours ago" },
      { action: "Merged PR #22",                        project: "MicroService Hub", time: "2 days ago"  },
      { action: "Earned 80 XP",                         project: "Budget Buddy",     time: "4 days ago"  },
    ],
    stats: [{ label: "Avg XP / Task", value: "101" }, { label: "Approval Rate", value: "97%" }, { label: "Tasks on Time", value: "92%" }],
  },
  "Rohan Mehta": {
    name: "Rohan Mehta", initials: "RM",
    title: "Frontend Developer", university: "NIT Trichy",
    bio: "Frontend engineer who cares deeply about UI quality and performance. Experienced with React, TypeScript, and design systems. Open source contributor.",
    joinedDate: "Feb 2023", xp: 3400, rep: 89, projects: 6, tasks: 35,
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Figma", "Vite"],
    hasMentorBadge: false,
    projectList: [
      { name: "Campus Events App", role: "Collaborator", status: "Active",    contribution: "Built event listing and RSVP UI"   },
      { name: "Code Review Hub",   role: "Owner",        status: "Completed", contribution: "Designed entire review interface"  },
    ],
    activity: [
      { action: "Started 'Event Map View'",    project: "Campus Events App", time: "1 hour ago"  },
      { action: "Task approved 'RSVP Button'", project: "Campus Events App", time: "1 day ago"   },
      { action: "Earned 40 XP",                project: "Code Review Hub",   time: "3 days ago"  },
    ],
    stats: [{ label: "Avg XP / Task", value: "97" }, { label: "Approval Rate", value: "91%" }, { label: "Tasks on Time", value: "89%" }],
  },
  "Sneha Iyer": {
    name: "Sneha Iyer", initials: "SI",
    title: "Full-stack Developer", university: "VIT Vellore",
    bio: "Full-stack developer passionate about health tech. I love building apps that make a real difference in people's daily lives. Always learning.",
    joinedDate: "Apr 2023", xp: 2100, rep: 82, projects: 4, tasks: 20,
    skills: ["React", "Node.js", "MongoDB", "Express", "GraphQL", "Figma"],
    hasMentorBadge: false,
    projectList: [
      { name: "Health & Wellness", role: "Owner",        status: "Active",    contribution: "Led product design and backend"    },
      { name: "EcoTracker",        role: "Collaborator", status: "Completed", contribution: "Built carbon API integration"      },
    ],
    activity: [
      { action: "Submitted 'Daily Check-in Feature'", project: "Health & Wellness", time: "3 hours ago" },
      { action: "Joined project",                     project: "Health & Wellness", time: "1 week ago"  },
      { action: "Task approved 'Carbon Dashboard'",   project: "EcoTracker",        time: "2 weeks ago" },
    ],
    stats: [{ label: "Avg XP / Task", value: "105" }, { label: "Approval Rate", value: "90%" }, { label: "Tasks on Time", value: "85%" }],
  },
};

// ─── Mentored projects data ──────────────────────────────────────────────────
const MENTORED_PROJECTS = [
  {
    id: "3", name: "EcoTracker", owner: "Ananya Reddy", ownerInitials: "AR",
    description: "Gamified carbon footprint tracker with third-party API integration and data visualisation challenges.",
    since: "Jan 2026", completedAt: "Feb 2026",
    skills: ["React", "API Integration", "Charts"],
    members: [{ name: "Ananya Reddy", initials: "AR" }, { name: "Kiran Bose", initials: "KB" }, { name: "Meera Pillai", initials: "MP" }],
  },
  {
    id: "5", name: "Budget Buddy", owner: "Vikram Nair", ownerInitials: "VN",
    description: "Personal finance tracker helping students manage expenses, set savings goals, and visualise spending patterns.",
    since: "Oct 2025", completedAt: "Dec 2025",
    skills: ["Node.js", "PostgreSQL", "React", "Charts"],
    members: [{ name: "Vikram Nair", initials: "VN" }, { name: "Sneha Iyer", initials: "SI" }, { name: "Kiran Bose", initials: "KB" }],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatPill({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/60">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground leading-none">{label}</p>
        <p className="text-sm font-semibold text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function ProfileView({ p, skills, isMentorMode }: { p: UserProfile; skills: string[]; isMentorMode: boolean }) {
  const completedProjects = p.projectList.filter(proj => proj.status === "Completed");
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{ name: string; role: string; contribution: string } | null>(null);
  const report = selectedProject ? PROJECT_REPORTS[selectedProject.name] : null;
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shrink-0">
            {p.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{p.name}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">{p.title} · {p.university}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Member since {p.joinedDate}</p>
              </div>
              {p.hasMentorBadge && (
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-accent/15 text-accent font-semibold border border-accent/30">
                  <Award className="h-3 w-3" /> Mentor Recommended
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{p.bio}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-border">
          <StatPill label="XP Points"  value={p.xp.toLocaleString()} icon={Zap} />
          <StatPill label="Reputation" value={p.rep}                 icon={Star} />
          <StatPill label="Projects"   value={p.projects}            icon={FolderOpen} />
          <StatPill label="Tasks Done" value={p.tasks}               icon={CheckCircle2} />
        </div>
      </div>

      {/* Performance + Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Performance
          </h2>
          <div className="space-y-0">
            {p.stats.map(s => (
              <div key={s.label} className="flex items-center justify-between py-2.5 border-b border-border/60 last:border-none">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <span className="text-sm font-semibold text-foreground">{s.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between py-2.5 border-b border-border/60">
              <span className="text-sm text-muted-foreground">Total Projects</span>
              <span className="text-sm font-semibold text-foreground">{p.projects}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-sm text-muted-foreground">Total Tasks Completed</span>
              <span className="text-sm font-semibold text-foreground">{p.tasks}</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h2 className="font-semibold text-foreground mb-4">Skills</h2>
          {skills.length === 0
            ? <p className="text-sm text-muted-foreground italic">No skills added yet.</p>
            : <div className="flex flex-wrap gap-2">
                {skills.map(s => <Badge key={s} variant="secondary" className="text-sm px-3 py-1">{s}</Badge>)}
              </div>
          }
        </div>
      </div>

      {/* ── MENTOR MODE: Projects Mentored ── */}
      {isMentorMode ? (
        <div className="space-y-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" /> Projects Mentored
          </h2>
          {MENTORED_PROJECTS.map(proj => (
            <div key={proj.id} className="bg-card rounded-xl border border-border p-5 shadow-card">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-foreground">{proj.name}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success">Completed</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Owner: {proj.owner} · Mentored {proj.since} – {proj.completedAt}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{proj.description}</p>
                </div>
                <span className="text-sm font-bold text-success shrink-0">100%</span>
              </div>

              {/* Progress bar */}
              <Progress value={proj.progress} className="h-1.5 mb-3" />

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {proj.skills.map(s => (
                  <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                ))}
              </div>

              {/* Members */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Team:</span>
                <div className="flex -space-x-1.5">
                  {proj.members.map(m => (
                    <div
                      key={m.name}
                      title={m.name}
                      className="h-6 w-6 rounded-full bg-primary border-2 border-card flex items-center justify-center text-primary-foreground text-[9px] font-bold"
                    >
                      {m.initials}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{proj.members.length} members</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* ── NON-MENTOR: Projects + Activity ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-card rounded-xl border border-border p-5 shadow-card">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <GitPullRequest className="h-4 w-4 text-primary" /> Active Projects
              </h2>
              {p.projectList.filter(proj => proj.status === "Active").length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No active projects.</p>
              ) : (
                <div className="space-y-4">
                  {p.projectList.filter(proj => proj.status === "Active").map(proj => (
                    <div key={proj.name} className="border-b border-border/60 last:border-none pb-3 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground">{proj.name}</p>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-info/10 text-info">Active</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{proj.role} · {proj.contribution}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-card rounded-xl border border-border p-5 shadow-card">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Recent Activity
              </h2>
              <div className="space-y-3">
                {p.activity.map((a, i) => (
                  <div key={i} className="flex gap-3 border-b border-border/60 last:border-none pb-3 last:pb-0">
                    <div className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-snug">{a.action}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.project} · {a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mentor badge — only shown when earned */}
          {p.hasMentorBadge && (
            <div className="bg-card rounded-xl border border-border p-5 shadow-card">
              <h2 className="font-semibold text-foreground mb-2">Mentor Recommendation</h2>
              <p className="text-sm text-muted-foreground mb-3">Awarded by a platform mentor who directly worked with this user.</p>
              <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-accent/10 text-accent font-semibold border border-accent/30">
                <Award className="h-3.5 w-3.5" /> Mentor Recommended
              </span>
            </div>
          )}

          {/* Archived Projects card */}
          {completedProjects.length > 0 && (
        <div
          className="bg-card rounded-xl border border-border p-5 shadow-card cursor-pointer hover:shadow-card-hover transition-shadow group"
          onClick={() => setArchiveOpen(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
                <Archive className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Archived Projects</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{completedProjects.length} completed project{completedProjects.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          {/* Preview pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {completedProjects.map(proj => (
              <span key={proj.name} className="text-xs px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/20 flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3" /> {proj.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Archive list dialog ── */}
      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-muted-foreground" /> Archived Projects
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 pt-1">
            {completedProjects.map(proj => (
              <button
                key={proj.name}
                className="w-full text-left bg-secondary/40 hover:bg-secondary/70 border border-border rounded-xl px-4 py-3.5 transition-colors flex items-center justify-between gap-3 group"
                onClick={() => { setSelectedProject(proj); setArchiveOpen(false); }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{proj.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{proj.role} · {proj.contribution}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">Completed</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Individual project report dialog ── */}
      <Dialog open={!!selectedProject} onOpenChange={open => { if (!open) setSelectedProject(null); }}>
        <DialogContent className="max-w-2xl overflow-y-auto" style={{ maxHeight: "85vh" }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <button
                className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/70 transition-colors shrink-0"
                onClick={() => { setSelectedProject(null); setArchiveOpen(true); }}
              >
                <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              <FileText className="h-5 w-5 text-primary" />
              {selectedProject?.name}
            </DialogTitle>
          </DialogHeader>

          {report ? (
            <div className="space-y-5 pt-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Role",       value: report.role,       icon: Users         },
                  { label: "Duration",   value: report.duration,   icon: CalendarCheck },
                  { label: "XP Earned",  value: `+${report.xpEarned}`,  icon: Zap    },
                  { label: "Rep Gained", value: `+${report.repGained}`, icon: Star   },
                ].map(s => (
                  <div key={s.label} className="bg-secondary/50 rounded-lg p-3 text-center">
                    <s.icon className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-primary" /> Task Completion
                  </h3>
                  <span className="text-sm font-bold text-success">{report.tasksCompleted}/{report.totalTasks} tasks</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full" style={{ width: `${(report.tasksCompleted / report.totalTasks) * 100}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">{Math.round((report.tasksCompleted / report.totalTasks) * 100)}% completion rate</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Your Contribution</h3>
                <p className="text-sm text-muted-foreground">{report.contribution}</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" /> Key Highlights
                </h3>
                <ul className="space-y-1.5">
                  {report.highlights.map((h, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-success mt-0.5 shrink-0">✓</span> {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Skills Applied</h3>
                <div className="flex flex-wrap gap-2">
                  {report.skills.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Project Outcome</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{report.outcome}</p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Report not yet generated for this project.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
        </>
      )}

      {/* Dialogs are only rendered in non-mentor mode above */}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const Profile = () => {
  const location = useLocation();
  const { userSkills, role } = useRole();
  const isMentorMode = role === "mentor";
  const userName = location.state?.userName as string | undefined;

  // Viewing another user's profile (navigated from leaderboard)
  if (userName && otherProfiles[userName]) {
    const p = otherProfiles[userName];
    return (
      <div className="p-6 max-w-4xl mx-auto animate-fade-in">
        <ProfileView p={p} skills={p.skills} isMentorMode={false} />
      </div>
    );
  }

  // Own profile — always Arjun Sharma
  const ownProfile: UserProfile = {
    name:       CURRENT_USER.name,
    initials:   CURRENT_USER.initials,
    title:      CURRENT_USER.title,
    university: CURRENT_USER.university,
    bio: "Building products that solve real student problems. I enjoy leading projects end-to-end — from design to deployment. Currently exploring AI integrations and looking for collaborators to build with.",
    joinedDate: "Dec 2022",
    xp: 2450, rep: 87, projects: 5, tasks: 24,
    skills: userSkills,
    hasMentorBadge: false,
    projectList: [
      { name: "AI Study Planner",   role: "Owner",        status: "Active",    contribution: "Leading full product development"        },
      { name: "Campus Events App",  role: "Collaborator", status: "Active",    contribution: "Built event discovery feature"            },
      { name: "EcoTracker",         role: "Collaborator", status: "Completed", contribution: "Integrated carbon footprint API"          },
      { name: "Budget Buddy",       role: "Owner",        status: "Completed", contribution: "Led design and backend architecture"      },
      { name: "Study Group Finder", role: "Collaborator", status: "Completed", contribution: "Implemented matching algorithm frontend"  },
    ],
    activity: [
      { action: "Created task 'API Integration Sprint'", project: "AI Study Planner",  time: "2 hours ago" },
      { action: "Task approved 'Auth Module'",           project: "AI Study Planner",  time: "1 day ago"   },
      { action: "Joined project",                        project: "Campus Events App", time: "3 days ago"  },
      { action: "Earned 80 XP",                         project: "EcoTracker",        time: "1 week ago"  },
    ],
    stats: [
      { label: "Avg XP / Task", value: "102" },
      { label: "Approval Rate", value: "88%" },
      { label: "Tasks on Time", value: "83%" },
    ],
  };

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in space-y-5">
      <ProfileView p={ownProfile} skills={userSkills} isMentorMode={isMentorMode} />
      {!isMentorMode && (
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h2 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" /> Mentor Recommendation
          </h2>
          <p className="text-sm text-muted-foreground">
            You haven't received a mentor recommendation yet. Work with a mentor on a project to earn this badge.
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;
