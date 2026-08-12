"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Calendar,
  FileText,
  GraduationCap,
  BarChart2,
  CreditCard,
  Library,
  Bell,
  HelpCircle,
  User,
  Settings,
  HeadphonesIcon,
  Search,
  ChevronRight,
  Menu,
  X,
  Clock,
  BookMarked,
  CalendarDays,
  Award,
  Wallet,
  BookCopy,
  AlertCircle,
  Activity,
  FolderOpen,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// ─────────────────────────────────────────────
// NAVIGATION CONFIG
// ─────────────────────────────────────────────
const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "attendance", label: "Attendance", icon: ClipboardCheck },
  { id: "timetable", label: "Timetable", icon: Calendar },
  { id: "assignments", label: "Assignments", icon: FileText },
  { id: "examination", label: "Examination", icon: GraduationCap },
  { id: "results", label: "Results", icon: BarChart2 },
  { id: "fees", label: "Fees", icon: CreditCard },
  { id: "library", label: "Library", icon: Library },
  { id: "notices", label: "Notices", icon: Bell },
  { id: "documents", label: "Documents", icon: FolderOpen },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "support", label: "Support", icon: HeadphonesIcon },
];

// ─────────────────────────────────────────────
// OVERVIEW CARD CONFIG
// Backend integration point: replace empty values with fetched metric data
// ─────────────────────────────────────────────
const overviewCards = [
  {
    id: "courses",
    title: "Enrolled Courses",
    icon: BookCopy,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    id: "attendance",
    title: "Attendance Rate",
    icon: ClipboardCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    id: "assignments",
    title: "Pending Assignments",
    icon: FileText,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    id: "results",
    title: "Latest CGPA",
    icon: Award,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
];

// Quick access shortcut cards config
const quickAccessItems = [
  { id: "timetable", label: "Timetable", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
  { id: "exams", label: "Exams", icon: GraduationCap, color: "text-violet-600", bg: "bg-violet-50" },
  { id: "results", label: "Results", icon: BarChart2, color: "text-emerald-600", bg: "bg-emerald-50" },
  { id: "fees", label: "Fees", icon: Wallet, color: "text-amber-600", bg: "bg-amber-50" },
  { id: "library", label: "Library", icon: Library, color: "text-sky-600", bg: "bg-sky-50" },
  { id: "support", label: "Support", icon: HeadphonesIcon, color: "text-rose-600", bg: "bg-rose-50" },
];

// ─────────────────────────────────────────────
// TOP HEADER COMPONENT
// ─────────────────────────────────────────────
function TopHeader({
  onMenuToggle,
  sidebarOpen,
}: {
  onMenuToggle: () => void;
  sidebarOpen: boolean;
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
          <span className="text-sm font-bold text-slate-800 tracking-tight">EduSphere</span>
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
          {/* Notification dot — will show count from backend */}
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

        {/* User Avatar + Role */}
        {/* Backend integration point: replace placeholder with authenticated user data */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          {/* Avatar placeholder */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center ring-2 ring-white">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:flex flex-col leading-none gap-1">
            {/* Role label placeholder */}
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-2.5 w-14" />
          </div>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// LEFT SIDEBAR COMPONENT
// ─────────────────────────────────────────────
function LeftSidebar({
  activeNav,
  onNavClick,
  isOpen,
}: {
  activeNav: string;
  onNavClick: (id: string) => void;
  isOpen: boolean;
}) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
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
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer — version */}
        <div className="px-4 py-3 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-medium">EduSphere ERP v2.0.0</p>
          <p className="text-[10px] text-slate-400">Academic Year: —</p>
        </div>
      </aside>
    </>
  );
}

// ─────────────────────────────────────────────
// WELCOME PANEL COMPONENT
// Backend integration point: inject user profile, role, department, semester
// ─────────────────────────────────────────────
function WelcomePanel() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="rounded-xl border border-blue-700 bg-gradient-to-r from-blue-600 to-blue-800 p-5 text-white shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-3">
          {/* Welcome message placeholder */}
          <div>
            <p className="text-blue-200 text-xs font-medium uppercase tracking-wider mb-1">
              Welcome back
            </p>
            {/* Backend integration point: replace skeleton with user full name */}
            <Skeleton className="h-6 w-48 bg-white/20 mb-1" />
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {/* Role badge placeholder */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-xs font-medium">
                <User className="w-3 h-3" />
                Role: —
              </span>
              {/* Department placeholder */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-xs font-medium">
                <BookOpen className="w-3 h-3" />
                Dept: —
              </span>
              {/* Semester/Class placeholder */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-xs font-medium">
                <GraduationCap className="w-3 h-3" />
                Semester: —
              </span>
            </div>
          </div>

          {/* Current date */}
          <div className="flex items-center gap-1.5 text-blue-200 text-xs">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>{today}</span>
          </div>
        </div>

        {/* Action buttons — disabled placeholders */}
        {/* Backend integration point: wire up to timetable/profile API */}
        <div className="flex flex-col gap-2 sm:items-end">
          <button
            disabled
            aria-disabled="true"
            title="Available after backend integration"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm font-medium opacity-60 cursor-not-allowed"
          >
            <Calendar className="w-4 h-4" />
            View Schedule
          </button>
          <button
            disabled
            aria-disabled="true"
            title="Available after backend integration"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium opacity-60 cursor-not-allowed"
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
// OVERVIEW CARDS COMPONENT
// Backend integration point: replace skeleton with fetched metrics
// ─────────────────────────────────────────────
function OverviewCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {overviewCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={cn(
              "rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow",
              card.border
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={cn("p-2 rounded-lg", card.bg)}>
                <Icon className={cn("w-5 h-5", card.color)} />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
            <p className="text-xs text-slate-500 font-medium mb-1">{card.title}</p>
            {/* Backend integration point: replace skeleton with actual metric value */}
            <Skeleton className="h-7 w-20 mb-2" />
            <p className="text-[10px] text-slate-400">Data will appear here</p>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// TODAY'S SCHEDULE COMPONENT
// Backend integration point: replace empty state with timetable API data
// ─────────────────────────────────────────────
function TodaysSchedule() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <h2 className="text-sm font-semibold text-slate-800">Today&apos;s Schedule</h2>
        </div>
        <button
          disabled
          className="text-xs text-blue-500 font-medium opacity-50 cursor-not-allowed"
        >
          View All
        </button>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-3 gap-2 px-4 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
        <span>Time</span>
        <span>Subject</span>
        <span>Room</span>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <Calendar className="w-5 h-5 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-500">No classes scheduled</p>
        <p className="text-xs text-slate-400 mt-1">
          {/* Backend integration point: timetable will populate this area */}
          Timetable data will appear once connected
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ATTENDANCE OVERVIEW COMPONENT
// Backend integration point: replace chart skeleton with real attendance data
// ─────────────────────────────────────────────
function AttendanceOverview() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-semibold text-slate-800">Attendance Overview</h2>
        </div>
        <Badge variant="secondary">This Month</Badge>
      </div>

      <div className="p-4 space-y-3">
        {/* Chart placeholder */}
        <div className="rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center justify-center py-6 gap-3">
          <BarChart2 className="w-8 h-8 text-slate-300" />
          <div className="space-y-1 text-center">
            <p className="text-sm text-slate-400 font-medium">Chart Placeholder</p>
            <p className="text-xs text-slate-400">
              {/* Backend integration point: attendance chart renders here */}
              Attendance analytics will appear here
            </p>
          </div>
          {/* Skeleton bars mimicking bar chart */}
          <div className="flex items-end gap-1.5 h-12 mt-1">
            {[40, 65, 55, 80, 45, 70, 60].map((h, i) => (
              <Skeleton
                key={i}
                style={{ height: `${h}%` }}
                className="w-5 rounded-sm"
              />
            ))}
          </div>
        </div>

        {/* Legend skeletons */}
        <div className="grid grid-cols-2 gap-2">
          {["Present", "Absent"].map((label) => (
            <div key={label} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
              <Skeleton className="w-2.5 h-2.5 rounded-full" />
              <div>
                <p className="text-[10px] text-slate-500">{label}</p>
                <Skeleton className="h-3.5 w-10 mt-0.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LATEST NOTICES COMPONENT
// Backend integration point: render notices from API response here
// ─────────────────────────────────────────────
function LatestNotices() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-slate-800">Latest Notices</h2>
        </div>
        <button
          disabled
          className="text-xs text-blue-500 font-medium opacity-50 cursor-not-allowed"
        >
          View All
        </button>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="relative mb-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100">
            <Bell className="w-7 h-7 text-amber-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center border border-white">
            <AlertCircle className="w-3 h-3 text-slate-400" />
          </div>
        </div>
        <p className="text-sm font-semibold text-slate-600 mb-1">No notices to display</p>
        <p className="text-xs text-slate-400 max-w-xs">
          {/* Backend integration point: notices will appear once the API is connected */}
          Official notices and announcements from your institution will appear here.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// RECENT ACTIVITY COMPONENT
// Backend integration point: fetch and render user activity log
// ─────────────────────────────────────────────
function RecentActivity() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-violet-500" />
          <h2 className="text-sm font-semibold text-slate-800">Recent Activity</h2>
        </div>
        <Badge variant="secondary">Today</Badge>
      </div>

      <div className="p-4">
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center mb-3 border border-violet-100">
            <Activity className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">No recent activity</p>
          <p className="text-xs text-slate-400 mb-4">
            {/* Backend integration point: activity feed from API goes here */}
            Your recent portal activity will appear here
          </p>
        </div>

        {/* Skeleton activity rows */}
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <Skeleton className="w-7 h-7 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-2.5 w-2/3" />
              </div>
              <Skeleton className="h-3 w-10 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// QUICK ACCESS SECTION COMPONENT
// These cards are UI-only shortcuts; wire up navigation on backend integration
// ─────────────────────────────────────────────
function QuickAccess() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
        <BookMarked className="w-4 h-4 text-blue-500" />
        <h2 className="text-sm font-semibold text-slate-800">Quick Access</h2>
      </div>

      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickAccessItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`quick-access-${item.id}`}
              aria-label={`Navigate to ${item.label}`}
              className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all duration-150 cursor-pointer"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
                  item.bg
                )}
              >
                <Icon className={cn("w-5 h-5", item.color)} />
              </div>
              <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FOOTER COMPONENT
// Backend integration point: inject last login timestamp from session
// ─────────────────────────────────────────────
function Footer() {
  return (
    <footer className="mt-2 flex flex-col sm:flex-row items-center justify-between gap-2 py-4 border-t border-slate-200 text-xs text-slate-400">
      <div className="flex items-center gap-3">
        <span>© 2026 EduSphere ERP</span>
        <span className="w-px h-3 bg-slate-300" />
        <span>Internal Academic Management System</span>
      </div>
      {/* Backend integration point: last login time from session/auth context */}
      <div className="flex items-center gap-1.5">
        <Clock className="w-3 h-3" />
        <span>Last login: —</span>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// MAIN DASHBOARD PAGE COMPONENT
// ─────────────────────────────────────────────
export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    setSidebarOpen(false); // close sidebar on mobile after nav
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Header */}
      <TopHeader
        onMenuToggle={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
      />

      {/* Left Sidebar */}
      <LeftSidebar
        activeNav={activeNav}
        onNavClick={handleNavClick}
        isOpen={sidebarOpen}
      />

      {/* Main Content Area */}
      <main className="lg:pl-56 pt-14 min-h-screen">
        <div className="px-4 sm:px-6 py-6 max-w-screen-xl mx-auto space-y-5">

          {/* Welcome Panel */}
          <WelcomePanel />

          {/* Overview Metric Cards */}
          <OverviewCards />

          {/* Academic Section: Schedule + Attendance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <TodaysSchedule />
            <AttendanceOverview />
          </div>

          {/* Notices + Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <LatestNotices />
            <RecentActivity />
          </div>

          {/* Quick Access Shortcuts */}
          <QuickAccess />

          {/* Footer */}
          <Footer />
        </div>
      </main>
    </div>
  );
}
