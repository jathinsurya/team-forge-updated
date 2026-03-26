import { Bell, FolderOpen, CheckCircle2, Users, MessageSquare, Star } from "lucide-react";

const notifications = [
  { id: "1", icon: FolderOpen, title: "Project Invitation", desc: "You've been invited to join 'Campus Events App'", time: "10 min ago", unread: true },
  { id: "2", icon: CheckCircle2, title: "Application Approved", desc: "Your application to 'AI Study Planner' was approved!", time: "1 hour ago", unread: true },
  { id: "3", icon: Star, title: "Task Approved", desc: "Your task 'Build Auth Module' was approved by the project owner.", time: "3 hours ago", unread: false },
  { id: "4", icon: Users, title: "Mentor Request", desc: "A project owner requested your mentorship for 'EcoTracker'.", time: "1 day ago", unread: false },
  { id: "5", icon: MessageSquare, title: "New Message", desc: "Dr. Divya Krishnan sent a message in 'AI Study Planner' chat.", time: "1 day ago", unread: false },
  { id: "6", icon: Bell, title: "Project Update", desc: "'Campus Events App' reached 75% completion.", time: "2 days ago", unread: false },
];

const Notifications = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">Stay updated on your projects and tasks.</p>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card divide-y divide-border">
        {notifications.map((n) => (
          <div key={n.id} className={`flex items-start gap-4 p-4 ${n.unread ? "bg-secondary/30" : ""}`}>
            <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <n.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                {n.unread && <span className="h-2 w-2 rounded-full bg-info shrink-0" />}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{n.desc}</p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
