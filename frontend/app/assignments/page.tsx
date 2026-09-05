"use client";

import React, { useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Calendar,
  Filter,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";

interface Assignment {
  id: string;
  title: string;
  course: string;
  courseCode: string;
  faculty: string;
  dueDate: string;
  dueTime: string;
  points: number;
  status: "Pending" | "Submitted" | "Graded" | "Due Soon";
  grade?: string;
  description: string;
}

const ASSIGNMENTS: Assignment[] = [
  {
    id: "asg-1",
    title: "Packet Tracer Network Simulation & Subnetting",
    course: "Computer Networks & Security",
    courseCode: "IT501",
    faculty: "Prof. Anil Verma",
    dueDate: "Tomorrow",
    dueTime: "11:59 PM",
    points: 25,
    status: "Due Soon",
    description:
      "Configure VLSM subnetting across 4 departmental routers using Cisco Packet Tracer. Submit the .pkt file along with PDF report.",
  },
  {
    id: "asg-2",
    title: "AWS Multi-Tier Cloud Architecture Case Study",
    course: "Cloud Computing & Virtualization",
    courseCode: "IT502",
    faculty: "Dr. Rajesh Sharma",
    dueDate: "Sep 10, 2025",
    dueTime: "05:00 PM",
    points: 30,
    status: "Pending",
    description:
      "Design a fault-tolerant multi-AZ architecture on AWS with EC2, Auto-scaling, Application Load Balancer and RDS Aurora.",
  },
  {
    id: "asg-3",
    title: "Relational Normalization & SQL Query Optimization",
    course: "Database Management Systems Lab",
    courseCode: "IT503L",
    faculty: "Prof. Sunita Mehra",
    dueDate: "Sep 14, 2025",
    dueTime: "11:59 PM",
    points: 20,
    status: "Pending",
    description:
      "Normalize given unnormalized hospital records to 3NF and write optimized queries with indexing analysis.",
  },
  {
    id: "asg-4",
    title: "Sprint Planning & Agile User Story Mapping",
    course: "Software Engineering & Agile",
    courseCode: "IT504",
    faculty: "Dr. Priya Nair",
    dueDate: "Aug 29, 2025",
    dueTime: "11:59 PM",
    points: 25,
    status: "Graded",
    grade: "24/25 (A+)",
    description:
      "Construct a Jira-compatible sprint backlog with acceptance criteria and story point estimation using Planning Poker.",
  },
  {
    id: "asg-5",
    title: "DFA & NFA State Minimization Proofs",
    course: "Theory of Computation",
    courseCode: "IT505",
    faculty: "Prof. Vikas Gupta",
    dueDate: "Aug 22, 2025",
    dueTime: "11:59 PM",
    points: 20,
    status: "Graded",
    grade: "19/20 (A)",
    description:
      "Solve Myhill-Nerode theorem reduction problems and demonstrate equivalence between standard DFA and minimal DFA.",
  },
];

export default function AssignmentsPage() {
  const [filter, setFilter] = useState<"All" | "Pending" | "Graded">("All");

  const filtered = ASSIGNMENTS.filter((a) => {
    if (filter === "All") return true;
    if (filter === "Pending") return a.status === "Pending" || a.status === "Due Soon";
    return a.status === filter;
  });

  return (
    <AppShell>
      <div className="px-6 py-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Coursework Assignments
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Track deadlines, upload solutions, and review grades
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            {(["All", "Pending", "Graded"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={cn(
                  "px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer",
                  filter === tab
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {item.courseCode}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {item.course}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">{item.faculty}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2.5 py-0.5 rounded-full border",
                      item.status === "Due Soon"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : item.status === "Pending"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    )}
                  >
                    {item.status === "Due Soon" ? "Due Soon" : item.status}
                  </span>
                  {item.grade && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      {item.grade}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4 text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Due: <strong className="text-slate-700">{item.dueDate}</strong> at {item.dueTime}
                  </span>
                  <span>
                    Points: <strong className="text-slate-700">{item.points} pts</strong>
                  </span>
                </div>

                {item.status !== "Graded" && (
                  <button className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors cursor-pointer self-end sm:self-auto">
                    <Upload className="w-3.5 h-3.5" />
                    Submit Solution
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
