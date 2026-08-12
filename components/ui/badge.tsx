import React from "react";
import { cn } from "@/lib/utils";

// Badge component for status labels
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "info";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-blue-100 text-blue-700 border-blue-200",
    secondary: "bg-slate-100 text-slate-600 border-slate-200",
    outline: "border border-slate-300 text-slate-600",
    success: "bg-emerald-100 text-emerald-700 border-emerald-200",
    warning: "bg-amber-100 text-amber-700 border-amber-200",
    info: "bg-sky-100 text-sky-700 border-sky-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
