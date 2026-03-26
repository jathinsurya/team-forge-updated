import { useRole } from "@/contexts/RoleContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, CheckCircle2, XCircle, Star } from "lucide-react";
import { toast } from "sonner";

const mentorList = [
  { name: "Dr. Divya Krishnan", initials: "DK", expertise: "Machine Learning, Data Science", rating: 4.9, projects: 12 },
  { name: "Prof. Anil Gupta", initials: "AG", expertise: "Web Development, Cloud Architecture", rating: 4.8, projects: 8 },
  { name: "Meera Pillai", initials: "MP", expertise: "UI/UX Design, Product Management", rating: 4.7, projects: 15 },
];

// For demo: the current project in context when browsing from My Projects
const DEMO_PROJECT = { id: "1", name: "AI Study Planner" };

const Mentors = () => {
  const { mentorRequests, sendMentorRequest } = useRole();

  const handleRequest = (mentor: typeof mentorList[0]) => {
    const existing = mentorRequests.find(r => r.mentorName === mentor.name && r.projectId === DEMO_PROJECT.id);
    if (existing) {
      toast.info(`You already sent a request to ${mentor.name}`);
      return;
    }
    sendMentorRequest({
      mentorName: mentor.name,
      mentorInitials: mentor.initials,
      expertise: mentor.expertise,
      projectId: DEMO_PROJECT.id,
      projectName: DEMO_PROJECT.name,
    });
    toast.success(`Mentor request sent to ${mentor.name} for "${DEMO_PROJECT.name}"`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mentors</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse available mentors and invite them to guide your project.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mentorList.map((m) => {
          const req = mentorRequests.find(r => r.mentorName === m.name && r.projectId === DEMO_PROJECT.id);
          return (
            <div key={m.name} className="bg-card rounded-xl border border-border p-5 shadow-card">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold shrink-0">
                    {m.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.expertise}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-warning fill-warning" />
                  {m.rating} · {m.projects} projects mentored
                </span>
                {req ? (
                  <Badge
                    variant="outline"
                    className={
                      req.status === "accepted" ? "text-success border-success/40 gap-1" :
                      req.status === "rejected" ? "text-destructive border-destructive/30 gap-1" :
                      "text-warning border-warning/40 gap-1"
                    }
                  >
                    {req.status === "accepted" && <CheckCircle2 className="h-3 w-3" />}
                    {req.status === "pending" && <Clock className="h-3 w-3" />}
                    {req.status === "rejected" && <XCircle className="h-3 w-3" />}
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </Badge>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => handleRequest(m)}>
                    <Shield className="h-3.5 w-3.5 mr-1" /> Request
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Mentors;
