"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Bell,
  HelpCircle,
  User,
  Search,
  Menu,
  X,
  Clock,
  CalendarDays,
  LogOut,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth, roleLabel } from "@/lib/auth";
import { AppUser } from "@/lib/api";
import { OverviewSection } from "@/components/dashboard/sections/OverviewSection";
import { TPCellSection } from "@/components/dashboard/sections/TPCellSection";
import { DocumentsSection } from "@/components/dashboard/sections/DocumentsSection";
import { CalendarSection } from "@/components/dashboard/sections/CalendarSection";
import { MaterialsSection } from "@/components/dashboard/sections/MaterialsSection";
import {
  NoticesSection,
  AttendanceSection,
  FeesSection,
  CoursesSection,
  TimetableSection,
  ProfileSection,
  Placeholder,
} from "@/components/dashboard/sections/Sections";
import { navItemsFor, canAccess, Role, NavItem } from "@/lib/roles";

// Helper: get initials from full name
function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// ─────────────────────────────────────────────
// TOP HEADER COMPONENT
// ─────────────────────────────────────────────
function TopHeader({
  onMenuToggle,
  sidebarOpen,
  user,
  onSignOut,
  onProfile,
}: {
  onMenuToggle: () => void;
  sidebarOpen: boolean;
  user: AppUser | null;
  onSignOut: () => void;
  onProfile: () => void;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center border-b border-slate-200 bg-white px-4 shadow-sm">
      {/* Logo + Brand */}
      <div className="flex items-center gap-3 w-56 shrink-0">
        {/* Mobile hamburger */}
        <button
          aria-label="Toggle sidebar"
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Institution logo placeholder */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shrink-0 shadow-sm">
          <GraduationCap className="w-4 h-4 text-white" />
        </div>

        {/* Brand name */}
        <div className="hidden sm:flex flex-col leading-none">
          <span className="text-sm font-bold text-slate-800 tracking-tight">Acadex</span>
          <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">ERP Portal</span>
        </div>
      </div>

      {/* Global Search */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search students, courses, notices…"
            aria-label="Global search"
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="ml-auto flex items-center gap-1.5">
        {/* Notification icon */}
        <button
          aria-label="Notifications"
          className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-white" />
        </button>

        {/* Help icon */}
        <button
          aria-label="Help"
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* User Avatar + Name */}
        <button onClick={onProfile} className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center ring-2 ring-white shrink-0">
            {user ? (
              <span className="text-xs font-bold text-white">{getInitials(user.fullName)}</span>
            ) : (
              <User className="w-4 h-4 text-white" />
            )}
          </div>
          <div className="hidden sm:flex flex-col leading-none gap-0.5 text-left">
            {user ? (
              <>
                <span className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">
                  {user.fullName}
                </span>
                <span className="text-[10px] text-slate-400">{roleLabel(user.role)}</span>
              </>
            ) : (
              <>
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-2.5 w-14" />
              </>
            )}
          </div>
        </button>

        {/* Sign out */}
        <button
          onClick={onSignOut}
          aria-label="Sign out"
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-rose-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// LEFT SIDEBAR COMPONENT
// ─────────────────────────────────────────────
function LeftSidebar({
  navItems,
  activeNav,
  onNavClick,
  isOpen,
  onOverlayClick,
}: {
  navItems: NavItem[];
  activeNav: string;
  onNavClick: (id: string) => void;
  isOpen: boolean;
  onOverlayClick: () => void;
}) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={onOverlayClick}
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed top-14 bottom-0 left-0 z-40 w-56 flex flex-col bg-white border-r border-slate-200 transition-transform duration-200",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onNavClick(item.id)}
                className={cn(
                  "group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                <span className="truncate">{item.label}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />}
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer — version */}
        <div className="px-4 py-3 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-medium">Acadex v2.0.0</p>
          <p className="text-[10px] text-slate-400">Academic Year: 2026–27</p>
        </div>
      </aside>
    </>
  );
}

// ─────────────────────────────────────────────
// WELCOME PANEL COMPONENT
// ─────────────────────────────────────────────
function WelcomePanel({
  user,
  onSchedule,
  onProfile,
}: {
  user: AppUser | null;
  onSchedule: () => void;
  onProfile: () => void;
}) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const deptLabel =
    user?.department ?? (user?.role === "parent" ? "Parent Portal" : undefined);

  const semesterLabel =
    user?.role === "student"
      ? `Semester: ${user.semester}`
      : user?.role === "professor" || user?.role === "tp_admin"
      ? user.designation
      : user?.role === "parent"
      ? `Ward: ${user.childEnrollmentNo ?? "—"}`
      : undefined;

  return (
    <div className="rounded-xl border border-blue-700 bg-gradient-to-r from-blue-600 to-blue-800 p-5 text-white shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-3">
          <div>
            <p className="text-blue-200 text-xs font-medium uppercase tracking-wider mb-1">
              Welcome back
            </p>
            {user ? (
              <h1 className="text-xl font-bold text-white tracking-tight">{user.fullName}</h1>
            ) : (
              <Skeleton className="h-6 w-48 bg-white/20 mb-1" />
            )}

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-xs font-medium">
                <User className="w-3 h-3" />
                {user ? `Role: ${roleLabel(user.role)}` : "Role: —"}
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-xs font-medium">
                <BookOpen className="w-3 h-3" />
                {deptLabel ? `Dept: ${deptLabel}` : "Dept: —"}
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-xs font-medium">
                <GraduationCap className="w-3 h-3" />
                {semesterLabel ?? "Semester: —"}
              </span>
            </div>
          </div>

          {/* Current date */}
          <div className="flex items-center gap-1.5 text-blue-200 text-xs">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>{today}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 sm:items-end">
          <button
            onClick={onSchedule}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm font-medium hover:bg-white/30 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            View Schedule
          </button>
          <button
            onClick={onProfile}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors"
          >
            <User className="w-4 h-4" />
            My Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FOOTER COMPONENT
// ─────────────────────────────────────────────
function Footer({ user }: { user: AppUser | null }) {
  return (
    <footer className="mt-2 flex flex-col sm:flex-row items-center justify-between gap-2 py-4 border-t border-slate-200 text-xs text-slate-400">
      <div className="flex items-center gap-3">
        <span>© 2026 Acadex</span>
        <span className="w-px h-3 bg-slate-300" />
        <span>Internal Academic Management System</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className="w-3 h-3" />
        <span>
          Last login:{" "}
          {user?.lastLoginAt
            ? new Date(user.lastLoginAt).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
        </span>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// SECTION ROUTER
// Sections not in a role's nav are unreachable — the router never renders
// them, so hiding a nav item also closes the route behind it.
// ─────────────────────────────────────────────
function SectionContent({
  activeNav,
  role,
  onNavigate,
}: {
  activeNav: string;
  role: Role;
  onNavigate: (id: string) => void;
}) {
  if (!canAccess(role, activeNav)) {
    return <OverviewSection role={role} onNavigate={onNavigate} />;
  }

  switch (activeNav) {
    case "dashboard":
      return <OverviewSection role={role} onNavigate={onNavigate} />;
    case "tpcell":
      return <TPCellSection />;
    case "calendar":
      return <CalendarSection />;
    case "notices":
      return <NoticesSection />;
    case "documents":
      return <DocumentsSection />;
    case "assignments":
      return <MaterialsSection kind="assignment" />;
    case "library":
      return <MaterialsSection kind="note" />;
    case "fees":
      return <FeesSection />;
    case "courses":
      return <CoursesSection />;
    case "timetable":
      return <TimetableSection />;
    case "profile":
      return <ProfileSection />;

    // Staff don't have a personal attendance record — for them this is the
    // not-yet-built marking screen, not an empty chart.
    case "attendance":
      return role === "professor" || role === "tp_admin" ? (
        <Placeholder sectionId="attendance" copyKey="attendance_staff" />
      ) : (
        <AttendanceSection />
      );

    default:
      return <Placeholder sectionId={activeNav} />;
  }
}

// ─────────────────────────────────────────────
// MAIN DASHBOARD PAGE COMPONENT
// ─────────────────────────────────────────────
export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const role = (user?.role ?? "student") as Role;
  const navItems = navItemsFor(role);

  // Send unauthenticated visitors to the sign-in page.
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    setSidebarOpen(false);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-sm animate-pulse">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs text-slate-400 font-medium">
            {loading ? "Restoring your session…" : "Redirecting to sign in…"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <TopHeader
        onMenuToggle={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
        user={user}
        onSignOut={logout}
        onProfile={() => handleNavClick("profile")}
      />

      <LeftSidebar
        navItems={navItems}
        activeNav={activeNav}
        onNavClick={handleNavClick}
        isOpen={sidebarOpen}
        onOverlayClick={() => setSidebarOpen(false)}
      />

      <main className="lg:pl-56 pt-14 min-h-screen">
        <div className="px-4 sm:px-6 py-6 max-w-screen-xl mx-auto space-y-5">
          <WelcomePanel
            user={user}
            onSchedule={() =>
              handleNavClick(canAccess(role, "timetable") ? "timetable" : "calendar")
            }
            onProfile={() => handleNavClick("profile")}
          />

          <SectionContent activeNav={activeNav} role={role} onNavigate={handleNavClick} />

          <Footer user={user} />
        </div>
      </main>
    </div>
  );
}
