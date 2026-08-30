"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { RoleType } from "@/components/auth/RoleSelector";
import {
  Mail,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Users,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface StudentDemoProfile {
  fullName: string;
  email: string;
  role: string;
  department: string;
  program: string;
  year: string;
  semester: string;
  enrollmentNo: string;
}

export const STUDENT_DEMO = {
  id: "ST10293",
  email: "st10293@edusphere.edu",
  password: "student123",
  profile: {
    fullName: "Aarav Sharma",
    email: "st10293@edusphere.edu",
    role: "student",
    department: "Information Technology",
    program: "B.Tech Information Technology",
    year: "3rd Year",
    semester: "5th Semester",
    enrollmentNo: "ST10293",
  } satisfies StudentDemoProfile,
};

interface RoleCardConfig {
  id: RoleType;
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  badgeColor: string;
  inputLabel: string;
  inputPlaceholder: string;
}

const ROLE_OPTIONS: RoleCardConfig[] = [
  {
    id: "student",
    title: "Student",
    badge: "Student Portal",
    description: "Access course materials, timetables, attendance & results",
    icon: GraduationCap,
    iconBg: "bg-blue-50 border border-blue-200",
    iconColor: "text-blue-700",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    inputLabel: "Student ID / Institutional Email",
    inputPlaceholder: "ST10293 or st10293@edusphere.edu",
  },
  {
    id: "parent",
    title: "Parent",
    badge: "Parent Portal",
    description: "Monitor student academic progress, attendance & notices",
    icon: Users,
    iconBg: "bg-emerald-50 border border-emerald-200",
    iconColor: "text-emerald-700",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    inputLabel: "Registered Email / Phone / Student ID",
    inputPlaceholder: "parent@example.com",
  },
  {
    id: "professor",
    title: "Professor",
    badge: "Faculty Portal",
    description: "Manage classes, student evaluations, exams & schedules",
    icon: Building,
    iconBg: "bg-purple-50 border border-purple-200",
    iconColor: "text-purple-700",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    inputLabel: "Faculty ID / Institutional Email",
    inputPlaceholder: "prof.smith@edusphere.edu or EMP-8821",
  },
];

interface LoginFormProps {
  onSuccess?: () => void;
  error?: string;
  initialRole?: RoleType;
}

export function LoginForm({
  onSuccess,
  error: externalError,
  initialRole = "student",
}: LoginFormProps) {
  const router = useRouter();

  // Role Selection State: null means user is on role-selection landing screen
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);

  // Form Fields
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  // Validation & Error States
  const [identifierError, setIdentifierError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [formError, setFormError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    try {
      const activeSession =
        sessionStorage.getItem("edusphere_user") ||
        localStorage.getItem("edusphere_user");
      if (activeSession) {
        const user = JSON.parse(activeSession);
        if (user && user.role) {
          router.push("/dashboard");
        }
      }
    } catch {}
  }, [router]);

  const activeRoleConfig =
    ROLE_OPTIONS.find((r) => r.id === selectedRole) || ROLE_OPTIONS[0];

  const validateForm = (): boolean => {
    let isValid = true;
    setIdentifierError("");
    setPasswordError("");
    setFormError("");

    const trimmedId = identifier.trim();
    if (!trimmedId) {
      setIdentifierError(
        selectedRole === "student"
          ? "Please enter your Student ID or institutional email."
          : selectedRole === "professor"
          ? "Please enter your Faculty ID or email."
          : "Please enter your registered email or phone."
      );
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      isValid = false;
    }

    return isValid;
  };

  const isFormValid = identifier.trim().length > 0 && password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setFormError("");

    await new Promise((res) => setTimeout(res, 350));

    try {
      const normIdentifier = identifier.trim().toLowerCase();

      if (selectedRole === "student") {
        const isStudentIdMatch =
          normIdentifier === STUDENT_DEMO.id.toLowerCase() ||
          normIdentifier === "st10293";
        const isStudentEmailMatch =
          normIdentifier === STUDENT_DEMO.email.toLowerCase() ||
          normIdentifier === "st10293@edusphere.edu";
        const isPasswordMatch = password === STUDENT_DEMO.password;

        if ((isStudentIdMatch || isStudentEmailMatch) && isPasswordMatch) {
          sessionStorage.setItem(
            "edusphere_user",
            JSON.stringify(STUDENT_DEMO.profile)
          );
          if (rememberMe) {
            localStorage.setItem(
              "edusphere_user",
              JSON.stringify(STUDENT_DEMO.profile)
            );
          }

          if (onSuccess) {
            onSuccess();
          } else {
            window.dispatchEvent(new Event("edusphere_login"));
          }

          router.push("/dashboard");
          return;
        } else {
          // Check for dynamically registered accounts
          try {
            const rawStored = sessionStorage.getItem(
              "edusphere_registered_users"
            );
            if (rawStored) {
              const users = JSON.parse(rawStored);
              const matched = users.find(
                (u: {
                  email?: string;
                  enrollmentNo?: string;
                  password?: string;
                }) =>
                  (u.email?.toLowerCase() === normIdentifier ||
                    u.enrollmentNo?.toLowerCase() === normIdentifier) &&
                  u.password === password
              );
              if (matched) {
                sessionStorage.setItem(
                  "edusphere_user",
                  JSON.stringify(matched)
                );
                if (rememberMe) {
                  localStorage.setItem(
                    "edusphere_user",
                    JSON.stringify(matched)
                  );
                }
                router.push("/dashboard");
                return;
              }
            }
          } catch {}

          setFormError("Invalid Student ID/email or password.");
          setIsSubmitting(false);
          return;
        }
      } else if (selectedRole === "professor") {
        if (
          (normIdentifier === "prof.smith@edusphere.edu" ||
            normIdentifier === "emp-8821" ||
            normIdentifier === "emp8821") &&
          password === "prof123"
        ) {
          const profProfile = {
            fullName: "Dr. Rajesh Sharma",
            email: "prof.smith@edusphere.edu",
            role: "professor",
            department: "Information Technology",
            employeeId: "EMP-8821",
            designation: "Associate Professor & HOD",
          };
          sessionStorage.setItem("edusphere_user", JSON.stringify(profProfile));
          router.push("/dashboard");
          return;
        } else {
          setFormError("Invalid Faculty ID/email or password.");
          setIsSubmitting(false);
          return;
        }
      } else if (selectedRole === "parent") {
        if (
          normIdentifier === "parent@example.com" &&
          password === "parent123"
        ) {
          const parentProfile = {
            fullName: "Mr. Suresh Sharma",
            email: "parent@example.com",
            role: "parent",
            relationship: "Father",
            childEnrollmentNo: "ST10293",
          };
          sessionStorage.setItem("edusphere_user", JSON.stringify(parentProfile));
          router.push("/dashboard");
          return;
        } else {
          setFormError("Invalid Parent email/phone or password.");
          setIsSubmitting(false);
          return;
        }
      } else {
        setFormError("Please select a role to continue.");
        setIsSubmitting(false);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Authentication failed. Please try again.";
      setFormError(message);
      setIsSubmitting(false);
    }
  };

  const displayError = externalError || formError;

  // View 1: Role Selection Screen
  if (!selectedRole) {
    return (
      <div className="space-y-6">
        {/* Header section */}
        <div className="text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2.5 lg:hidden mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white">
              <GraduationCap className="w-4.5 h-4.5" />
            </div>
            <span className="text-base font-bold text-slate-800">
              EduSphere ERP
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Welcome to EduSphere
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Choose your role to continue.
          </p>
        </div>

        {/* 3 Large Modern Role Cards */}
        <div className="space-y-3 pt-1">
          {ROLE_OPTIONS.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                type="button"
                id={`signin-role-${role.id}`}
                onClick={() => {
                  setSelectedRole(role.id);
                  setFormError("");
                  setIdentifier("");
                  setPassword("");
                }}
                className="w-full group flex items-center gap-3.5 p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs transition-all text-left cursor-pointer focus:outline-none"
              >
                {/* Icon Container */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border",
                    role.iconBg,
                    role.iconColor
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Role Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {role.title}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {role.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-normal truncate">
                    {role.description}
                  </p>
                </div>

                {/* Arrow Action Indicator */}
                <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 group-hover:text-slate-600 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Institutional notice & secondary registration link */}
        <div className="pt-2 space-y-3 border-t border-slate-100">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Secure internal portal for authorized campus personnel</span>
          </div>

          <div className="text-center">
            <p className="text-xs text-slate-500">
              Don&apos;t have an institutional account?{" "}
              <Link
                href="/signup"
                className="text-blue-700 hover:text-blue-800 font-semibold hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // View 2: Role-Tailored Credential Input Form
  const ActiveIcon = activeRoleConfig.icon;

  return (
    <div className="space-y-6">
      {/* Top navigation & role indicator */}
      <div className="space-y-3">
        <button
          type="button"
          id="back-to-roles-btn"
          onClick={() => {
            setSelectedRole(null);
            setFormError("");
            setIdentifier("");
            setPassword("");
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-700 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to role selection</span>
        </button>

        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-semibold",
                  activeRoleConfig.badgeColor
                )}
              >
                <ActiveIcon className="w-3.5 h-3.5" />
                {activeRoleConfig.badge}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Sign In as {activeRoleConfig.title}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Enter your credentials to access your academic portal.
            </p>
          </div>

          <div
            className={cn(
              "hidden sm:flex w-10 h-10 rounded-lg items-center justify-center shrink-0 border",
              activeRoleConfig.iconBg,
              activeRoleConfig.iconColor
            )}
          >
            <ActiveIcon className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Error Banner */}
        {displayError && (
          <div
            role="alert"
            id="login-error-banner"
            className="flex items-center gap-2.5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium"
          >
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{displayError}</span>
          </div>
        )}

        {/* Identifier Input */}
        <div className="space-y-1">
          <label
            htmlFor="login-identifier"
            className="block text-xs font-semibold text-slate-700"
          >
            {activeRoleConfig.inputLabel} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="login-identifier"
              type="text"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (identifierError) setIdentifierError("");
                if (formError) setFormError("");
              }}
              placeholder={activeRoleConfig.inputPlaceholder}
              autoComplete="username"
              className={cn(
                "w-full rounded-lg border bg-slate-50 px-3.5 py-2.5 pl-10 text-xs text-slate-800 placeholder:text-slate-400",
                "focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors",
                identifierError
                  ? "border-rose-400"
                  : "border-slate-200"
              )}
              required
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
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
            <Link
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-xs text-blue-700 hover:text-blue-800 font-medium hover:underline transition-colors"
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
              if (formError) setFormError("");
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
              className="w-4 h-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600/30 cursor-pointer"
            />
            <span className="text-xs text-slate-600 group-hover:text-slate-800 transition-colors">
              Remember this device
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="login-submit-btn"
          disabled={!isFormValid || isSubmitting}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-xs text-white transition-colors duration-150",
            isFormValid && !isSubmitting
              ? "bg-blue-700 hover:bg-blue-800 cursor-pointer shadow-2xs"
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
              <span>Sign In as {activeRoleConfig.title}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Switch role quick action & signup link */}
        <div className="pt-2 text-center space-y-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Selected wrong portal?{" "}
            <button
              type="button"
              onClick={() => {
                setSelectedRole(null);
                setFormError("");
              }}
              className="text-blue-700 hover:text-blue-800 font-semibold hover:underline cursor-pointer"
            >
              Choose different role
            </button>
          </p>
          <p className="text-xs text-slate-500">
            Don&apos;t have an institutional account?{" "}
            <Link
              href="/signup"
              className="text-blue-700 hover:text-blue-800 font-semibold hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
