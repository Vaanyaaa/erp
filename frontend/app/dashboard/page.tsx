"use client";

import React from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  Calendar,
  FileText,
  Newspaper,
  FileCheck,
  Megaphone,
  BarChart2,
  ArrowRight,
  Clock,
  User,
  MapPin,
  Flame,
  CheckCircle2,
  Sprout,
  AlertCircle,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useUser } from "@/components/dashboard/StudentHeader";
import { cn } from "@/lib/utils";

// ─── Greeting helper ──────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// ─── Quick Action Card ────────────────────────────────────────────────────────
function QuickAction({
  href,
  icon: Icon,
  label,
  sublabel,
  iconBg,
  iconColor,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  sublabel: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-3 p-5 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-blue-300 hover:shadow-md transition-all duration-150 group text-center"
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} group-hover:scale-105 transition-transform duration-150`}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-[13px] font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
          {label}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{sublabel}</p>
      </div>
    </Link>
  );
}

// ─── Section Card wrapper ─────────────────────────────────────────────────────
function SectionCard({
  title,
  linkHref,
  linkLabel,
  icon: Icon,
  children,
}: {
  title: string;
  linkHref: string;
  linkLabel: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-slate-400" />
          <h2 className="text-[13px] font-bold text-slate-800">{title}</h2>
        </div>
        <Link
          href={linkHref}
          className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          {linkLabel}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      {children}
    </div>
  );
}

// ─── Live Data for Widgets ───────────────────────────────────────────────────

const TODAY_SCHEDULE = [
  {
    period: "01",
    time: "09:00 AM – 10:30 AM",
    subject: "Computer Networks & Security",
    code: "IT501",
    faculty: "Prof. Anil Verma",
    room: "Lab 3 (3rd Floor)",
    status: "Completed",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    period: "02",
    time: "10:45 AM – 12:15 PM",
    subject: "Cloud Computing & Virtualization",
    code: "IT502",
    faculty: "Dr. Rajesh Sharma",
    room: "LH 402",
    status: "In Progress",
    statusColor: "bg-blue-50 text-blue-700 border-blue-200 font-semibold animate-pulse",
  },
  {
    period: "03",
    time: "01:30 PM – 03:30 PM",
    subject: "Database Management Systems Lab",
    code: "IT503L",
    faculty: "Prof. Sunita Mehra",
    room: "CC Lab 1",
    status: "Upcoming",
    statusColor: "bg-slate-50 text-slate-600 border-slate-200",
  },
];

const UPCOMING_ASSIGNMENTS = [
  {
    id: "asg-1",
    title: "Packet Tracer Network Simulation & Subnetting",
    courseCode: "IT501",
    dueDate: "Tomorrow",
    dueTime: "11:59 PM",
    points: 25,
    status: "Due Soon",
    statusColor: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    id: "asg-2",
    title: "AWS Multi-Tier Architecture Case Study",
    courseCode: "IT502",
    dueDate: "Sep 10",
    dueTime: "05:00 PM",
    points: 30,
    status: "Pending",
    statusColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: "asg-3",
    title: "Relational Normalization & SQL Queries",
    courseCode: "IT503L",
    dueDate: "Sep 14",
    dueTime: "11:59 PM",
    points: 20,
    status: "Pending",
    statusColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
];

const LATEST_NOTICES = [
  {
    id: 1,
    title: "Mid-Semester Examination Schedule - Autumn 2025 Announced",
    category: "Examination",
    categoryColor: "bg-violet-50 text-violet-700 border-violet-200",
    date: "Aug 28",
    isImportant: true,
    description: "Theory & practical exam date sheet released. Hall tickets downloadable next Monday.",
  },
  {
    id: 2,
    title: "TPO Campus Drive: Microsoft & Amazon Summer Internship 2026",
    category: "TPO",
    categoryColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    date: "Aug 26",
    isImportant: true,
    description: "Eligible B.Tech IT & CSE 3rd Year students with CGPA ≥ 8.0 register before Sep 5.",
  },
  {
    id: 3,
    title: "Submission Deadline Extension for Mini Project Milestone 2",
    category: "Academic",
    categoryColor: "bg-blue-50 text-blue-700 border-blue-200",
    date: "Aug 24",
    isImportant: false,
    description: "Department has extended project milestone submission by 3 days.",
  },
];

const ATTENDANCE_STATS = {
  percentage: 88.6,
  present: 124,
  total: 140,
  margin: 19,
  subjects: [
    { code: "IT501", name: "Networks", pct: 93.3 },
    { code: "IT505", name: "Theory of Comp", pct: 90.6 },
    { code: "IT503L", name: "DBMS Lab", pct: 87.5 },
    { code: "IT502", name: "Cloud Comp", pct: 86.6 },
  ],
};

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useUser();
  const firstName = user?.fullName?.split(" ")[0] || "Aarav";

  const quickActions = [
    {
      href: "/attendance",
      icon: ClipboardCheck,
      label: "Attendance",
      sublabel: "View your attendance records",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      href: "/timetable",
      icon: Calendar,
      label: "View Time Table",
      sublabel: "Check your upcoming classes",
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      href: "/assignments",
      icon: FileText,
      label: "Assignments",
      sublabel: "View and submit assignments",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      href: "/notices",
      icon: Megaphone,
      label: "Notices",
      sublabel: "Stay updated with announcements",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      href: "/examinations",
      icon: FileCheck,
      label: "Examinations",
      sublabel: "Check exam schedules and details",
      iconBg: "bg-rose-50",
      iconColor: "text-rose-500",
    },
  ];

  // SVG circular circumference for attendance gauge
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (ATTENDANCE_STATS.percentage / 100) * circumference;

  return (
    <AppShell>
      <div className="px-6 py-6 max-w-6xl mx-auto space-y-6">

        {/* ── Welcome Banner ─────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white px-7 py-6 shadow-sm">
          {/* Background decoration */}
          <div className="absolute right-0 top-0 bottom-0 w-64 opacity-10 pointer-events-none select-none flex items-center justify-end pr-8">
            <svg viewBox="0 0 200 200" className="w-56 h-56 text-white fill-current">
              <circle cx="100" cy="60" r="40" />
              <rect x="40" y="110" width="120" height="80" rx="8" />
              <rect x="60" y="90" width="80" height="30" rx="4" />
            </svg>
          </div>

          <div className="relative">
            <p className="text-blue-200 text-[13px] font-medium mb-1">
              {getGreeting()},
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight">
              {firstName} 👋
            </h1>
            <p className="text-blue-100 text-[13px] mt-1.5 font-medium">
              Here&apos;s what&apos;s happening today.
            </p>
          </div>

          {/* Quote chip */}
          <div className="absolute bottom-5 right-6 hidden sm:block">
            <p className="text-[11px] text-blue-200 italic max-w-[180px] text-right leading-snug">
              &ldquo;A little progress each day adds up to big results.&rdquo;
            </p>
          </div>
        </div>

        {/* ── Quick Actions ──────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">
              Quick Actions
            </h2>
            <Link
              href="/timetable"
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              See all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {quickActions.map((action) => (
              <QuickAction key={action.href} {...action} />
            ))}
          </div>
        </div>

        {/* ── Schedule + Assignments row ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Today's Schedule Card */}
          <SectionCard
            title="Today's Schedule"
            linkHref="/timetable"
            linkLabel="Full Timetable"
            icon={Calendar}
          >
            <div className="p-4 space-y-2.5">
              {TODAY_SCHEDULE.map((item) => (
                <div
                  key={item.period}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex flex-col items-center justify-center shrink-0 font-mono">
                      <span className="text-[8px] font-bold text-slate-400 uppercase leading-none">P</span>
                      <span className="text-xs font-bold text-slate-800 leading-none mt-0.5">{item.period}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {item.subject}
                        </span>
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          {item.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[11px] text-slate-400 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1 text-slate-600 font-medium">
                          <User className="w-3 h-3 text-slate-400" />
                          {item.faculty}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.room}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.time.split("–")[0].trim()}
                    </span>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded border font-semibold", item.statusColor)}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Upcoming Assignments Card */}
          <SectionCard
            title="Upcoming Assignments"
            linkHref="/assignments"
            linkLabel="View All (3)"
            icon={FileText}
          >
            <div className="p-4 space-y-2.5">
              {UPCOMING_ASSIGNMENTS.map((asg) => (
                <div
                  key={asg.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all gap-3"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {asg.courseCode}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {asg.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Due: <strong className="text-slate-700">{asg.dueDate}</strong>, {asg.dueTime}
                      </span>
                      <span>•</span>
                      <span>{asg.points} pts</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border", asg.statusColor)}>
                      {asg.status}
                    </span>
                    <Link
                      href="/assignments"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                    >
                      Submit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* ── Notices + Attendance row ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Latest Notices Card */}
          <SectionCard
            title="Latest Notices"
            linkHref="/notices"
            linkLabel="View All (4)"
            icon={Megaphone}
          >
            <div className="p-4 space-y-2.5">
              {LATEST_NOTICES.map((notice) => (
                <Link
                  key={notice.id}
                  href="/notices"
                  className="block p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all space-y-1 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[10px] font-bold px-1.5 py-0.2 rounded border", notice.categoryColor)}>
                        {notice.category}
                      </span>
                      {notice.isImportant && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5 text-rose-600" />
                          Important
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">{notice.date}</span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                    {notice.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {notice.description}
                  </p>
                </Link>
              ))}
            </div>
          </SectionCard>

          {/* Attendance Overview Card */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-slate-400" />
                  <h2 className="text-[13px] font-bold text-slate-800">
                    Attendance Overview
                  </h2>
                </div>
                <Link
                  href="/attendance"
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                >
                  View Details <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-5">
                  {/* Radial Progress Meter */}
                  <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                    <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 80 80">
                      <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="7"
                        fill="transparent"
                        className="text-slate-100"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="7"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="text-emerald-500 transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-sm font-extrabold text-slate-900 leading-none">
                        {ATTENDANCE_STATS.percentage}%
                      </span>
                      <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Overall</span>
                    </div>
                  </div>

                  {/* Summary & Safe Margin */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        {ATTENDANCE_STATS.present} of {ATTENDANCE_STATS.total} Attended
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[10px]">
                        <CheckCircle2 className="w-3 h-3" />
                        Criteria Satisfied
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      You are <strong className="text-emerald-700">+{ATTENDANCE_STATS.margin} classes</strong> ahead of the minimum 75% examination eligibility requirement.
                    </p>
                  </div>
                </div>

                {/* Subject Mini Progress Indicators */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
                  {ATTENDANCE_STATS.subjects.map((sub) => (
                    <div key={sub.code} className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                        <span className="text-slate-700 truncate">{sub.code}</span>
                        <span className={sub.pct >= 90 ? "text-emerald-700 font-bold" : "text-blue-700 font-bold"}>
                          {sub.pct}%
                        </span>
                      </div>
                      <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${sub.pct >= 90 ? "bg-emerald-500" : "bg-blue-600"}`}
                          style={{ width: `${sub.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Motivational streak chip */}
            <div className="mx-5 mb-5 px-4 py-2.5 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center gap-3">
              <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[12px] font-bold text-emerald-700 leading-none">
                  Eligible for all 5 End-Sem Exams
                </p>
                <p className="text-[11px] text-emerald-600 mt-0.5 leading-none">
                  Keep up the great attendance record!
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
