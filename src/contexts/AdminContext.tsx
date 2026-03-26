import React, { createContext, useContext, useState } from "react";

export interface MentorApplication {
  id: string;
  userName: string;
  userInitials: string;
  university: string;
  linkedin: string;
  expertise: string;
  experience: number;
  motivation: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

export interface PlatformUser {
  id: string;
  name: string;
  initials: string;
  university: string;
  role: string;
  xp: number;
  reputation: number;
  status: "active" | "warned" | "suspended";
  joinedAt: string;
  projects: number;
  flagged: boolean;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  target: string;
  details: string;
  type: "task" | "xp" | "reputation" | "warning" | "suspension" | "mentor" | "system";
}

export interface AdminContextType {
  adminLoggedIn: boolean;
  setAdminLoggedIn: (v: boolean) => void;
  mentorApplications: MentorApplication[];
  approveMentorApplication: (id: string) => void;
  rejectMentorApplication: (id: string) => void;
  // Shared flag read by RoleContext to unlock mentor
  globalMentorApproved: boolean;
  users: PlatformUser[];
  warnUser: (id: string) => void;
  suspendUser: (id: string) => void;
  reinstateUser: (id: string) => void;
  auditLog: AuditEntry[];
  addAuditEntry: (entry: Omit<AuditEntry, "id" | "timestamp">) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// ── Seed data ──────────────────────────────────────────────────────────────
const seedApplications: MentorApplication[] = [
  {
    id: "app-1",
    userName: "Arjun Sharma",
    userInitials: "AS",
    university: "IIT Delhi",
    linkedin: "https://linkedin.com/in/arjunsharma",
    expertise: "Full-stack Development, React, Node.js",
    experience: 5,
    motivation: "I want to help students navigate the challenges I faced early in my career, especially around building real production systems from scratch.",
    submittedAt: "Mar 6, 2026",
    status: "pending",
  },
  {
    id: "app-2",
    userName: "Priya Patel",
    userInitials: "PP",
    university: "BITS Pilani",
    linkedin: "https://linkedin.com/in/priyapatel",
    expertise: "Backend Engineering, Kubernetes, AWS",
    experience: 6,
    motivation: "Having mentored junior engineers at my company for 3 years, I want to extend that to students building their first real projects.",
    submittedAt: "Mar 5, 2026",
    status: "approved",
  },
  {
    id: "app-3",
    userName: "Kiran Bose",
    userInitials: "KB",
    university: "IIIT Hyderabad",
    linkedin: "https://linkedin.com/in/kiranbose",
    expertise: "Data Science, Python, ML",
    experience: 2,
    motivation: "Passionate about teaching data science concepts to beginners.",
    submittedAt: "Mar 4, 2026",
    status: "rejected",
  },
];

const seedUsers: PlatformUser[] = [
  { id: "u1", name: "Arjun Sharma",    initials: "AS", university: "IIT Delhi",      role: "Owner / Collaborator", xp: 2450, reputation: 87,  status: "active",    joinedAt: "Dec 2022", projects: 5,  flagged: false },
  { id: "u2", name: "Rohan Mehta",     initials: "RM", university: "NIT Trichy",     role: "Collaborator",         xp: 3400, reputation: 89,  status: "active",    joinedAt: "Feb 2023", projects: 6,  flagged: false },
  { id: "u3", name: "Sneha Iyer",      initials: "SI", university: "VIT Vellore",    role: "Owner / Collaborator", xp: 2100, reputation: 82,  status: "active",    joinedAt: "Apr 2023", projects: 4,  flagged: false },
  { id: "u4", name: "Priya Patel",     initials: "PP", university: "BITS Pilani",    role: "Mentor / Collaborator",xp: 3850, reputation: 93,  status: "active",    joinedAt: "Mar 2023", projects: 7,  flagged: false },
  { id: "u5", name: "Vikram Nair",     initials: "VN", university: "IIT Madras",     role: "Project Owner",        xp: 1800, reputation: 71,  status: "warned",    joinedAt: "Jun 2023", projects: 3,  flagged: true  },
  { id: "u6", name: "Ananya Reddy",    initials: "AR", university: "Manipal Inst.",  role: "Owner / Collaborator", xp: 2900, reputation: 85,  status: "active",    joinedAt: "Jan 2023", projects: 5,  flagged: false },
  { id: "u7", name: "Kiran Bose",      initials: "KB", university: "IIIT Hyderabad", role: "Collaborator",         xp: 950,  reputation: 60,  status: "suspended", joinedAt: "Aug 2023", projects: 2,  flagged: true  },
  { id: "u8", name: "Meera Pillai",    initials: "MP", university: "NIT Calicut",    role: "Collaborator",         xp: 1200, reputation: 68,  status: "active",    joinedAt: "Sep 2023", projects: 3,  flagged: false },
];

const seedAudit: AuditEntry[] = [
  { id: "a1",  timestamp: "Mar 8, 2026 · 10:42 AM", event: "Task Approved",          actor: "Arjun Sharma",  target: "Set up project structure",    details: "+50 XP awarded to Arjun Sharma",                  type: "task"       },
  { id: "a2",  timestamp: "Mar 8, 2026 · 09:15 AM", event: "Mentor App Submitted",   actor: "Arjun Sharma",  target: "Mentor Application #app-1",   details: "Awaiting admin review",                           type: "mentor"     },
  { id: "a3",  timestamp: "Mar 7, 2026 · 04:30 PM", event: "Warning Issued",         actor: "Admin",         target: "Vikram Nair",                 details: "Suspicious task submission flagged · −15 rep",    type: "warning"    },
  { id: "a4",  timestamp: "Mar 7, 2026 · 02:11 PM", event: "XP Awarded",             actor: "System",        target: "Rohan Mehta",                 details: "+80 XP for task 'Event Map View'",                 type: "xp"         },
  { id: "a5",  timestamp: "Mar 7, 2026 · 11:05 AM", event: "Mentor App Approved",    actor: "Admin",         target: "Priya Patel",                 details: "Mentor privileges granted",                       type: "mentor"     },
  { id: "a6",  timestamp: "Mar 6, 2026 · 05:48 PM", event: "Account Suspended",      actor: "Admin",         target: "Kiran Bose",                  details: "Repeated policy violations",                      type: "suspension" },
  { id: "a7",  timestamp: "Mar 6, 2026 · 03:22 PM", event: "Reputation Updated",     actor: "System",        target: "Sneha Iyer",                  details: "Reputation +5 · approved task streak",            type: "reputation" },
  { id: "a8",  timestamp: "Mar 6, 2026 · 09:00 AM", event: "Mentor App Rejected",    actor: "Admin",         target: "Kiran Bose",                  details: "Insufficient experience (2 yrs, min 4 required)", type: "mentor"     },
  { id: "a9",  timestamp: "Mar 5, 2026 · 02:14 PM", event: "Task Approved",          actor: "Ananya Reddy",  target: "Carbon footprint tracker",    details: "+100 XP awarded to Kiran Bose",                   type: "task"       },
  { id: "a10", timestamp: "Mar 5, 2026 · 10:30 AM", event: "System Health Check",    actor: "System",        target: "Platform",                    details: "All services operational",                        type: "system"     },
];

// ── Provider ───────────────────────────────────────────────────────────────
export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [applications, setApplications] = useState<MentorApplication[]>(seedApplications);
  const [users, setUsers] = useState<PlatformUser[]>(seedUsers);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(seedAudit);

  const addAuditEntry = (entry: Omit<AuditEntry, "id" | "timestamp">) => {
    const now = new Date();
    const timestamp = now.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
      + " · " + now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setAuditLog(prev => [{ ...entry, id: `a${Date.now()}`, timestamp }, ...prev]);
  };

  const approveMentorApplication = (id: string) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: "approved" } : a));
    const app = applications.find(a => a.id === id);
    if (app) addAuditEntry({ event: "Mentor App Approved", actor: "Admin", target: app.userName, details: "Mentor privileges granted", type: "mentor" });
  };

  const rejectMentorApplication = (id: string) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: "rejected" } : a));
    const app = applications.find(a => a.id === id);
    if (app) addAuditEntry({ event: "Mentor App Rejected", actor: "Admin", target: app.userName, details: "Application did not meet eligibility criteria", type: "mentor" });
  };

  const warnUser = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "warned", reputation: Math.max(0, u.reputation - 15) } : u));
    const user = users.find(u => u.id === id);
    if (user) addAuditEntry({ event: "Warning Issued", actor: "Admin", target: user.name, details: "−15 reputation for policy violation", type: "warning" });
  };

  const suspendUser = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "suspended" } : u));
    const user = users.find(u => u.id === id);
    if (user) addAuditEntry({ event: "Account Suspended", actor: "Admin", target: user.name, details: "Account access restricted by admin", type: "suspension" });
  };

  const reinstateUser = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "active", flagged: false } : u));
    const user = users.find(u => u.id === id);
    if (user) addAuditEntry({ event: "Account Reinstated", actor: "Admin", target: user.name, details: "Account access restored", type: "system" });
  };

  // Arjun's application is approved if app-1 is approved
  const globalMentorApproved = applications.find(a => a.id === "app-1")?.status === "approved";

  return (
    <AdminContext.Provider value={{
      adminLoggedIn, setAdminLoggedIn,
      mentorApplications: applications,
      approveMentorApplication, rejectMentorApplication,
      globalMentorApproved,
      users, warnUser, suspendUser, reinstateUser,
      auditLog, addAuditEntry,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
};
