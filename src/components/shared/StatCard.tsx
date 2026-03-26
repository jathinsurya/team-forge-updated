import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: "primary" | "accent" | "success" | "info";
}

const colorMap = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
};

export function StatCard({ label, value, icon: Icon, trend, color = "primary" }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card">
      <div className="flex items-start justify-between mb-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && <span className="text-xs text-success font-medium">{trend}</span>}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
