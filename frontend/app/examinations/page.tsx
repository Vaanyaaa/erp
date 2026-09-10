"use client";

import React from "react";
import {
  FileCheck,
  Calendar,
  Clock,
  MapPin,
  Download,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

const EXAMS = [
  {
    code: "IT501",
    name: "Computer Networks & Security",
    type: "Theory (End-Semester)",
    date: "Sep 22, 2025",
    time: "10:00 AM – 01:00 PM",
    room: "Exam Hall A-102",
    seat: "Row 3, Seat 14",
    status: "Hall Ticket Released",
  },
  {
    code: "IT502",
    name: "Cloud Computing & Virtualization",
    type: "Theory (End-Semester)",
    date: "Sep 25, 2025",
    time: "10:00 AM – 01:00 PM",
    room: "Exam Hall A-104",
    seat: "Row 2, Seat 08",
    status: "Hall Ticket Released",
  },
  {
    code: "IT503L",
    name: "Database Management Systems Lab",
    type: "Practical / Viva",
    date: "Sep 28, 2025",
    time: "09:00 AM – 12:00 PM",
    room: "Computer Center Lab 2",
    seat: "Terminal 24",
    status: "Scheduled",
  },
  {
    code: "IT504",
    name: "Software Engineering & Agile Methodologies",
    type: "Theory (End-Semester)",
    date: "Oct 01, 2025",
    time: "10:00 AM – 01:00 PM",
    room: "Exam Hall B-201",
    seat: "Row 4, Seat 19",
    status: "Scheduled",
  },
  {
    code: "IT505",
    name: "Theory of Computation & Automata",
    type: "Theory (End-Semester)",
    date: "Oct 04, 2025",
    time: "10:00 AM – 01:00 PM",
    room: "Exam Hall B-203",
    seat: "Row 1, Seat 05",
    status: "Scheduled",
  },
];

export default function ExaminationsPage() {
  return (
    <AppShell>
      <div className="px-6 py-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Examination Portal
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Mid-Semester & End-Semester Schedules, Seating Plans & Hall Tickets
            </p>
          </div>

          <button
            onClick={() => alert("Downloading Mid-Sem Hall Ticket...")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            Download Hall Ticket (PDF)
          </button>
        </div>

        {/* Eligibility Notice */}
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-emerald-800">
              Examination Eligibility Cleared
            </p>
            <p className="text-emerald-700 mt-0.5">
              Your overall attendance is 88.6% (≥ 75% threshold). You are permitted to appear in all scheduled theory & practical examinations.
            </p>
          </div>
        </div>

        {/* Exams Table */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Upcoming End-Semester Examination Schedule
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              5 Papers Registered
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {EXAMS.map((exam) => (
              <div
                key={exam.code}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {exam.code}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {exam.name}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                      {exam.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {exam.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {exam.time}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {exam.room} ({exam.seat})
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {exam.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
