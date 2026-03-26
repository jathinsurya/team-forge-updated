import { useRole, Role, CURRENT_USER } from "@/contexts/RoleContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, ChevronDown, Search, Lock, Award } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const roleLabels: Record<Role, string> = {
  collaborator:    "Collaborator",
  "project-owner": "Project Owner",
  mentor:          "Mentor",
};

const roleBadgeColors: Record<Role, string> = {
  collaborator:    "bg-info/10 text-info border-info/20",
  "project-owner": "bg-primary/10 text-primary border-primary/20",
  mentor:          "bg-accent/15 text-accent border-accent/30",
};

export function AppHeader() {
  const { role, setRole, mentorApproved } = useRole();
  const navigate = useNavigate();

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 gap-4 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-foreground">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">TF</span>
          </div>
          <span className="hidden sm:inline">TeamForge</span>
        </Link>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search projects, tasks, people..." className="pl-9 bg-secondary border-none h-9 text-sm" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Role Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`gap-1.5 text-sm font-medium h-9 border ${roleBadgeColors[role]}`}
            >
              {role === "mentor" && <Award className="h-3.5 w-3.5" />}
              {roleLabels[role]}
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-2 py-1.5 mb-1">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Switch Role</p>
            </div>

            <DropdownMenuItem
              onClick={() => setRole("collaborator")}
              className={`gap-2 ${role === "collaborator" ? "bg-secondary font-medium" : ""}`}
            >
              <span className="h-2 w-2 rounded-full bg-info shrink-0" />
              Collaborator
              {role === "collaborator" && <span className="ml-auto text-[10px] text-muted-foreground">Active</span>}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setRole("project-owner")}
              className={`gap-2 ${role === "project-owner" ? "bg-secondary font-medium" : ""}`}
            >
              <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
              Project Owner
              {role === "project-owner" && <span className="ml-auto text-[10px] text-muted-foreground">Active</span>}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                if (mentorApproved) setRole("mentor");
                else navigate("/mentor-application");
              }}
              className={`gap-2 ${role === "mentor" ? "bg-secondary font-medium" : ""} ${!mentorApproved ? "opacity-70" : ""}`}
            >
              {mentorApproved
                ? <Award className="h-3.5 w-3.5 text-accent shrink-0" />
                : <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              }
              Mentor
              {mentorApproved && role !== "mentor" && (
                <span className="ml-auto text-[10px] text-accent font-semibold">Unlocked</span>
              )}
              {role === "mentor" && <span className="ml-auto text-[10px] text-muted-foreground">Active</span>}
              {!mentorApproved && <span className="ml-auto text-[10px] text-muted-foreground">Apply →</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9" onClick={() => navigate("/notifications")}>
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        {/* Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full hover:opacity-90 transition-opacity">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold ${
                role === "mentor" ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
              }`}>
                {CURRENT_USER.initials}
              </div>
              <span className="hidden lg:block text-sm font-medium text-foreground max-w-28 truncate">
                {CURRENT_USER.name}
              </span>
              <ChevronDown className="hidden lg:block h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-3 py-2.5 border-b border-border mb-1">
              <p className="text-sm font-semibold text-foreground">{CURRENT_USER.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {role === "mentor" && <Award className="h-3 w-3 text-accent" />}
                <p className="text-xs text-muted-foreground">{roleLabels[role]}</p>
              </div>
            </div>
            <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/help")}>Help & Support</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/admin/login")}
              className="text-xs text-muted-foreground"
            >
              Admin Portal ↗
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
