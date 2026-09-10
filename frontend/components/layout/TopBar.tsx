"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  ClipboardCheck,
  Calendar,
  Briefcase,
  Newspaper,
  BookOpen,
  FileText,
  FileCheck,
  BarChart2,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Landmark,
  ExternalLink,
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, getInitials } from "@/components/dashboard/StudentHeader";

// ─── Nav Structure ───────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/timetable", label: "Time Table", icon: Calendar },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/assignments", label: "Assignments", icon: FileText },
  { href: "/examinations", label: "Examinations", icon: FileCheck },
  { href: "/results", label: "Results", icon: BarChart2 },
  { href: "/tpo", label: "TPO", icon: Briefcase },
  { href: "/notices", label: "Notices", icon: Newspaper },
];

const NAV_ACCOUNT = [
  { href: "/profile", label: "My Profile", icon: User, desc: "Personal & Academic Records" },
  { href: "/settings", label: "Settings", icon: Settings, desc: "Security & Preferences" },
  { href: "/support", label: "Help & Support", icon: HelpCircle, desc: "Tickets & FAQ Guide" },
];

const NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Mid-Term Examination Schedule Released",
    desc: "Autumn 2025–26 theory and lab examination dates announced.",
    time: "10m ago",
    unread: true,
    href: "/examinations",
  },
  {
    id: "notif-2",
    title: "Assignment 3 Graded: Cloud Computing",
    desc: "Score: 19/20. Feedback: Comprehensive architecture diagram.",
    time: "2h ago",
    unread: true,
    href: "/assignments",
  },
  {
    id: "notif-3",
    title: "TPO: Microsoft IDC Summer Drive",
    desc: "Application deadline approaching for 3rd year B.Tech candidates.",
    time: "1d ago",
    unread: false,
    href: "/tpo",
  },
];

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUser();

  const fullName = user?.fullName || "Aarav Sharma";
  const enrollmentNo = user?.enrollmentNo || "ST10293";
  const email = user?.email || "st10293@edusphere.edu";
  const role = user?.role ? user.role.toUpperCase() : "STUDENT";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(2);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes("course") || q.includes("sub")) router.push("/courses");
    else if (q.includes("attend")) router.push("/attendance");
    else if (q.includes("time") || q.includes("sched") || q.includes("class")) router.push("/timetable");
    else if (q.includes("assign") || q.includes("task") || q.includes("proj")) router.push("/assignments");
    else if (q.includes("exam") || q.includes("test")) router.push("/examinations");
    else if (q.includes("res") || q.includes("grade") || q.includes("mark") || q.includes("cgpa")) router.push("/results");
    else if (q.includes("tpo") || q.includes("job") || q.includes("place") || q.includes("intern")) router.push("/tpo");
    else if (q.includes("notic") || q.includes("announc")) router.push("/notices");
    else if (q.includes("prof") || q.includes("account")) router.push("/profile");
    else router.push(`/courses?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

  const isLinkActive = (href: string) => {
    return pathname === href || (href === "/dashboard" && pathname === "/");
  };

  return (
    <>
      {/* ── Top Primary Navbar (Sticky Header) ────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3 sm:gap-6">
            {/* ── Brand Logo ────────────────────────────────────── */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 shrink-0 group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col leading-none">
                <div className="flex items-center gap-1.5">
                  <span className="text-[17px] font-bold text-slate-900 tracking-tight">
                    EduSphere
                  </span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded font-mono">
                    ERP
                  </span>
                </div>
                <span className="hidden sm:block text-[11px] text-slate-400 font-medium mt-0.5">
                  Academic Management Portal
                </span>
              </div>
            </Link>

            {/* ── Search Bar ───────────────────────────────────── */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-md relative"
            >
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, assignments, notices, exams..."
                className={cn(
                  "w-full h-9 pl-9 pr-3 rounded-lg text-xs font-medium",
                  "bg-slate-50 border border-slate-200",
                  "placeholder:text-slate-400 text-slate-700",
                  "focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                  "transition-all duration-150"
                )}
              />
            </form>

            {/* ── Right Actions: Notifications & User Profile ─── */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Notifications Popover */}
              <div className="relative" ref={notificationsRef}>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  aria-label="Notifications"
                  className={cn(
                    "relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none",
                    notificationsOpen && "bg-slate-100 text-slate-700"
                  )}
                >
                  <Bell className="w-4.5 h-4.5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => setUnreadCount(0)}
                          className="text-[11px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                          <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                        </button>
                      )}
                    </div>

                    <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                      {NOTIFICATIONS.map((notif) => (
                        <Link
                          key={notif.id}
                          href={notif.href}
                          onClick={() => setNotificationsOpen(false)}
                          className="block px-4 py-3 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-slate-800 leading-snug">
                              {notif.title}
                            </p>
                            <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                              {notif.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                            {notif.desc}
                          </p>
                        </Link>
                      ))}
                    </div>

                    <div className="px-4 pt-2 pb-1 border-t border-slate-100 text-center">
                      <Link
                        href="/notices"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                      >
                        View all notices and circulars
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-5 bg-slate-200 hidden sm:block" />

              {/* User Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={cn(
                    "flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-slate-100 transition-colors group focus:outline-none",
                    profileDropdownOpen && "bg-slate-100"
                  )}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white text-[12px] font-bold flex items-center justify-center shrink-0 font-mono shadow-xs">
                    {getInitials(fullName)}
                  </div>
                  <div className="hidden sm:flex flex-col items-start leading-none text-left">
                    <span className="text-[12px] font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {fullName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {enrollmentNo}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-150 hidden sm:block" />
                </button>

                {/* Profile Menu Popover */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    {/* User Identity Header */}
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold flex items-center justify-center shrink-0 font-mono">
                          {getInitials(fullName)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {fullName}
                          </span>
                          <span className="text-[11px] text-slate-500 truncate">
                            {email}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-1 py-0.2 rounded font-mono">
                              {role}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {enrollmentNo}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Account Links */}
                    <div className="py-1">
                      {NAV_ACCOUNT.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                          >
                            <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                            <div className="flex flex-col">
                              <span>{item.label}</span>
                              <span className="text-[10px] text-slate-400">{item.desc}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Logout Option */}
                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out of Portal</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open mobile navigation menu"
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors focus:outline-none"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Subnav Tabs Bar (Horizontal Links in Navbar) ─────────── */}
        <nav className="border-t border-slate-200/80 bg-slate-50/60 backdrop-blur-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-1.5">
              {NAV_LINKS.map((item) => {
                const Icon = item.icon;
                const active = isLinkActive(item.href);

                return (
                  <Link
                    key={item.href}
                    id={`navbar-tab-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0",
                      active
                        ? "bg-blue-600 text-white shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-3.5 h-3.5 shrink-0",
                        active ? "text-white" : "text-slate-500"
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* ── Responsive Mobile Navigation Drawer ─────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-2xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer panel */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-50 overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <GraduationCap className="w-4.5 h-4.5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-slate-900">EduSphere</span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1 py-0.2 rounded font-mono">
                    ERP
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b border-slate-100">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search portal..."
                  className="w-full h-9 pl-9 pr-3 rounded-lg text-xs bg-slate-50 border border-slate-200 placeholder:text-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </form>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
              {/* Main & Academics */}
              <div>
                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Navigation
                </p>
                <div className="space-y-1">
                  {NAV_LINKS.map((item) => {
                    const Icon = item.icon;
                    const active = isLinkActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors",
                          active
                            ? "bg-blue-50 text-blue-700 font-bold border border-blue-100"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-4 h-4 shrink-0",
                            active ? "text-blue-700" : "text-slate-500"
                          )}
                        />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Account Section */}
              <div>
                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Account & Settings
                </p>
                <div className="space-y-1">
                  {NAV_ACCOUNT.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors",
                          active
                            ? "bg-blue-50 text-blue-700 font-bold border border-blue-100"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-4 h-4 shrink-0",
                            active ? "text-blue-700" : "text-slate-500"
                          )}
                        />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Footer & Logout */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center font-mono shrink-0">
                  {getInitials(fullName)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {fullName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono truncate">
                    {enrollmentNo}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>

              <div className="pt-2 text-center">
                <p className="text-[10px] text-slate-400 font-medium">
                  EduSphere ERP · Learn. Grow. Belong.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
