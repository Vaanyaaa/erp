"use client";

import React, { useState } from "react";
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  TrendingUp,
  User,
  Clock,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/components/dashboard/StudentHeader";
import { AppShell } from "@/components/layout/AppShell";

interface SubjectAttendance {
  id: string;
  name: string;
  code: string;
  faculty: string;
  type: "Theory" | "Practical" | "Tutorial";
  present: number;
  absent: number;
  total: number;
  percentage: number;
  requiredMargin: number;
}

const SUBJECT_ATTENDANCE: SubjectAttendance[] = [
  {
    id: "it501",
    name: "Computer Networks & Security",
    code: "IT501",
    faculty: "Prof. Anil Verma",
    type: "Theory",
    present: 28,
    absent: 2,
    total: 30,
    percentage: 93.3,
    requiredMargin: 5,
  },
  {
    id: "it502",
    name: "Cloud Computing & Virtualization",
    code: "IT502",
    faculty: "Dr. Rajesh Sharma",
    type: "Theory",
    present: 26,
    absent: 4,
    total: 30,
    percentage: 86.6,
    requiredMargin: 3,
  },
  {
    id: "it503l",
    name: "Database Management Systems Lab",
    code: "IT503L",
    faculty: "Prof. Sunita Mehra",
    type: "Practical",
    present: 14,
    absent: 2,
    total: 16,
    percentage: 87.5,
    requiredMargin: 2,
  },
  {
    id: "it504",
    name: "Software Engineering & Agile Methodologies",
    code: "IT504",
    faculty: "Dr. Priya Nair",
    type: "Theory",
    present: 27,
    absent: 5,
    total: 32,
    percentage: 84.3,
    requiredMargin: 3,
  },
  {
    id: "it505",
    name: "Theory of Computation & Automata",
    code: "IT505",
    faculty: "Prof. Vikas Gupta",
    type: "Theory",
    present: 29,
    absent: 3,
    total: 32,
    percentage: 90.6,
    requiredMargin: 5,
  },
];

export default function AttendancePage() {
  const { user, logout } = useUser();
  const [filterType, setFilterType] = useState<"All" | "Theory" | "Practical">("All");

  const totalClasses = SUBJECT_ATTENDANCE.reduce((acc, s) => acc + s.total, 0);
  const totalPresent = SUBJECT_ATTENDANCE.reduce((acc, s) => acc + s.present, 0);
  const totalAbsent = SUBJECT_ATTENDANCE.reduce((acc, s) => acc + s.absent, 0);
  const overallPercentage = Number(((totalPresent / totalClasses) * 100).toFixed(1));

  const filteredSubjects = SUBJECT_ATTENDANCE.filter(
    (s) => filterType === "All" || s.type === filterType
  );

  return (
    <AppShell>
      <div className="px-6 py-6 max-w-6xl mx-auto space-y-6">

        {/* Top Summary Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Main Overall Percentage Card */}
          <div className="md:col-span-6 lg:col-span-5 rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Overall Attendance
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Criteria Satisfied (≥75%)
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                  {overallPercentage}%
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  {totalPresent} of {totalClasses} classes attended
                </span>
              </div>

              {/* Progress Indicator Bar */}
              <div className="mt-4 space-y-1.5">
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${overallPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>0%</span>
                  <span className="font-semibold text-amber-700">75% Minimum Requirement</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Safe buffer margin:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                +12 Classes Buffer
              </span>
            </div>
          </div>

          {/* Present & Absent Counts Cards */}
          <div className="md:col-span-6 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Present Count Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Present</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{totalPresent} Classes</h3>
                <p className="text-xs text-slate-500 mt-1">Conducted across all subjects</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-emerald-700 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> High regular attendance record
              </div>
            </div>

            {/* Absent Count Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center mb-3">
                  <XCircle className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Absent</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{totalAbsent} Classes</h3>
                <p className="text-xs text-slate-500 mt-1">Approved & medical leaves included</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                Authorized Leave: 8 • Unexcused: 8
              </div>
            </div>
          </div>
        </div>

        {/* Subject-Wise Attendance Breakdown Section */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50 gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Subject-Wise Attendance Breakdown</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Detailed lecture & laboratory attendance for Autumn Semester 2025.
              </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-slate-200 text-xs font-semibold">
              {(["All", "Theory", "Practical"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={cn(
                    "px-3 py-1 rounded-md transition-colors cursor-pointer",
                    filterType === type
                      ? "bg-blue-700 text-white shadow-2xs"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Faculty</th>
                  <th className="py-3 px-4 text-center">Present</th>
                  <th className="py-3 px-4 text-center">Absent</th>
                  <th className="py-3 px-4 text-center">Total</th>
                  <th className="py-3 px-4">Percentage & Progress</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubjects.map((sub) => {
                  const isGood = sub.percentage >= 85;
                  const isMedium = sub.percentage >= 75 && sub.percentage < 85;
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{sub.name}</div>
                        <div className="font-mono text-[11px] text-slate-400 font-medium">{sub.code}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[10px]">
                          {sub.type}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{sub.faculty}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-emerald-700">
                        {sub.present}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-rose-600">
                        {sub.absent}
                      </td>

                      <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                        {sub.total}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1 w-36 sm:w-44">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className={cn(isGood ? "text-emerald-700" : isMedium ? "text-blue-700" : "text-amber-700")}>
                              {sub.percentage}%
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              Min 75%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-300",
                                isGood ? "bg-emerald-600" : isMedium ? "bg-blue-600" : "bg-amber-600"
                              )}
                              style={{ width: `${sub.percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[10px]">
                          <CheckCircle2 className="w-3 h-3" />
                          Eligible
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
