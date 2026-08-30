"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  ClipboardCheck,
  Calendar,
  Briefcase,
  Bell,
  LogOut,
  Mail,
  CheckCircle2,
  Building,
  CalendarDays,
  User,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface UserSession {
  fullName: string;
  email: string;
  role: string;
  department?: string;
  semester?: string;
  year?: string;
  program?: string;
  enrollmentNo?: string;
  employeeId?: string;
  designation?: string;
  relationship?: string;
  childEnrollmentNo?: string;
  mobileNumber?: string;
}

export const DEFAULT_DEMO_STUDENT: UserSession = {
  fullName: "Aarav Sharma",
  email: "st10293@edusphere.edu",
  role: "student",
  department: "Information Technology",
  program: "B.Tech Information Technology",
  year: "3rd Year",
  semester: "5th Semester",
  enrollmentNo: "ST10293",
};

export function useUser(): { user: UserSession | null; logout: () => void } {
  const [user, setUser] = useState<UserSession | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw =
        sessionStorage.getItem("edusphere_user") ||
        localStorage.getItem("edusphere_user");
      if (raw) {
        setUser(JSON.parse(raw) as UserSession);
      } else {
        setUser(DEFAULT_DEMO_STUDENT);
      }
    } catch {
      setUser(DEFAULT_DEMO_STUDENT);
    }
  }, []);

  const logout = () => {
    try {
      sessionStorage.removeItem("edusphere_user");
      localStorage.removeItem("edusphere_user");
    } catch {}
    router.push("/login");
  };

  return { user, logout };
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function StudentHeaderNav({
  user,
  onLogout,
}: {
  user: UserSession | null;
  onLogout: () => void;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/attendance", label: "Attendance", icon: ClipboardCheck },
    { href: "/timetable", label: "Time Table", icon: Calendar },
    { href: "/tpo", label: "TPO", icon: Briefcase },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xs shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <Link
            href="/dashboard"
            className="flex items-center gap-3 shrink-0 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-800 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-slate-900 tracking-tight">
                  EduSphere
                </span>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1 py-0.2 rounded font-mono">
                  ERP
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                Academic Management Portal
              </span>
            </div>
          </Link>

          {/* Center Horizontal Navigation */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href === "/dashboard" && pathname === "/");
              return (
                <Link
                  key={item.href}
                  id={`nav-link-${item.label.toLowerCase().replace(" ", "-")}`}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150",
                    isActive
                      ? "bg-white text-blue-700 shadow-xs border border-slate-200/90 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isActive ? "text-blue-700" : "text-slate-500"
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right User Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Icon */}
            <button
              aria-label="Notifications"
              className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border border-white" />
            </button>

            <div className="w-px h-5 bg-slate-200 hidden sm:block" />

            {/* Profile Tag */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold text-xs flex items-center justify-center shrink-0 font-mono">
                {user ? getInitials(user.fullName) : "AS"}
              </div>
              <div className="hidden lg:flex flex-col leading-none">
                <span className="text-xs font-semibold text-slate-800 truncate max-w-[130px]">
                  {user?.fullName || "Aarav Sharma"}
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {user?.enrollmentNo || "ST10293"}
                </span>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={onLogout}
              id="header-signout-btn"
              title="Sign out of portal"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        <div className="md:hidden flex items-center justify-between gap-1 py-2 border-t border-slate-100 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href === "/dashboard" && pathname === "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                  isActive
                    ? "bg-blue-700 text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}

export function StudentProfileBanner({ user }: { user: UserSession | null }) {
  const fullName = user?.fullName || "Aarav Sharma";
  const studentId = user?.enrollmentNo || "ST10293";
  const branch = user?.department || "Information Technology";
  const year = user?.year || "3rd Year";
  const semester = user?.semester || "5th Semester";
  const email = user?.email || "st10293@edusphere.edu";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 pb-5 border-b border-slate-100">
        {/* Profile Details */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-xl bg-blue-700 text-white font-bold text-xl flex items-center justify-center shadow-xs">
              {getInitials(fullName)}
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center"
              title="Active Academic Standing"
            >
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200/80 text-[11px] font-semibold text-blue-700">
                <GraduationCap className="w-3 h-3 text-blue-600" />
                Student Portal
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Session 2025–26 (Active)
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {fullName}
            </h1>

            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
              <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">
                ID: {studentId}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {email}
              </span>
            </div>
          </div>
        </div>

        {/* Academic Status Badge */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-left md:text-right">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">
              Academic Status
            </p>
            <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Good Standing • Examination Eligible
            </p>
          </div>
        </div>
      </div>

      {/* Profile Attribute Row */}
      <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
            Student Name
          </p>
          <p className="text-xs font-bold text-slate-800 mt-0.5 truncate" title={fullName}>
            {fullName}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
            Student ID
          </p>
          <p className="text-xs font-bold font-mono text-slate-800 mt-0.5">
            {studentId}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
            Branch / Dept
          </p>
          <p className="text-xs font-bold text-slate-800 mt-0.5 truncate" title={branch}>
            {branch}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
            Year / Semester
          </p>
          <p className="text-xs font-bold text-slate-800 mt-0.5">
            {year} • {semester}
          </p>
        </div>
      </div>
    </div>
  );
}

export function StudentFooter({ user }: { user: UserSession | null }) {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2026 EduSphere ERP • Unified Academic Management System</span>
        <span className="text-slate-400 font-mono text-[11px]">
          Student ID: {user?.enrollmentNo || "ST10293"}
        </span>
      </div>
    </footer>
  );
}
