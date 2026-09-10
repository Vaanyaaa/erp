"use client";

import React from "react";
import { BarChart2, Award, TrendingUp, CheckCircle2, Download } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

const SEMESTERS = [
  {
    semester: "Semester 4 (Even 2024–25)",
    sgpa: 9.10,
    credits: 22,
    status: "Passed (Distinction)",
    subjects: [
      { code: "IT401", name: "Operating Systems", grade: "A+", points: 10 },
      { code: "IT402", name: "Design & Analysis of Algorithms", grade: "A", points: 9 },
      { code: "IT403", name: "Computer Architecture", grade: "A+", points: 10 },
      { code: "IT404L", name: "OS & Systems Programming Lab", grade: "O", points: 10 },
    ],
  },
  {
    semester: "Semester 3 (Odd 2024–25)",
    sgpa: 8.85,
    credits: 20,
    status: "Passed (First Class)",
    subjects: [
      { code: "IT301", name: "Data Structures & Algorithms", grade: "A+", points: 10 },
      { code: "IT302", name: "Discrete Mathematics", grade: "A", points: 9 },
      { code: "IT303", name: "Digital Logic Design", grade: "B+", points: 8 },
      { code: "IT304L", name: "DSA Practical Lab", grade: "O", points: 10 },
    ],
  },
];

export default function ResultsPage() {
  return (
    <AppShell>
      <div className="px-6 py-6 max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <BarChart2 className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Academic Results & Transcripts
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Semester Grade Point Average (SGPA) and Cumulative GPA (CGPA) Records
            </p>
          </div>

          <button
            onClick={() => alert("Downloading official grade card transcript...")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            Download Official Transcript
          </button>
        </div>

        {/* CGPA Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase">Cumulative CGPA</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-slate-900">8.92</h2>
              <span className="text-xs font-bold text-emerald-600">/ 10.0</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Across 4 completed semesters</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Credits Cleared</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-slate-900">84</h2>
              <span className="text-xs font-bold text-slate-500">Credits</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Zero active backlogs</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase">Latest SGPA</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-black text-blue-700">9.10</h2>
              <span className="text-xs font-bold text-blue-600">Sem 4</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +0.25 from Sem 3
            </span>
          </div>
        </div>

        {/* Semester Results Breakdown */}
        <div className="space-y-4">
          {SEMESTERS.map((sem, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs"
            >
              <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{sem.semester}</h3>
                  <span className="text-xs text-slate-500">{sem.credits} Earned Credits • {sem.status}</span>
                </div>
                <span className="font-extrabold text-blue-700 text-sm bg-blue-50 border border-blue-200 px-3 py-1 rounded-md">
                  SGPA: {sem.sgpa.toFixed(2)}
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {sem.subjects.map((sub) => (
                  <div
                    key={sub.code}
                    className="px-5 py-3 flex items-center justify-between text-xs hover:bg-slate-50/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {sub.code}
                      </span>
                      <span className="font-semibold text-slate-800">{sub.name}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 font-mono">Grade Points: {sub.points}</span>
                      <span className="font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {sub.grade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
