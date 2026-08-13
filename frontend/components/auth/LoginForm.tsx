"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/auth/PasswordInput";
import {
  Mail,
  ShieldAlert,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Users,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Role badge definitions shown at bottom of login — display only, not selectable
const ROLE_BADGES = [
  {
    id: "student",
    label: "Student",
    icon: GraduationCap,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "professor",
    label: "Professor",
    icon: BookOpen,
    color: "bg-violet-50 text-violet-700 border-violet-200",
  },
  {
    id: "parent",
    label: "Parent",
    icon: Users,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
];

interface LoginFormProps {
  /** Backend integration hook: called with form values on submit */
  onSubmit?: (data: {
    identifier: string;
    password: string;
    rememberMe: boolean;
  }) => void | Promise<void>;
  /** External error message injected from backend auth response */
  externalError?: string;
}

export function LoginForm({ onSubmit, externalError }: LoginFormProps) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Inline validation state placeholders (populated by backend integration)
  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const isFormValid =
    identifier.trim().length > 0 && password.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setFormError("");
    setIsSubmitting(true);

    try {
      // Backend integration point:
      // Replace with: await signIn("credentials", { identifier, password, rememberMe })
      // Or:           await fetch("/api/auth/login", { method: "POST", body: ... })
      if (onSubmit) {
        await onSubmit({ identifier, password, rememberMe });
        router.push("/dashboard");
      } else {
        // Simulated login — redirect to dashboard while backend is pending
        await new Promise((r) => setTimeout(r, 600));
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Authentication failed. Please try again.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = externalError || formError;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Backend Error Banner Placeholder */}
      {displayError && (
        <div
          role="alert"
          className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700"
        >
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{displayError}</span>
        </div>
      )}

      {/* Email / Institutional ID Input */}
      <div className="space-y-1">
        <label
          htmlFor="login-identifier"
          className="block text-xs font-semibold text-slate-700"
        >
          Email Address / Institutional ID{" "}
          <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <input
            id="login-identifier"
            type="text"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (identifierError) setIdentifierError("");
            }}
            placeholder="s10293@edusphere.edu or user@edusphere.edu"
            autoComplete="username"
            className={cn(
              "w-full rounded-lg border bg-slate-50 px-3.5 py-2.5 pl-10 text-sm text-slate-800 placeholder:text-slate-400",
              "focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all",
              identifierError
                ? "border-rose-400 focus:ring-rose-500/30"
                : "border-slate-200"
            )}
            required
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        {/* Backend validation message placeholder */}
        {identifierError && (
          <p className="text-xs text-rose-500 font-medium">{identifierError}</p>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label
            htmlFor="login-password"
            className="block text-xs font-semibold text-slate-700"
          >
            Password <span className="text-rose-500">*</span>
          </label>
          {/* Forgot password – UI only; backend integration point */}
          <Link
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="login-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError("");
          }}
          placeholder="••••••••••••"
          error={passwordError}
          autoComplete="current-password"
          required
        />
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center pt-0.5">
        <label className="flex items-center gap-2 cursor-pointer select-none group">
          <input
            id="login-remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer"
          />
          <span className="text-xs text-slate-600 group-hover:text-slate-800 transition-colors">
            Remember this device
          </span>
        </label>
      </div>

      {/* Submit Button */}
      {/* Backend integration point: wire onSubmit to auth provider */}
      <button
        type="submit"
        id="login-submit-btn"
        disabled={!isFormValid || isSubmitting}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm text-white shadow-sm transition-all duration-150",
          isFormValid && !isSubmitting
            ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 cursor-pointer shadow-blue-500/20"
            : "bg-slate-300 text-slate-500 cursor-not-allowed"
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Authenticating…</span>
          </>
        ) : (
          <>
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Role Badges — Display only, non-selectable on login page */}
      <div className="pt-1 space-y-2">
        <p className="text-[11px] text-slate-400 text-center uppercase tracking-wider font-medium">
          Portal access for
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {ROLE_BADGES.map(({ id, label, icon: Icon, color }) => (
            <span
              key={id}
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold",
                color
              )}
            >
              <Icon className="w-3 h-3" />
              {label}
            </span>
          ))}
        </div>
        <p className="text-[11px] text-slate-400 text-center">
          Authorized users only.
        </p>
      </div>

      {/* Secondary Navigation Link */}
      <div className="text-center pt-1 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Don&apos;t have an institutional account?{" "}
          <Link
            href="/signup"
            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </form>
  );
}
