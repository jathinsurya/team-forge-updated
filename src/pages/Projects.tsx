import { useState } from "react";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const allProjectsData = [
  { id: "1",  name: "AI Study Planner",    description: "An intelligent study scheduling app that adapts to student learning patterns.", skills: ["React", "Python", "ML"],              progress: 35, collaborators: 4, owner: "Arjun Sharma" },
  { id: "2",  name: "Campus Events App",   description: "Discover and organize campus events with real-time updates and RSVP management.", skills: ["React", "Node.js", "Firebase"],    progress: 60, collaborators: 6, owner: "Vikram Nair" },
  { id: "3",  name: "EcoTracker",          description: "Track and reduce your carbon footprint with gamified challenges.",             skills: ["React", "API", "Charts"],            progress: 80, collaborators: 5, owner: "Ananya Reddy" },
  { id: "4",  name: "Budget Buddy",        description: "Smart personal finance tracker for students with expense categorization.",      skills: ["TypeScript", "Supabase"],            progress: 45, collaborators: 3, owner: "Kiran Bose" },
  { id: "5",  name: "Study Group Finder",  description: "Match with study partners based on courses, schedule, and learning style.",    skills: ["React", "Node.js"],                  progress: 20, collaborators: 2, owner: "Priya Patel" },
  { id: "6",  name: "Code Review Hub",     description: "Peer code review platform for student developers with feedback scoring.",      skills: ["React", "Git API", "Python"],        progress: 10, collaborators: 1, owner: "Rohan Mehta" },
  { id: "7",  name: "Health & Wellness",   description: "Student wellness tracker with mental health resources and daily check-ins.",   skills: ["React Native", "Firebase"],          progress: 55, collaborators: 4, owner: "Sneha Iyer" },
  { id: "8",  name: "Research Collab",     description: "Collaborative research paper writing with version control and citations.",     skills: ["React", "LaTeX", "Node.js"],         progress: 30, collaborators: 3, owner: "Meera Pillai" },
];

const recommended = allProjectsData.slice(0, 2);

const Projects = () => {
  const [query, setQuery] = useState("");

  const filtered = allProjectsData.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase()) ||
    p.skills.some(s => s.toLowerCase().includes(query.toLowerCase())) ||
    p.owner.toLowerCase().includes(query.toLowerCase())
  );

  const showRecommended = query.trim() === "";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Projects</h1>
        <p className="text-sm text-muted-foreground mt-1">Discover and join projects that match your skills.</p>
      </div>

      {/* Search bar */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, skill, or owner..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {showRecommended && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Recommended For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommended.map(p => <ProjectCard key={p.id} {...p} linkTo={`/projects/${p.id}`} />)}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {showRecommended ? "All Projects" : `Results (${filtered.length})`}
        </h2>
        {filtered.length === 0
          ? <p className="text-sm text-muted-foreground italic">No projects match your search.</p>
          : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(showRecommended ? allProjectsData.slice(2) : filtered).map(p => (
                <ProjectCard key={p.id} {...p} linkTo={`/projects/${p.id}`} />
              ))}
            </div>
        }
      </div>
    </div>
  );
};

export default Projects;
