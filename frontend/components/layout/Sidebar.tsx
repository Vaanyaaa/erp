"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  User,
  Settings,
  HelpCircle,
  Landmark,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Nav Structure ───────────────────────────────────────────────────────────

const NAV_MAIN = [
  { href: "/dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { href: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/timetable",  label: "Time Table", icon: Calendar },
  { href: "/tpo",        label: "TPO",         icon: Briefcase },
  { href: "/notices",    label: "Notices",     icon: Newspaper },
];

const NAV_ACADEMICS = [
  { href: "/courses",      label: "Courses",      icon: BookOpen },
  { href: "/assignments",  label: "Assignments",  icon: FileText },
  { href: "/examinations", label: "Examinations", icon: FileCheck },
  { href: "/results",      label: "Results",      icon: BarChart2 },
];

const NAV_ACCOUNT = [
  { href: "/profile",  label: "Profile",       icon: User },
  { href: "/settings", label: "Settings",      icon: Settings },
  { href: "/support",  label: "Help & Support", icon: HelpCircle },
];

// ─── NavLink ─────────────────────────────────────────────────────────────────

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 group",
        active
          ? "bg-white/15 text-white"
          : "text-slate-300 hover:bg-white/10 hover:text-white"
      )}
    >
      <Icon
        className={cn(
          "w-[17px] h-[17px] shrink-0 transition-colors",
          active ? "text-white" : "text-slate-400 group-hover:text-slate-200"
        )}
      />
      <span>{label}</span>
      {active && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
      )}
    </Link>
  );
}

// ─── NavSection ──────────────────────────────────────────────────────────────

function NavSection({
  title,
  items,
  pathname,
  onNavClick,
}: {
  title?: string;
  items: { href: string; label: string; icon: React.ElementType }[];
  pathname: string;
  onNavClick?: () => void;
}) {
  return (
    <div className="space-y-0.5">
      {title && (
        <p className="px-3 pt-4 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 select-none">
          {title}
        </p>
      )}
      {items.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          active={
            pathname === item.href ||
            (item.href === "/dashboard" && pathname === "/")
          }
          onClick={onNavClick}
        />
      ))}
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export function Sidebar({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          // Base
          "fixed top-0 left-0 z-40 h-full w-56 flex flex-col",
          // Color
          "bg-[#1a3355]",
          // Desktop: always visible
          "md:relative md:translate-x-0 md:z-auto",
          // Mobile: slide in/out
          open ? "translate-x-0" : "-translate-x-full",
          "transition-transform duration-200 ease-in-out md:transition-none"
        )}
      >
        {/* ── Header / Brand ────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 pt-5 pb-4 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-sm group-hover:bg-blue-400 transition-colors shrink-0">
              <GraduationCap className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold text-white tracking-tight">
                  EduSphere
                </span>
                <span className="text-[9px] font-bold text-blue-300 bg-white/10 border border-white/20 px-1 py-0.5 rounded font-mono leading-none">
                  ERP
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                Academic Management Portal
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Navigation ───────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0">
          <NavSection
            items={NAV_MAIN}
            pathname={pathname}
            onNavClick={onClose}
          />
          <NavSection
            title="Academics"
            items={NAV_ACADEMICS}
            pathname={pathname}
            onNavClick={onClose}
          />
          <NavSection
            title="Account"
            items={NAV_ACCOUNT}
            pathname={pathname}
            onNavClick={onClose}
          />
        </nav>

        {/* ── Footer tagline ───────────────────────────────────── */}
        <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Landmark className="w-3.5 h-3.5 text-slate-300" />
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-tight">
            Learn.
            <br />
            Grow.
            <br />
            Belong.
          </p>
        </div>
      </aside>
    </>
  );
}
