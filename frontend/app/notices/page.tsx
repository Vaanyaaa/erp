"use client";

import React from "react";
import { Bell, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/components/dashboard/StudentHeader";
import { AppShell } from "@/components/layout/AppShell";

const notices = [
  {
    id: 1,
    title: "Mid-Semester Examination Schedule - Autumn 2025 Announced",
    category: "Examination",
    categoryColor: "bg-violet-50 text-violet-700 border-violet-200",
    date: "Aug 28, 2025",
    isImportant: true,
    description:
      "Theory & practical exam date sheet released. Hall tickets will be downloadable from student portal starting next Monday.",
  },
  {
    id: 2,
    title: "TPO Campus Drive: Microsoft & Amazon Summer Internship 2026",
    category: "TPO / Placement",
    categoryColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    date: "Aug 26, 2025",
    isImportant: true,
    description:
      "Eligible B.Tech IT & CSE 3rd Year students with CGPA ≥ 8.0 must register on the TPO portal before Sep 5.",
  },
  {
    id: 3,
    title: "Submission Deadline Extension for Mini Project Milestone 2",
    category: "Academic",
    categoryColor: "bg-blue-50 text-blue-700 border-blue-200",
    date: "Aug 24, 2025",
    isImportant: false,
    description:
      "Department has extended project milestone submission by 3 days. Upload documentation directly to course repository.",
  },
  {
    id: 4,
    title: "Digital Library Access & IEEE Explore Resource Portal Update",
    category: "Library",
    categoryColor: "bg-amber-50 text-amber-700 border-amber-200",
    date: "Aug 20, 2025",
    isImportant: false,
    description:
      "Off-campus proxy login credentials for IEEE, ACM, and Springer digital libraries have been updated for all enrolled students.",
  },
];

export default function NoticesPage() {
  const { user, logout } = useUser();

  return (
    <AppShell>
      <div className="px-6 py-6 max-w-4xl mx-auto space-y-4">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Notices & Circulars
            </h1>
            <p className="text-xs text-slate-500">
              Official campus updates · Autumn Term 2025
            </p>
          </div>
          <span className="ml-auto text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
            {notices.length} Circulars
          </span>
        </div>

        {/* Notice Cards */}
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="rounded-xl border border-slate-200 bg-white shadow-xs p-4 sm:p-5 space-y-2 hover:border-slate-300 transition-all"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-md border",
                    notice.categoryColor
                  )}
                >
                  {notice.category}
                </span>
                {notice.isImportant && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-rose-600" />
                    Important
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {notice.date}
              </span>
            </div>

            <h2 className="text-sm font-bold text-slate-900 leading-snug">
              {notice.title}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {notice.description}
            </p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

