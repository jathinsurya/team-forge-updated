import React, { createContext, useContext, useState } from "react";

export type Role = "collaborator" | "project-owner" | "mentor";

export interface MentorRequest {
  mentorName: string;
  mentorInitials: string;
  expertise: string;
  projectId: string;
  projectName: string;
  status: "pending" | "accepted" | "rejected";
  sentAt: string;
}

// Arjun Sharma — single logged-in user across all roles
export const CURRENT_USER = {
  name:       "Arjun Sharma",
  initials:   "AS",
  username:   "arjunsharma",
  title:      "Full-stack Developer",
  university: "IIT Delhi",
};

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  // mentorApproved can be set locally (demo) OR by admin panel
  mentorApproved: boolean;
  setMentorApproved: (v: boolean) => void;
  mentorRequests: MentorRequest[];
  sendMentorRequest: (req: Omit<MentorRequest, "status" | "sentAt">) => void;
  updateMentorRequestStatus: (mentorName: string, projectId: string, status: "accepted" | "rejected") => void;
  ownerCollaboratorMode: boolean;
  setOwnerCollaboratorMode: (v: boolean) => void;
  userSkills: string[];
  setUserSkills: (skills: string[]) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>("collaborator");
  const [mentorApproved, setMentorApproved] = useState(false);
  const [mentorRequests, setMentorRequests] = useState<MentorRequest[]>([]);
  const [ownerCollaboratorMode, setOwnerCollaboratorMode] = useState(false);
  const [userSkills, setUserSkills] = useState<string[]>(["React", "TypeScript", "Python", "Node.js", "PostgreSQL"]);

  const sendMentorRequest = (req: Omit<MentorRequest, "status" | "sentAt">) => {
    setMentorRequests(prev => {
      const exists = prev.find(r => r.mentorName === req.mentorName && r.projectId === req.projectId);
      if (exists) return prev;
      return [...prev, { ...req, status: "pending", sentAt: new Date().toLocaleDateString() }];
    });
  };

  const updateMentorRequestStatus = (mentorName: string, projectId: string, status: "accepted" | "rejected") => {
    setMentorRequests(prev =>
      prev.map(r => r.mentorName === mentorName && r.projectId === projectId ? { ...r, status } : r)
    );
  };

  return (
    <RoleContext.Provider value={{
      role, setRole,
      mentorApproved, setMentorApproved,
      mentorRequests, sendMentorRequest, updateMentorRequestStatus,
      ownerCollaboratorMode, setOwnerCollaboratorMode,
      userSkills, setUserSkills,
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
};
