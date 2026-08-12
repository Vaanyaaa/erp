import React from "react";
import { cn } from "@/lib/utils";

// Skeleton component for loading states
// Usage: <Skeleton className="h-4 w-32" />
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200", className)}
      {...props}
    />
  );
}

export { Skeleton };
