"use client";

import React from "react";
import { BookOpen, User, Clock, FileText, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

const COURSES = [
  {
    code: "IT501",
    name: "Computer Networks & Security",
    faculty: "Prof. Anil Verma",
    credits: 4,
    type: "Core Theory",
    attendance: "93.3%",
    room: "Lab 3",
    description: "OSI & TCP/IP models, routing algorithms, socket programming, cryptography, and network defense.",
  },
  {
    code: "IT502",
    name: "Cloud Computing & Virtualization",
    faculty: "Dr. Rajesh Sharma",
    credits: 4,
    type: "Core Theory",
    attendance: "86.6%",
    room: "LH 402",
    description: "Virtualization hypervisors, AWS/GCP cloud services, serverless computing, and distributed architectures.",
  },
  {
    code: "IT503L",
    name: "Database Management Systems Lab",
    faculty: "Prof. Sunita Mehra",
    credits: 2,
    type: "Practical Lab",
    attendance: "87.5%",
    room: "CC Lab 1",
    description: "PostgreSQL & Oracle schema design, advanced SQL joins, indexing, and transactional ACID properties.",
  },
  {
    code: "IT504",
    name: "Software Engineering & Agile Methodologies",
    faculty: "Dr. Priya Nair",
    credits: 3,
    type: "Core Theory",
    attendance: "84.3%",
    room: "Room 305",
    description: "Agile Scrum, UML architecture modeling, CI/CD pipeline automation, and automated test-driven development.",
  },
  {
    code: "IT505",
    name: "Theory of Computation & Automata",
    faculty: "Prof. Vikas Gupta",
    credits: 4,
    type: "Core Theory",
    attendance: "90.6%",
    room: "Room 301",
    description: "Finite state automata, pushdown automata, context-free grammars, Turing machines, and NP-completeness.",
  },
];

export default function CoursesPage() {
  return (
    <AppShell>
      <div className="px-6 py-6 max-w-6xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Enrolled Courses
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Autumn Semester 2025 • 5 Registered Subjects • 17 Total Credits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COURSES.map((course) => (
            <div
              key={course.code}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {course.code}
                </span>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {course.credits} Credits • {course.type}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {course.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {course.faculty}
                </span>
                <span className="font-semibold text-emerald-700">
                  {course.attendance} Attendance
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
