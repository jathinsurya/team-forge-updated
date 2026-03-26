import { StatCard } from "@/components/shared/StatCard";
import { useRole, CURRENT_USER } from "@/contexts/RoleContext";
import { Zap, Star, FolderOpen, CheckCircle2, Clock, ExternalLink, Award, Users, BookOpen, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

// ── Collaborator / Owner data ──────────────────────────────────────────────
const collabActivity = [
  { id: "1", action: "Submitted task",    project: "AI Study Planner",  time: "2 hours ago" },
  { id: "2", action: "Joined project",    project: "Campus Events App", time: "1 day ago"   },
  { id: "3", action: "Task approved",     project: "AI Study Planner",  time: "2 days ago"  },
  { id: "4", action: "Earned 40 XP",      project: "EcoTracker",        time: "3 days ago"  },
];

const contributions = [
  { id: "1", project: "AI Study Planner",  contribution: "Built recommendation engine", evidence: "PR #42",        status: "Approved"  },
  { id: "2", project: "Campus Events App", contribution: "Designed event cards UI",     evidence: "Commit abc123", status: "Approved"  },
  { id: "3", project: "EcoTracker",        contribution: "Integrated carbon API",       evidence: "PR #18",        status: "In Review" },
];

// ── Mentor data ────────────────────────────────────────────────────────────
const mentorActivity = [
  { id: "1", action: "Accepted mentorship request",    project: "EcoTracker",         time: "1 hour ago"  },
  { id: "2", action: "Gave feedback on task",          project: "AI Study Planner",   time: "3 hours ago" },
  { id: "3", action: "New mentor request received",    project: "Code Review Hub",    time: "1 day ago"   },
  { id: "4", action: "Awarded Mentor Badge",           project: "EcoTracker",         time: "2 days ago"  },
];

const mentorCheckIns = [
  { project: "EcoTracker",       date: "Mar 12, 2026", members: 3, status: "Upcoming"  },
  { project: "Study Group Finder", date: "Mar 15, 2026", members: 2, status: "Upcoming" },
];

// ── Main ───────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { role, userSkills } = useRole();
  const navigate = useNavigate();
  const isMentor = role === "mentor";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, {CURRENT_USER.name}!
            {isMentor && <span className="ml-2 inline-flex items-center gap-1 text-accent font-medium"><Award className="h-3.5 w-3.5" /> Mentor</span>}
          </p>
        </div>
        {isMentor && (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => navigate("/mentor-requests")}>View Requests</Button>
            <Button size="sm" variant="outline" onClick={() => navigate("/mentored-projects")}>My Projects</Button>
          </div>
        )}
      </div>

      {/* Stat Cards — different for mentor */}
      {isMentor ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Projects Mentored" value="2"    icon={BookOpen}     color="accent"   />
          <StatCard label="Pending Requests"  value="2"    icon={Clock}        color="warning"  trend="2 awaiting response" />
          <StatCard label="Badges Awarded"    value="1"    icon={Award}        color="success"  />
          <StatCard label="Team Members"      value="5"    icon={Users}        color="primary"  />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="XP Points"       value="2,450" icon={Zap}          trend="+120 this week"  color="accent"  />
          <StatCard label="Reputation"      value="87"    icon={Star}         trend="+5 this month"   color="primary" />
          <StatCard label="Active Projects" value="3"     icon={FolderOpen}                           color="info"    />
          <StatCard label="Completed Tasks" value="24"    icon={CheckCircle2}                         color="success" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h2 className="font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {(isMentor ? mentorActivity : collabActivity).map(item => (
              <div key={item.id} className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${isMentor ? "bg-accent/10" : "bg-secondary"}`}>
                  {isMentor
                    ? <Award className="h-4 w-4 text-accent" />
                    : <Clock className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.project}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mentor: upcoming check-ins | Others: skills */}
        {isMentor ? (
          <div className="bg-card rounded-xl border border-border p-5 shadow-card">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Upcoming Check-ins
            </h2>
            <div className="space-y-3">
              {mentorCheckIns.map(c => (
                <div key={c.project} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{c.project}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Users className="h-3 w-3" /> {c.members} members · {c.date}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs text-warning border-warning/40">{c.status}</Badge>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => navigate("/mentored-projects")}>
                View All Mentored Projects
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-5 shadow-card">
            <h2 className="font-semibold text-foreground mb-4">My Skills</h2>
            {userSkills.length === 0
              ? <p className="text-sm text-muted-foreground italic">No skills added yet. Add them in Settings → Profile.</p>
              : <div className="flex flex-wrap gap-2">
                  {userSkills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">{skill}</Badge>
                  ))}
                </div>
            }
          </div>
        )}
      </div>

      {/* Mentor: pending requests summary | Others: contribution history */}
      {isMentor ? (
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" /> Pending Mentor Requests
            </h2>
            <Button size="sm" variant="outline" onClick={() => navigate("/mentor-requests")}>See All</Button>
          </div>
          <div className="space-y-3">
            {[
              { project: "AI Study Planner",  owner: "Arjun Sharma", skills: ["React", "ML"],          members: 3 },
              { project: "Code Review Hub",   owner: "Vikram Nair",  skills: ["Git API", "Node.js"],   members: 2 },
            ].map(r => (
              <div key={r.project} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{r.project}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">by {r.owner} · {r.members} members</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {r.skills.map(s => (
                      <span key={s} className="text-[11px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{s}</span>
                    ))}
                  </div>
                  <Badge variant="outline" className="text-xs text-warning border-warning/40">Pending</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h2 className="font-semibold text-foreground mb-4">Contribution History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-3 font-medium text-muted-foreground">Project</th>
                  <th className="text-left pb-3 font-medium text-muted-foreground">Contribution</th>
                  <th className="text-left pb-3 font-medium text-muted-foreground">Evidence</th>
                  <th className="text-left pb-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map(c => (
                  <tr key={c.id} className="border-b border-border last:border-none">
                    <td className="py-3 font-medium text-foreground">{c.project}</td>
                    <td className="py-3 text-muted-foreground">{c.contribution}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 text-info text-xs font-medium">
                        <ExternalLink className="h-3 w-3" /> {c.evidence}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.status === "Approved" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
