import { Progress } from "@/components/ui/progress";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  skills: string[];
  progress: number;
  collaborators: number;
  linkTo?: string;
}

export function ProjectCard({ id, name, description, skills, progress, collaborators, linkTo }: ProjectCardProps) {
  const Wrapper = linkTo ? Link : "div";
  const wrapperProps = linkTo ? { to: linkTo } : {};

  return (
    <Wrapper
      {...(wrapperProps as any)}
      className="block bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-shadow group"
    >
      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{name}</h3>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {skills.map((s) => (
          <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
            {s}
          </span>
        ))}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{progress}% complete</span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" /> {collaborators}
          </span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>
    </Wrapper>
  );
}
