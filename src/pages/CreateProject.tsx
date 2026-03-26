import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, X } from "lucide-react";
import { toast } from "sonner";

interface TaskDraft {
  name: string;
  difficulty: string;
  deadline: string;
}

const CreateProject = () => {
  const [skills, setSkills] = useState<string[]>(["React"]);
  const [skillInput, setSkillInput] = useState("");
  const [tasks, setTasks] = useState<TaskDraft[]>([]);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const addTask = () => {
    setTasks([...tasks, { name: "", difficulty: "Medium", deadline: "" }]);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Create Project</h1>
        <p className="text-sm text-muted-foreground mt-1">Set up a new project for collaborators to join.</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-5">
        <div className="space-y-2">
          <Label>Project Name</Label>
          <Input placeholder="e.g., AI Study Planner" />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea placeholder="Describe what this project is about..." rows={4} />
        </div>

        <div className="space-y-2">
          <Label>Skills Required</Label>
          <div className="flex gap-2">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add a skill"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            />
            <Button variant="outline" onClick={addSkill}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
                {s}
                <button onClick={() => setSkills(skills.filter(sk => sk !== s))} className="hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Visibility</Label>
          <Select defaultValue="public">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="invite">Invite Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border-t border-border pt-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Tasks</h3>
            <Button variant="outline" size="sm" onClick={addTask} className="gap-1.5">
              <PlusCircle className="h-4 w-4" /> Add Task
            </Button>
          </div>

          {tasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No tasks yet. Add tasks to get started.</p>
          )}

          <div className="space-y-3">
            {tasks.map((task, i) => (
              <div key={i} className="flex gap-3 items-start bg-secondary/50 p-3 rounded-lg">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Task name"
                    value={task.name}
                    onChange={(e) => {
                      const updated = [...tasks];
                      updated[i].name = e.target.value;
                      setTasks(updated);
                    }}
                  />
                  <div className="flex gap-2">
                    <Select
                      value={task.difficulty}
                      onValueChange={(v) => {
                        const updated = [...tasks];
                        updated[i].difficulty = v;
                        setTasks(updated);
                      }}
                    >
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="date"
                      value={task.deadline}
                      onChange={(e) => {
                        const updated = [...tasks];
                        updated[i].deadline = e.target.value;
                        setTasks(updated);
                      }}
                      className="w-40"
                    />
                  </div>
                </div>
                <button onClick={() => setTasks(tasks.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive mt-2">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button size="lg" className="w-full" onClick={() => toast.success("Project created successfully!")}>
          Create Project
        </Button>
      </div>
    </div>
  );
};

export default CreateProject;
