import { StatusTag } from "@/components/shared/StatusTag";

const appliedProjects = [
  { id: "1", name: "AI Study Planner", description: "Intelligent study scheduling app", status: "approved" as const },
  { id: "2", name: "Code Review Hub", description: "Peer code review platform", status: "pending" as const },
  { id: "3", name: "Health & Wellness", description: "Student wellness tracker", status: "rejected" as const },
  { id: "4", name: "Research Collab", description: "Collaborative research writing", status: "pending" as const },
];

const AppliedProjects = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Applied Projects</h1>
        <p className="text-sm text-muted-foreground mt-1">Track the status of your project applications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appliedProjects.map((p) => (
          <div key={p.id} className="bg-card rounded-xl border border-border p-5 shadow-card">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-foreground">{p.name}</h3>
              <StatusTag status={p.status} />
            </div>
            <p className="text-sm text-muted-foreground">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppliedProjects;
