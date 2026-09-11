"use client";

import React from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The card shell every dashboard section sits in. Class names are copied from
 * the original dashboard widgets so new sections are visually identical to the
 * ones that were already there.
 */
export function Panel({
  title,
  icon: Icon,
  iconClass = "text-blue-500",
  action,
  children,
  className,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconClass?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {Icon && <Icon className={cn("w-4 h-4", iconClass)} />}
          <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function PanelLoading({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-slate-400">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

export function PanelEmpty({
  icon: Icon = AlertCircle,
  title,
  hint,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-slate-400" />
      </div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      {hint && <p className="text-xs text-slate-400 mt-1 max-w-xs">{hint}</p>}
    </div>
  );
}

export function PanelError({ message }: { message: string }) {
  return (
    <div className="m-4 flex items-start gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}

/** Section heading used above a group of panels. */
export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h1 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h1>
      {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
    </div>
  );
}

const inputBase =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all";

export { inputBase };

export function PrimaryButton({
  children,
  disabled,
  loading,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm text-white shadow-sm transition-all duration-150",
        disabled || loading
          ? "bg-slate-300 text-slate-500 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 cursor-pointer shadow-blue-500/20",
        className
      )}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
