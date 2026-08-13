"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function PasswordInput({
  className,
  error,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1">
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "w-full rounded-lg border bg-slate-50 px-3.5 py-2.5 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all",
            error ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/30" : "border-slate-200",
            className
          )}
          {...props}
        />
        <button
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
      {/* Validation message placeholder */}
      {error ? (
        <p className="text-xs text-rose-500 font-medium">{error}</p>
      ) : (
        <p className="text-[11px] text-slate-400 min-h-[16px]">
          {/* Backend error placeholder */}
        </p>
      )}
    </div>
  );
}
