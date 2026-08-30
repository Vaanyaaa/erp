"use client";

import React from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  Clock,
  FileText,
  Award,
  Bell,
  User,
  MapPin,
  Flame,
  ChevronRight,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useUser,
  StudentHeaderNav,
  StudentProfileBanner,
  StudentFooter,
} from "@/components/dashboard/StudentHeader";

// ─────────────────────────────────────────────
// OVERVIEW CARDS
// ─────────────────────────────────────────────
function DashboardOverviewCards() {
  const cards = [
    {
      id: "attendance",
      title: "Attendance",
      metric: "88.5%",
      subtitle: "124 of 140 classes attended",
      badge: "≥ 75% Target Satisfied",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: ClipboardCheck,
      iconBg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      progress: 88.5,
      progressColor: "bg-emerald-600",
      href: "/attendance",
    },
    {
      id: "upcoming_classes",
      title: "Upcoming Classes",
      metric: "3 Classes",
      subtitle: "Next: Cloud Computing at 10:30 AM",
      badge: "Today's Schedule",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Clock,
      iconBg: "bg-blue-50 text-blue-700 border border-blue-200",
      progress: 50,
      progressColor: "bg-blue-600",
      href: "/timetable",
    },
    {
      id: "assignments",
      title: "Assignments",
      metric: "2 Pending",
      subtitle: "Next due: Data Structures Lab in 2 days",
      badge: "14 Submitted",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      icon: FileText,
      iconBg: "bg-amber-50 text-amber-700 border border-amber-200",
      progress: 87.5,
      progressColor: "bg-amber-600",
      href: "#",
    },
    {
      id: "recent_results",
      title: "Recent Results",
      metric: "8.92 CGPA",
      subtitle: "Sem 4 SGPA: 9.10 • Top 5% Rank",
      badge: "Semester 5 Active",
      badgeColor: "bg-violet-50 text-violet-700 border-violet-200",
      icon: Award,
      iconBg: "bg-violet-50 text-violet-700 border border-violet-200",
      progress: 89.2,
      progressColor: "bg-violet-600",
      href: "/tpo",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.id}
            href={card.href}
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-150 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", card.iconBg)}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-md border", card.badgeColor)}>
                  {card.badge}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.title}</p>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 group-hover:text-blue-700 transition-colors">
                {card.metric}
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{card.subtitle}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="w-3/4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-300", card.progressColor)}
                  style={{ width: `${card.progress}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-blue-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                View <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// TODAY'S SCHEDULE SECTION
// ─────────────────────────────────────────────
function TodaysScheduleSection() {
  const schedule = [
    {
      id: 1,
      time: "09:00 AM – 10:30 AM",
      subject: "Computer Networks & Security",
      code: "IT501",
      faculty: "Prof. Anil Verma",
      room: "Room 402, Block B",
      type: "Lecture",
      status: "Completed",
      statusColor: "bg-slate-100 text-slate-600 border-slate-200",
    },
    {
      id: 2,
      time: "10:45 AM – 12:15 PM",
      subject: "Cloud Computing & Virtualization",
      code: "IT502",
      faculty: "Dr. Rajesh Sharma",
      room: "Room 405, Block B",
      type: "Lecture",
      status: "Upcoming (Next)",
      statusColor: "bg-blue-50 text-blue-700 border-blue-200 font-semibold",
    },
    {
      id: 3,
      time: "01:15 PM – 02:45 PM",
      subject: "Database Management Systems Lab",
      code: "IT503L",
      faculty: "Prof. Sunita Mehra",
      room: "Software Lab 3, 2nd Floor",
      type: "Practical / Lab",
      status: "Scheduled",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: 4,
      time: "03:00 PM – 04:30 PM",
      subject: "Software Engineering & Agile Methodologies",
      code: "IT504",
      faculty: "Dr. Priya Nair",
      room: "Room 302, Block A",
      type: "Lecture",
      status: "Scheduled",
      statusColor: "bg-slate-100 text-slate-600 border-slate-200",
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Clock className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Today&apos;s Schedule</h2>
            <p className="text-[11px] text-slate-500">Wednesday, Autumn Term 2025</p>
          </div>
        </div>
        <Link
          href="/timetable"
          className="text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline flex items-center gap-0.5"
        >
          Full Timetable <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="p-4 sm:p-5 space-y-3">
        {schedule.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-slate-200/80 bg-white hover:border-slate-300 transition-all gap-3"
          >
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex flex-col items-center justify-center shrink-0 border border-slate-200 font-mono">
                <span className="text-[8px] font-bold text-slate-400 uppercase">Period</span>
                <span className="text-xs font-bold text-slate-800 leading-none">{item.id}</span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-900">{item.subject}</span>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                    {item.code}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {item.faculty}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {item.room}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {item.time}
              </span>
              <span className={cn("text-[10px] px-2 py-0.5 rounded-md border", item.statusColor)}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// RECENT NOTICES SECTION
// ─────────────────────────────────────────────
function RecentNoticesSection() {
  const notices = [
    {
      id: 1,
      title: "Mid-Semester Examination Schedule - Autumn 2025 Announced",
      category: "Examination",
      categoryColor: "bg-violet-50 text-violet-700 border-violet-200",
      date: "Aug 28, 2025",
      isImportant: true,
      description: "Theory & practical exam date sheet released. Hall tickets will be downloadable from student portal starting next Monday.",
    },
    {
      id: 2,
      title: "TPO Campus Drive: Microsoft & Amazon Summer Internship 2026",
      category: "TPO / Placement",
      categoryColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      date: "Aug 26, 2025",
      isImportant: true,
      description: "Eligible B.Tech IT & CSE 3rd Year students with CGPA ≥ 8.0 must register on the TPO portal before Sep 5.",
    },
    {
      id: 3,
      title: "Submission Deadline Extension for Mini Project Milestone 2",
      category: "Academic",
      categoryColor: "bg-blue-50 text-blue-700 border-blue-200",
      date: "Aug 24, 2025",
      isImportant: false,
      description: "Department has extended project milestone submission by 3 days. Upload documentation directly to course repository.",
    },
    {
      id: 4,
      title: "Digital Library Access & IEEE Explore Resource Portal Update",
      category: "Library",
      categoryColor: "bg-amber-50 text-amber-700 border-amber-200",
      date: "Aug 20, 2025",
      isImportant: false,
      description: "Off-campus proxy login credentials for IEEE, ACM, and Springer digital libraries have been updated for all enrolled students.",
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
            <Bell className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Notices</h2>
            <p className="text-[11px] text-slate-500">Official campus updates & circulars</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          4 Circulars
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-3">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="p-3.5 rounded-lg border border-slate-200/80 bg-white hover:border-slate-300 transition-all space-y-1.5"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border", notice.categoryColor)}>
                  {notice.category}
                </span>
                {notice.isImportant && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-rose-600" />
                    Important
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">{notice.date}</span>
            </div>

            <h3 className="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-700 transition-colors">
              {notice.title}
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              {notice.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD PAGE
// ─────────────────────────────────────────────
export default function DashboardPage() {
  const { user, logout } = useUser();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col">
      <StudentHeaderNav user={user} onLogout={logout} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <StudentProfileBanner user={user} />
        <DashboardOverviewCards />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <TodaysScheduleSection />
          </div>
          <div className="lg:col-span-5">
            <RecentNoticesSection />
          </div>
        </div>
      </main>

      <StudentFooter user={user} />
    </div>
  );
}
