import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// Project data with full member names (not initials)
const projectsData: Record<string, {
  name: string; description: string; owner: string;
  skills: string[]; progress: number;
  members: { name: string; initials: string; role: string }[];
}> = {
  "1": {
    name: "AI Study Planner",
    description: "An intelligent study scheduling application that adapts to student learning patterns using machine learning algorithms. The app analyzes study habits, course difficulty, and upcoming deadlines to create optimized study plans.",
    owner: "Arjun Sharma",
    skills: ["React", "Python", "Machine Learning", "REST API", "PostgreSQL"],
    progress: 35,
    members: [
      { name: "Arjun Sharma", initials: "AS", role: "Owner"        },
      { name: "Rohan Mehta",  initials: "RM", role: "Collaborator" },
      { name: "Sneha Iyer",   initials: "SI", role: "Collaborator" },
      { name: "Kiran Bose",   initials: "KB", role: "Collaborator" },
    ],
  },
  "2": {
    name: "Campus Events App",
    description: "Discover and organize campus events with real-time updates and RSVP management. Features push notifications and a map view of nearby events.",
    owner: "Vikram Nair",
    skills: ["React", "Node.js", "Firebase", "Maps API"],
    progress: 60,
    members: [
      { name: "Vikram Nair",  initials: "VN", role: "Owner"        },
      { name: "Priya Patel",  initials: "PP", role: "Collaborator" },
      { name: "Ananya Reddy", initials: "AR", role: "Collaborator" },
      { name: "Rohan Mehta",  initials: "RM", role: "Collaborator" },
      { name: "Meera Pillai", initials: "MP", role: "Collaborator" },
      { name: "Kiran Bose",   initials: "KB", role: "Collaborator" },
    ],
  },
};

// Fallback for projects without detailed data
const defaultProject = (id: string) => ({
  name: `Project #${id}`,
  description: "A collaborative student project on the TeamForge platform.",
  owner: "Project Owner",
  skills: ["React", "Node.js"],
  progress: 30,
  members: [{ name: "Project Owner", initials: "PO", role: "Owner" }],
});

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = (id && projectsData[id]) ? projectsData[id] : defaultProject(id || "0");

  const handleApply = () => {
    toast.success(`Application sent for "${project.name}"! The owner will review your request.`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </button>

      <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">{project.name}</h1>
          <p className="text-sm text-muted-foreground">Owned by <span className="font-medium text-foreground">{project.owner}</span></p>
        </div>

        <p className="text-muted-foreground">{project.description}</p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {project.skills.map(s => (
            <Badge key={s} variant="secondary">{s}</Badge>
          ))}
        </div>

        {/* Progress + Members grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Project Progress</h3>
            <div className="flex items-center gap-3">
              <Progress value={project.progress} className="h-2 flex-1" />
              <span className="text-sm font-semibold text-foreground">{project.progress}%</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Team Members ({project.members.length})</h3>
            <div className="space-y-2">
              {project.members.map(m => (
                <div key={m.name} className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold shrink-0">
                    {m.initials}
                  </div>
                  <span className="text-sm text-foreground font-medium">{m.name}</span>
                  <span className="text-xs text-muted-foreground">· {m.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button size="lg" className="w-full sm:w-auto" onClick={handleApply}>
          Apply to Join Project
        </Button>
      </div>
    </div>
  );
};

export default ProjectDetails;
