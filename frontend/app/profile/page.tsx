"use client";

import React from "react";
import {
  User,
  GraduationCap,
  Hash,
  BookOpen,
  CalendarDays,
  ShieldCheck,
  Landmark,
  Mail,
  Phone,
  MapPin,
  Award,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useUser, getInitials } from "@/components/dashboard/StudentHeader";

export default function ProfilePage() {
  const { user } = useUser();

  const studentDetails = [
    { label: "Student Full Name", value: user?.fullName || "Aarav Sharma", icon: User },
    { label: "University Roll / Student ID", value: user?.studentId || "2023IT0482", icon: Hash },
    { label: "Academic Department / Branch", value: user?.department || "Information Technology", icon: BookOpen },
    { label: "Current Year of Study", value: user?.year || "3rd Year", icon: CalendarDays },
    { label: "Academic Semester", value: user?.semester || "5th Semester", icon: GraduationCap },
    { label: "Current Academic Session", value: user?.academicSession || "2025–2026 (Odd Sem)", icon: Landmark },
    { label: "Academic Standing / Status", value: user?.academicStatus || "Good Standing • Examination Eligible", icon: ShieldCheck, isBadge: true },
    { label: "Current Cumulative CGPA", value: "8.92 / 10.0", icon: Award },
  ];

  return (
    <AppShell>
      <div className="px-6 py-6 max-w-4xl mx-auto space-y-6">
        {/* Profile Card Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center text-2xl font-black shadow-md shrink-0">
            {getInitials(user?.fullName || "Aarav Sharma")}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">
                  {user?.fullName || "Aarav Sharma"}
                </h1>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  ID: {user?.studentId || "2023IT0482"} • B.Tech IT
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold self-center sm:self-auto">
                <ShieldCheck className="w-3.5 h-3.5" />
                Active Enrolled
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user?.email || "aarav.sharma@college.edu"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Main Campus, Technology Block
              </span>
            </div>
          </div>
        </div>

        {/* Academic Details Section */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2.5">
            <GraduationCap className="w-4 h-4 text-blue-700" />
            <h2 className="text-sm font-bold text-slate-900">
              Academic Credentials & Institutional Records
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {studentDetails.map((detail, index) => {
              const Icon = detail.icon;
              return (
                <div
                  key={index}
                  className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                      {detail.label}
                    </span>
                  </div>

                  <div className="sm:text-right pl-11 sm:pl-0">
                    {detail.isBadge ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {detail.value}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-800">
                        {detail.value}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
