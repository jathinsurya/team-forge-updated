import { useRole } from "@/contexts/RoleContext";
import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Trophy,
  Bell,
  User,
  Settings,
  HelpCircle,
  FolderOpen,
  FileCheck,
  Briefcase,
  PlusCircle,
  FolderKanban,
  Users,
  BookOpen,
  Star,
} from "lucide-react";

const globalItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help & Support", url: "/help", icon: HelpCircle },
];

const collaboratorItems = [
  { title: "Projects", url: "/projects", icon: FolderOpen },
  { title: "Applied Projects", url: "/applied-projects", icon: FileCheck },
  { title: "My Work", url: "/my-work", icon: Briefcase },
];

const ownerItems = [
  { title: "Create Project", url: "/create-project", icon: PlusCircle },
  { title: "My Projects", url: "/my-projects", icon: FolderKanban },
  { title: "Mentors", url: "/mentors", icon: Users },
];

const mentorItems = [
  { title: "Mentor Requests", url: "/mentor-requests", icon: BookOpen },
  { title: "Mentored Projects", url: "/mentored-projects", icon: Star },
];

export function AppSidebar() {
  const { role } = useRole();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const roleItems =
    role === "collaborator" ? collaboratorItems :
    role === "project-owner" ? ownerItems :
    mentorItems;

  const roleLabel =
    role === "collaborator" ? "Collaborator" :
    role === "project-owner" ? "Project Owner" :
    "Mentor";

  const renderItems = (items: typeof globalItems) =>
    items.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild>
          <NavLink
            to={item.url}
            end={item.url === "/"}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-secondary"
            activeClassName="bg-secondary text-primary font-semibold"
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent className="pt-2">
        <div className="px-3 mb-2">
          <SidebarTrigger />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground px-3">
            Global
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(globalItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mx-3 my-2 border-t border-border" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground px-3">
            {!collapsed ? roleLabel : "Role"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(roleItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
