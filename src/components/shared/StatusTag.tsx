import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusTagVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      status: {
        open: "bg-secondary text-secondary-foreground",
        "in-progress": "bg-info/10 text-info",
        "in-review": "bg-warning/10 text-warning",
        revision: "bg-destructive/10 text-destructive",
        approved: "bg-success/10 text-success",
        pending: "bg-warning/10 text-warning",
        rejected: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      status: "open",
    },
  }
);

const statusLabels: Record<string, string> = {
  open: "Open",
  "in-progress": "In Progress",
  "in-review": "In Review",
  revision: "Revision",
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
};

interface StatusTagProps extends VariantProps<typeof statusTagVariants> {
  className?: string;
}

export function StatusTag({ status, className }: StatusTagProps) {
  return (
    <span className={cn(statusTagVariants({ status }), className)}>
      {statusLabels[status || "open"]}
    </span>
  );
}
