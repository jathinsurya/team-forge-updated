import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { StatusTag } from "@/components/shared/StatusTag";
import { ChatPanel } from "@/components/shared/ChatPanel";
import { useRole, CURRENT_USER } from "@/contexts/RoleContext";
import { ArrowLeft, Plus, UserPlus, CheckCircle, XCircle, Play, Send, Shield, UserCog, Clock, CheckCheck, Mail, Users, ExternalLink, Trophy, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// --- Mock Data ---
type TaskStatus = "open" | "in-progress" | "in-review" | "revision" | "approved";
type Difficulty = "Easy" | "Medium" | "Hard";

interface Task {
  id: string;
  name: string;
  assigned: string;
  difficulty: Difficulty;
  deadline: string;
  status: TaskStatus;
  proofLink?: string;
}

interface ProjectData {
  name: string;
  description: string;
  owner: string;
  skills: string[];
  progress: number;
  tasks: Task[];
  members: { name: string; initials: string; role: string }[];
}

const PROJECT_DATA: Record<string, ProjectData> = {
  "1": {
    name: "AI Study Planner",
    description: "An intelligent study planning tool that uses AI to create personalized study schedules, track progress, and adapt to individual learning styles. Built with React, Python, and OpenAI API.",
    owner: "Arjun Sharma",
    skills: ["React", "Python", "OpenAI API", "TypeScript", "PostgreSQL"],
    progress: 35,
    tasks: [
      { id: "1", name: "Set up project structure",    assigned: "Arjun Sharma", difficulty: "Easy",   deadline: "Mar 10", status: "approved"    },
      { id: "2", name: "Build authentication module", assigned: "Rohan Mehta",  difficulty: "Medium", deadline: "Mar 15", status: "in-progress" },
      { id: "3", name: "Design dashboard UI",         assigned: "Sneha Iyer",   difficulty: "Medium", deadline: "Mar 18", status: "in-review"   },
      { id: "4", name: "Implement API integration",   assigned: "Arjun Sharma", difficulty: "Hard",   deadline: "Mar 22", status: "open"        },
      { id: "5", name: "Write unit tests",            assigned: "Unassigned",   difficulty: "Easy",   deadline: "Mar 25", status: "open"        },
    ],
    members: [
      { name: "Arjun Sharma", initials: "AS", role: "Owner"        },
      { name: "Rohan Mehta",  initials: "RM", role: "Collaborator" },
      { name: "Sneha Iyer",   initials: "SI", role: "Collaborator" },
    ],
  },
  "3": {
    name: "EcoTracker",
    description: "Gamified carbon footprint tracker with third-party API integration and data visualisation challenges.",
    owner: "Ananya Reddy",
    skills: ["React", "API Integration", "Charts"],
    progress: 80,
    tasks: [
      { id: "t1", name: "Carbon footprint tracker",  assigned: "Kiran Bose",   difficulty: "Hard",   deadline: "Mar 5",  status: "approved"    },
      { id: "t2", name: "Gamification module",       assigned: "Meera Pillai", difficulty: "Medium", deadline: "Mar 12", status: "in-review",  proofLink: "https://github.com/ecotracker/gamification/pr/12" },
      { id: "t3", name: "Carbon API integration",    assigned: "Ananya Reddy", difficulty: "Hard",   deadline: "Mar 8",  status: "approved"    },
      { id: "t4", name: "Final integration tests",   assigned: "Kiran Bose",   difficulty: "Easy",   deadline: "Mar 20", status: "in-progress" },
    ],
    members: [
      { name: "Ananya Reddy", initials: "AR", role: "Owner"        },
      { name: "Kiran Bose",   initials: "KB", role: "Collaborator" },
      { name: "Meera Pillai", initials: "MP", role: "Collaborator" },
    ],
  },
  "4": {
    name: "Study Group Finder",
    description: "Match students with compatible study partners based on courses, schedule, and learning preferences.",
    owner: "Priya Patel",
    skills: ["React", "Node.js", "Algorithms"],
    progress: 20,
    tasks: [
      { id: "t5", name: "Project setup & architecture", assigned: "Priya Patel", difficulty: "Easy",   deadline: "Mar 3",  status: "approved"    },
      { id: "t6", name: "User matching algorithm",      assigned: "Rohan Mehta", difficulty: "Hard",   deadline: "Mar 20", status: "in-progress" },
      { id: "t7", name: "Profile creation UI",          assigned: "Priya Patel", difficulty: "Medium", deadline: "Mar 22", status: "open"        },
      { id: "t8", name: "Chat integration",             assigned: "Unassigned",  difficulty: "Hard",   deadline: "Mar 28", status: "open"        },
    ],
    members: [
      { name: "Priya Patel",  initials: "PP", role: "Owner"        },
      { name: "Rohan Mehta",  initials: "RM", role: "Collaborator" },
    ],
  },
};

const availableMentors = [
  { name: "Dr. Divya Krishnan", expertise: "Machine Learning, AI",      experience: "8 years",  initials: "DK" },
  { name: "Prof. Suresh Rajan", expertise: "Full-Stack Development",    experience: "12 years", initials: "SR" },
  { name: "Pooja Desai",        expertise: "UI/UX Design, Frontend",    experience: "6 years",  initials: "PD" },
];

const DifficultyBadge = ({ difficulty }: { difficulty: string }) => (
  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
    difficulty === "Easy"   ? "bg-success/10 text-success" :
    difficulty === "Medium" ? "bg-warning/10 text-warning" :
    "bg-destructive/10 text-destructive"
  }`}>{difficulty}</span>
);

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatBox({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card text-center">
      <p className={`text-2xl font-bold ${className || "text-foreground"}`}>{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function TaskActions({
  task, isOwner, isMyTask, onStatusChange, onSubmitClick, isLocked,
}: {
  task: Task;
  isOwner: boolean;
  isMyTask: boolean;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onSubmitClick: (taskId: string) => void;
  isLocked?: boolean;
}) {
  // Completed project — no actions for anyone
  if (isLocked) {
    return task.status === "approved"
      ? <span className="text-xs text-success italic">✓ Approved</span>
      : <span className="text-xs text-muted-foreground italic">—</span>;
  }
  // ── Pure owner mode (not collaborator-mode) ──────────────────────────────
  if (isOwner) {
    return (
      <div className="flex gap-1.5">
        {task.status === "in-review" && (
          <>
            <Button variant="outline" size="sm" className="text-success border-success/30 hover:bg-success/10"
              onClick={() => onStatusChange(task.id, "approved")}>
              <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
            </Button>
            <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => onStatusChange(task.id, "revision")}>
              <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
            </Button>
          </>
        )}
        {task.status === "open"        && <span className="text-xs text-muted-foreground italic">Awaiting collaborator</span>}
        {task.status === "in-progress" && <span className="text-xs text-muted-foreground italic">Work in progress</span>}
        {task.status === "approved"    && <span className="text-xs text-success italic">✓ Done</span>}
        {task.status === "revision"    && <span className="text-xs text-warning italic">Sent back for revision</span>}
      </div>
    );
  }

  // ── Collaborator mode (or owner-as-collaborator) ─────────────────────────
  // If it's not the user's task → show only the status tag (no buttons)
  if (!isMyTask) {
    return <StatusTag status={task.status} />;
  }

  // It IS the user's task → full collaborator actions
  return (
    <div className="flex gap-1.5">
      {task.status === "open" && (
        <Button variant="outline" size="sm" onClick={() => onStatusChange(task.id, "in-progress")}>
          <Play className="h-3.5 w-3.5 mr-1" /> Start Work
        </Button>
      )}
      {(task.status === "in-progress" || task.status === "revision") && (
        <Button variant="outline" size="sm" onClick={() => onSubmitClick(task.id)}>
          <Send className="h-3.5 w-3.5 mr-1" /> Submit
        </Button>
      )}
      {task.status === "in-review" && <span className="text-xs text-muted-foreground italic">Awaiting review</span>}
      {task.status === "approved"  && <span className="text-xs text-success italic">✓ Approved</span>}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

const ProjectWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, mentorRequests, sendMentorRequest, ownerCollaboratorMode, setOwnerCollaboratorMode } = useRole();

  const isOwner  = role === "project-owner";
  const isMentor = role === "mentor";
  const projectId = id || "1";

  // Resolve project data by id (fallback to project 1)
  const projectData = PROJECT_DATA[projectId] ?? PROJECT_DATA["1"];
  const projectInfo = { name: projectData.name, description: projectData.description, owner: projectData.owner, skills: projectData.skills, progress: projectData.progress };

  const [tasks,   setTasks]   = useState<Task[]>(projectData.tasks);
  const [members, setMembers] = useState(projectData.members);
  const [createTaskOpen,  setCreateTaskOpen]  = useState(false);
  const [mentorPanelOpen, setMentorPanelOpen] = useState(false);
  const [inviteOpen,      setInviteOpen]      = useState(false);
  const [inviteEmail,     setInviteEmail]     = useState("");
  const [newTask,         setNewTask]         = useState({ name: "", description: "", difficulty: "Medium", deadline: "", assigned: "" });
  const [proofDialogOpen, setProofDialogOpen] = useState(false);
  const [proofTaskId,     setProofTaskId]     = useState<string | null>(null);
  const [proofInput,      setProofInput]      = useState("");
  const [proofViewLink,   setProofViewLink]   = useState<string | null>(null);

  const projectRequests = mentorRequests.filter(r => r.projectId === projectId);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    toast.success(`Task status updated to ${newStatus.replace("-", " ")}`);
  };

  const handleProofSubmit = () => {
    if (!proofInput.trim()) { toast.error("Please enter a proof link"); return; }
    if (proofTaskId) {
      setTasks(prev => prev.map(t => t.id === proofTaskId ? { ...t, status: "in-review", proofLink: proofInput.trim() } : t));
      toast.success("Task submitted for review");
    }
    setProofInput("");
    setProofTaskId(null);
    setProofDialogOpen(false);
  };

  const assignCollaborator = (taskId: string, collaborator: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, assigned: collaborator } : t));
    toast.success(`Task assigned to ${collaborator}`);
  };

  const handleCreateTask = () => {
    if (!newTask.name || !newTask.deadline) { toast.error("Name and deadline are required"); return; }
    setTasks(prev => [...prev, {
      id: String(prev.length + 1),
      name: newTask.name,
      assigned: newTask.assigned || "Unassigned",
      difficulty: newTask.difficulty as Difficulty,
      deadline: newTask.deadline,
      status: "open",
    }]);
    setNewTask({ name: "", description: "", difficulty: "Medium", deadline: "", assigned: "" });
    setCreateTaskOpen(false);
    toast.success("Task created successfully");
  };

  const handleMentorRequest = (mentor: typeof availableMentors[0]) => {
    if (projectRequests.find(r => r.mentorName === mentor.name)) {
      toast.info(`Request already sent to ${mentor.name}`); return;
    }
    sendMentorRequest({ mentorName: mentor.name, mentorInitials: mentor.initials, expertise: mentor.expertise, projectId, projectName: projectInfo.name });
    toast.success(`Mentor request sent to ${mentor.name}!`);
  };

  const handleEmailInvite = () => {
    if (!inviteEmail.includes("@")) { toast.error("Enter a valid email address"); return; }
    const name = inviteEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
    setMembers(prev => prev.find(m => m.name === name) ? prev : [...prev, { name, initials, role: "Collaborator" }]);
    toast.success(`Invite sent to ${inviteEmail}`);
    setInviteEmail(""); setInviteOpen(false);
  };

  // ── Derived values ────────────────────────────────────────────────────────
  const completedTasks    = tasks.filter(t => t.status === "approved").length;
  const inProgressTasks   = tasks.filter(t => t.status === "in-progress" || t.status === "in-review").length;
  const isProjectComplete = tasks.length > 0 && completedTasks === tasks.length;

  // In owner-as-collaborator mode the "current user acting as collaborator" is still Arjun Sharma
  const collaboratorName = CURRENT_USER.name;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Completion banner */}
      {isProjectComplete && (
        <div className="bg-success/10 border border-success/30 rounded-xl px-5 py-4 flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center shrink-0">
            <Trophy className="h-5 w-5 text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground">Project Completed 🎉</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              All {tasks.length} tasks have been approved. This workspace is now archived and read-only.
              {isOwner && " XP and reputation have been distributed to all contributors."}
              {!isOwner && !isMentor && " Your XP and reputation gain has been recorded."}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-card border border-border rounded-lg px-2.5 py-1.5 shrink-0">
            <Lock className="h-3 w-3" /> Read-only
          </div>
        </div>
      )}
      <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-foreground">{projectInfo.name}</h1>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                {isOwner ? (ownerCollaboratorMode ? "Owner (Collaborator View)" : "Owner") : isMentor ? "Mentor (Read-only)" : "Collaborator"}
              </span>
              {projectRequests.filter(r => r.status === "accepted").length > 0 && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/20 text-accent-foreground flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {projectRequests.filter(r => r.status === "accepted").length} mentor(s) active
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{projectInfo.description}</p>
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {projectInfo.skills.map(skill => <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>)}
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 shrink-0">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-lg font-bold text-foreground">{projectInfo.progress}%</p>
              </div>
              <div className="w-32"><Progress value={projectInfo.progress} className="h-2" /></div>
            </div>
            {isOwner && (
              <div className="flex items-center gap-2">
                <UserCog className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="collab-toggle" className="text-xs text-muted-foreground cursor-pointer">Also work as collaborator</Label>
                <Switch id="collab-toggle" checked={ownerCollaboratorMode}
                  onCheckedChange={v => { setOwnerCollaboratorMode(v); toast.info(v ? "Collaborator view on" : "Back to owner view"); }} />
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Owned by <span className="font-medium text-foreground">{projectInfo.owner}</span></span>
          <span>·</span>
          <span>{members.length} members</span>
          {!isOwner && (
            <><span>·</span><span>You are <span className="font-medium text-foreground">{CURRENT_USER.name}</span></span></>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            {isOwner && <TabsTrigger value="mentors">Mentors {projectRequests.length > 0 && `(${projectRequests.length})`}</TabsTrigger>}
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          {isOwner && !ownerCollaboratorMode && (
            <Button variant="outline" size="sm" onClick={() => setMentorPanelOpen(true)}>
              <Shield className="h-4 w-4 mr-1" /> Request Mentor
            </Button>
          )}
        </div>

        {/* ══ OVERVIEW ══ */}
        <TabsContent value="overview" className="space-y-6">
          <div className={`grid gap-4 ${isOwner && !ownerCollaboratorMode ? "grid-cols-1 md:grid-cols-4" : "grid-cols-1 md:grid-cols-3"}`}>
            <StatBox label="Total Tasks"    value={tasks.length} />
            <StatBox label="Completed"      value={completedTasks}  className="text-success" />
            <StatBox label="In Progress"    value={inProgressTasks} className="text-info" />
            {isOwner && !ownerCollaboratorMode && <StatBox label="Active Collaborators" value={members.length - 1} className="text-accent" />}
          </div>

          {/* My tasks summary (collaborator or owner-as-collaborator) */}
          {(!isOwner || ownerCollaboratorMode) && !isMentor && (
            <div className="bg-card rounded-xl border border-border p-5 shadow-card">
              <h3 className="font-semibold text-sm mb-3">
                {ownerCollaboratorMode ? "Your Assigned Tasks (Owner-Collaborator)" : "Your Assigned Tasks"}
              </h3>
              <div className="space-y-2">
                {tasks.filter(t => t.assigned === collaboratorName).length === 0
                  ? <p className="text-sm text-muted-foreground italic">No tasks assigned to you yet.</p>
                  : tasks.filter(t => t.assigned === collaboratorName).map(t => (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-foreground">{t.name}</span>
                        <DifficultyBadge difficulty={t.difficulty} />
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusTag status={t.status} />
                        {t.proofLink && t.status === "in-review" && (
                          <button
                            onClick={() => setProofViewLink(t.proofLink!)}
                            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-info/10 text-info border border-info/20 hover:bg-info/20 transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" /> Proof
                          </button>
                        )}
                        <TaskActions task={t} isOwner={false} isMyTask={true} onStatusChange={updateTaskStatus} onSubmitClick={(id) => { setProofTaskId(id); setProofDialogOpen(true); }} isLocked={isProjectComplete} />
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {/* Task stats (owner-only view) */}
          {isOwner && !ownerCollaboratorMode && (
            <div className="bg-card rounded-xl border border-border p-5 shadow-card">
              <h3 className="font-semibold text-sm mb-3">Task Completion Statistics</h3>
              <div className="space-y-3">
                {(["approved", "in-review", "in-progress", "open"] as const).map(status => {
                  const count = tasks.filter(t => t.status === status).length;
                  return (
                    <div key={status} className="flex items-center gap-3">
                      <StatusTag status={status} />
                      <div className="flex-1"><Progress value={tasks.length ? (count / tasks.length) * 100 : 0} className="h-1.5" /></div>
                      <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>

        {/* ══ TASKS ══ */}
        <TabsContent value="tasks">
          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
            {isOwner && !ownerCollaboratorMode && !isProjectComplete && (
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-sm">Task Management</h3>
                <Button size="sm" onClick={() => setCreateTaskOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Create Task
                </Button>
              </div>
            )}
            {isMentor && (
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-sm">Task Overview</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Read-only view — you can monitor task progress and proof links.</p>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left p-4 font-medium text-muted-foreground">Task</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Difficulty</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Assigned</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Deadline</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    {!isMentor && <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => {
                    const isMyTask = task.assigned === collaboratorName;
                    const showOwnerControls = isOwner && !ownerCollaboratorMode;
                    return (
                      <ContextMenu key={task.id}>
                        <ContextMenuTrigger asChild>
                          <tr className="border-b border-border last:border-none hover:bg-secondary/30 transition-colors">
                            <td className="p-4 font-medium text-foreground">{task.name}</td>
                            <td className="p-4"><DifficultyBadge difficulty={task.difficulty} /></td>
                            <td className="p-4 text-muted-foreground">
                              {task.assigned}
                              {task.assigned === projectInfo.owner && <span className="ml-1 text-xs text-primary">(owner)</span>}
                              {task.assigned === CURRENT_USER.name && !isOwner && !isMentor && <span className="ml-1 text-xs text-primary">(you)</span>}
                              {task.assigned === collaboratorName && isOwner && ownerCollaboratorMode && <span className="ml-1 text-xs text-primary">(you)</span>}
                            </td>
                            <td className="p-4 text-muted-foreground">{task.deadline}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <StatusTag status={task.status} />
                                {task.proofLink && task.status === "in-review" && (
                                  <button
                                    onClick={() => setProofViewLink(task.proofLink!)}
                                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-info/10 text-info border border-info/20 hover:bg-info/20 transition-colors"
                                  >
                                    <ExternalLink className="h-3 w-3" /> Proof
                                  </button>
                                )}
                              </div>
                            </td>
                            {!isMentor && (
                              <td className="p-4">
                                <TaskActions
                                  task={task}
                                  isOwner={showOwnerControls}
                                  isMyTask={isMyTask}
                                  onStatusChange={updateTaskStatus}
                                  onSubmitClick={(id) => { setProofTaskId(id); setProofDialogOpen(true); }}
                                  isLocked={isProjectComplete}
                                />
                              </td>
                            )}
                          </tr>
                        </ContextMenuTrigger>
                        {showOwnerControls && !isProjectComplete && (
                          <ContextMenuContent>
                            {members.map(m => (
                              <ContextMenuItem key={m.name} onClick={() => assignCollaborator(task.id, m.name)}>
                                <UserPlus className="h-3.5 w-3.5 mr-2" /> Assign to {m.name}
                              </ContextMenuItem>
                            ))}
                          </ContextMenuContent>
                        )}
                      </ContextMenu>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ══ MEMBERS ══ */}
        <TabsContent value="members">
          <div className="space-y-4">
            {isOwner && !ownerCollaboratorMode && (
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setInviteOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-1" /> Invite Member
                </Button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map(m => {
                const memberTasks = tasks.filter(t => t.assigned === m.name);
                return (
                  <ContextMenu key={m.name}>
                    <ContextMenuTrigger>
                      <div className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                            {m.initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-foreground">{m.name}</p>
                              {m.name === CURRENT_USER.name && <Badge variant="outline" className="text-xs py-0">you</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground">{m.role}</p>
                          </div>
                        </div>
                        {memberTasks.length > 0
                          ? <div className="space-y-1.5">
                              {memberTasks.map(t => (
                                <div key={t.id} className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground truncate">{t.name}</span>
                                  <StatusTag status={t.status} />
                                </div>
                              ))}
                            </div>
                          : <p className="text-xs text-muted-foreground">No tasks assigned</p>
                        }
                      </div>
                    </ContextMenuTrigger>
                    {isOwner && !ownerCollaboratorMode && m.role !== "Owner" && (
                      <ContextMenuContent>
                        {tasks.filter(t => t.assigned === "Unassigned").map(t => (
                          <ContextMenuItem key={t.id} onClick={() => assignCollaborator(t.id, m.name)}>
                            Assign "{t.name}"
                          </ContextMenuItem>
                        ))}
                        {tasks.filter(t => t.assigned === "Unassigned").length === 0 && (
                          <ContextMenuItem disabled>No unassigned tasks</ContextMenuItem>
                        )}
                      </ContextMenuContent>
                    )}
                  </ContextMenu>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* ══ MENTORS (owner only) ══ */}
        {isOwner && (
          <TabsContent value="mentors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Mentor Requests</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Track mentorship requests for this project.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setMentorPanelOpen(true)}>
                  <Shield className="h-4 w-4 mr-1" /> Request New Mentor
                </Button>
              </div>
              {projectRequests.length === 0
                ? <div className="bg-card rounded-xl border border-border p-8 text-center">
                    <Shield className="h-10 w-10 mx-auto mb-2 text-muted-foreground opacity-40" />
                    <p className="text-sm text-muted-foreground">No mentor requests sent yet.</p>
                  </div>
                : <div className="space-y-3">
                    {projectRequests.map(req => (
                      <div key={req.mentorName} className="bg-card rounded-xl border border-border p-5 shadow-card flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm">{req.mentorInitials}</div>
                          <div>
                            <p className="font-medium text-foreground">{req.mentorName}</p>
                            <p className="text-xs text-muted-foreground">{req.expertise}</p>
                            <p className="text-xs text-muted-foreground">Requested on {req.sentAt}</p>
                          </div>
                        </div>
                        <div>
                          {req.status === "pending"  && <Badge variant="outline" className="text-warning border-warning/40 gap-1"><Clock className="h-3 w-3" /> Pending</Badge>}
                          {req.status === "accepted" && <Badge className="bg-success/10 text-success border-success/30 gap-1"><CheckCheck className="h-3 w-3" /> Accepted</Badge>}
                          {req.status === "rejected" && <Badge variant="outline" className="text-destructive border-destructive/30 gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </TabsContent>
        )}

        {/* ══ CHAT ══ */}
        <TabsContent value="chat"><ChatPanel /></TabsContent>
      </Tabs>

      {/* ── Create Task Dialog ── */}
      <Dialog open={createTaskOpen} onOpenChange={setCreateTaskOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Add a new task to the project.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input placeholder="Task name" value={newTask.name} onChange={e => setNewTask(p => ({ ...p, name: e.target.value }))} />
            <Textarea placeholder="Description (optional)" value={newTask.description} onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))} />
            <div className="grid grid-cols-2 gap-3">
              <Select value={newTask.difficulty} onValueChange={v => setNewTask(p => ({ ...p, difficulty: v }))}>
                <SelectTrigger><SelectValue placeholder="Difficulty" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <Input type="text" placeholder="Deadline (e.g. Mar 30)" value={newTask.deadline} onChange={e => setNewTask(p => ({ ...p, deadline: e.target.value }))} />
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5"><Users className="h-4 w-4" /> Assign to Member</p>
              <Select value={newTask.assigned} onValueChange={v => setNewTask(p => ({ ...p, assigned: v }))}>
                <SelectTrigger><SelectValue placeholder="Assign to (optional)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unassigned">Unassigned</SelectItem>
                  {members.map(m => (
                    <SelectItem key={m.name} value={m.name}>{m.name}{m.name === projectInfo.owner ? " (you)" : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5"><Mail className="h-4 w-4" /> Or Invite New Member via Email</p>
              <div className="flex gap-2">
                <Input placeholder="colleague@example.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
                <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={() => {
                  if (!inviteEmail.includes("@")) { toast.error("Enter a valid email"); return; }
                  const name = inviteEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
                  const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
                  setMembers(prev => prev.find(m => m.name === name) ? prev : [...prev, { name, initials, role: "Collaborator" }]);
                  setNewTask(p => ({ ...p, assigned: name }));
                  toast.success(`${inviteEmail} invited and set as assignee`);
                  setInviteEmail("");
                }}>Invite</Button>
              </div>
            </div>
            <Button className="w-full" onClick={handleCreateTask}>Create Task</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Invite Member Dialog ── */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>View current members or invite someone new via email.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Current Members</p>
              <div className="space-y-2">
                {members.map(m => (
                  <div key={m.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/30">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">{m.initials}</div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5"><Mail className="h-4 w-4" /> Invite via Email</p>
              <div className="flex gap-2">
                <Input placeholder="email@example.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleEmailInvite()} />
                <Button onClick={handleEmailInvite} className="shrink-0">Send Invite</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">They'll receive an email invitation to join this project.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Request Mentor Dialog ── */}
      <Dialog open={mentorPanelOpen} onOpenChange={setMentorPanelOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request a Mentor</DialogTitle>
            <DialogDescription>Browse available mentors and send a mentorship request.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            {availableMentors.map(mentor => {
              const existing = projectRequests.find(r => r.mentorName === mentor.name);
              return (
                <div key={mentor.name} className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/20">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-sm font-bold">{mentor.initials}</div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{mentor.name}</p>
                      <p className="text-xs text-muted-foreground">{mentor.expertise}</p>
                      <p className="text-xs text-muted-foreground">{mentor.experience} experience</p>
                    </div>
                  </div>
                  {existing
                    ? <Badge variant="outline" className={
                        existing.status === "accepted" ? "text-success border-success/40 gap-1" :
                        existing.status === "rejected" ? "text-destructive border-destructive/30 gap-1" :
                        "text-warning border-warning/40 gap-1"
                      }>
                        {existing.status === "accepted" && <CheckCheck className="h-3 w-3" />}
                        {existing.status === "pending"  && <Clock className="h-3 w-3" />}
                        {existing.status === "rejected" && <XCircle className="h-3 w-3" />}
                        {existing.status.charAt(0).toUpperCase() + existing.status.slice(1)}
                      </Badge>
                    : <Button size="sm" variant="outline" onClick={() => handleMentorRequest(mentor)}>
                        <Shield className="h-3.5 w-3.5 mr-1" /> Request
                      </Button>
                  }
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
      {/* ── Proof Link Upload Dialog ── */}
      <Dialog open={proofDialogOpen} onOpenChange={open => { setProofDialogOpen(open); if (!open) setProofInput(""); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Proof of Work</DialogTitle>
            <DialogDescription>Paste a link to your proof (GitHub PR, Figma, Google Doc, etc.) before submitting for review.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              placeholder="https://github.com/..."
              value={proofInput}
              onChange={e => setProofInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleProofSubmit()}
            />
            <Button className="w-full" onClick={handleProofSubmit}>
              <Send className="h-4 w-4 mr-2" /> Submit for Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Proof View Dialog ── */}
      <Dialog open={!!proofViewLink} onOpenChange={open => { if (!open) setProofViewLink(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Proof of Work</DialogTitle>
            <DialogDescription>Link submitted by the collaborator for review.</DialogDescription>
          </DialogHeader>
          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/40 border border-border break-all">
              <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-foreground">{proofViewLink}</span>
            </div>
            <a href={proofViewLink ?? "#"} target="_blank" rel="noreferrer" className="block">
              <Button variant="outline" className="w-full gap-2">
                <ExternalLink className="h-4 w-4" /> Open Link
              </Button>
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectWorkspace;
