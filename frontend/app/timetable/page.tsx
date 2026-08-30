"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Download,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useUser,
  StudentHeaderNav,
  StudentProfileBanner,
  StudentFooter,
} from "@/components/dashboard/StudentHeader";

interface TimeTableSlot {
  id: string;
  time: string;
  subject: string;
  code: string;
  faculty: string;
  room: string;
  type: "Lecture" | "Lab" | "Tutorial";
}

interface DaySchedule {
  day: string;
  isToday?: boolean;
  slots: TimeTableSlot[];
}

const WEEKLY_TIMETABLE: DaySchedule[] = [
  {
    day: "Monday",
    slots: [
      {
        id: "mon-1",
        time: "09:00 AM – 10:30 AM",
        subject: "Computer Networks & Security",
        code: "IT501",
        faculty: "Prof. Anil Verma",
        room: "Room 402, Block B",
        type: "Lecture",
      },
      {
        id: "mon-2",
        time: "10:45 AM – 12:15 PM",
        subject: "Software Engineering & Agile",
        code: "IT504",
        faculty: "Dr. Priya Nair",
        room: "Room 405, Block B",
        type: "Lecture",
      },
      {
        id: "mon-3",
        time: "01:15 PM – 02:45 PM",
        subject: "Theory of Computation & Automata",
        code: "IT505",
        faculty: "Prof. Vikas Gupta",
        room: "Room 302, Block A",
        type: "Lecture",
      },
      {
        id: "mon-4",
        time: "03:00 PM – 04:30 PM",
        subject: "Web Development Lab",
        code: "IT506L",
        faculty: "Prof. Sunita Mehra",
        room: "Software Lab 2",
        type: "Lab",
      },
    ],
  },
  {
    day: "Tuesday",
    slots: [
      {
        id: "tue-1",
        time: "09:00 AM – 10:30 AM",
        subject: "Cloud Computing & Virtualization",
        code: "IT502",
        faculty: "Dr. Rajesh Sharma",
        room: "Room 402, Block B",
        type: "Lecture",
      },
      {
        id: "tue-2",
        time: "10:45 AM – 12:15 PM",
        subject: "Computer Networks & Security",
        code: "IT501",
        faculty: "Prof. Anil Verma",
        room: "Room 402, Block B",
        type: "Lecture",
      },
      {
        id: "tue-3",
        time: "01:15 PM – 03:15 PM",
        subject: "Database Management Systems Lab",
        code: "IT503L",
        faculty: "Prof. Sunita Mehra",
        room: "Software Lab 3",
        type: "Lab",
      },
      {
        id: "tue-4",
        time: "03:30 PM – 04:30 PM",
        subject: "TPO Aptitude & Technical Training",
        code: "TPO501",
        faculty: "TPO Training Cell",
        room: "Auditorium Hall",
        type: "Tutorial",
      },
    ],
  },
  {
    day: "Wednesday",
    isToday: true,
    slots: [
      {
        id: "wed-1",
        time: "09:00 AM – 10:30 AM",
        subject: "Computer Networks & Security",
        code: "IT501",
        faculty: "Prof. Anil Verma",
        room: "Room 402, Block B",
        type: "Lecture",
      },
      {
        id: "wed-2",
        time: "10:45 AM – 12:15 PM",
        subject: "Cloud Computing & Virtualization",
        code: "IT502",
        faculty: "Dr. Rajesh Sharma",
        room: "Room 405, Block B",
        type: "Lecture",
      },
      {
        id: "wed-3",
        time: "01:15 PM – 02:45 PM",
        subject: "Database Management Systems Lab",
        code: "IT503L",
        faculty: "Prof. Sunita Mehra",
        room: "Software Lab 3, 2nd Floor",
        type: "Lab",
      },
      {
        id: "wed-4",
        time: "03:00 PM – 04:30 PM",
        subject: "Software Engineering & Agile Methodologies",
        code: "IT504",
        faculty: "Dr. Priya Nair",
        room: "Room 302, Block A",
        type: "Lecture",
      },
    ],
  },
  {
    day: "Thursday",
    slots: [
      {
        id: "thu-1",
        time: "09:00 AM – 10:30 AM",
        subject: "Theory of Computation & Automata",
        code: "IT505",
        faculty: "Prof. Vikas Gupta",
        room: "Room 302, Block A",
        type: "Lecture",
      },
      {
        id: "thu-2",
        time: "10:45 AM – 12:15 PM",
        subject: "Software Engineering & Agile",
        code: "IT504",
        faculty: "Dr. Priya Nair",
        room: "Room 405, Block B",
        type: "Lecture",
      },
      {
        id: "thu-3",
        time: "01:15 PM – 03:15 PM",
        subject: "Cloud Computing Hands-on Lab",
        code: "IT502L",
        faculty: "Dr. Rajesh Sharma",
        room: "Cloud & AI Computing Lab",
        type: "Lab",
      },
      {
        id: "thu-4",
        time: "03:30 PM – 04:30 PM",
        subject: "Library & Research Mentorship",
        code: "IT507",
        faculty: "Department Faculty",
        room: "Central Library",
        type: "Tutorial",
      },
    ],
  },
  {
    day: "Friday",
    slots: [
      {
        id: "fri-1",
        time: "09:00 AM – 10:30 AM",
        subject: "Cloud Computing & Virtualization",
        code: "IT502",
        faculty: "Dr. Rajesh Sharma",
        room: "Room 402, Block B",
        type: "Lecture",
      },
      {
        id: "fri-2",
        time: "10:45 AM – 12:15 PM",
        subject: "Theory of Computation & Automata",
        code: "IT505",
        faculty: "Prof. Vikas Gupta",
        room: "Room 302, Block A",
        type: "Lecture",
      },
      {
        id: "fri-3",
        time: "01:15 PM – 02:45 PM",
        subject: "Project & Seminar Review",
        code: "IT508P",
        faculty: "Review Panel Committee",
        room: "Seminar Hall 1",
        type: "Lab",
      },
      {
        id: "fri-4",
        time: "03:00 PM – 04:30 PM",
        subject: "Open Elective / Industry Talk",
        code: "OE501",
        faculty: "Guest Speaker Series",
        room: "Main Auditorium",
        type: "Lecture",
      },
    ],
  },
];

export default function TimeTablePage() {
  const { user, logout } = useUser();
  const [selectedDay, setSelectedDay] = useState<string>("All");

  const displayedDays =
    selectedDay === "All"
      ? WEEKLY_TIMETABLE
      : WEEKLY_TIMETABLE.filter((d) => d.day === selectedDay);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col">
      <StudentHeaderNav user={user} onLogout={logout} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <StudentProfileBanner user={user} />

        {/* Timetable Header & Day Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-700" />
                </div>
                <h1 className="text-base font-bold text-slate-900">
                  Student Weekly Time Table
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                B.Tech Information Technology • 3rd Year • Semester 5 • Session 2025–26
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>
          </div>

          {/* Day Tabs */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedDay("All")}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer",
                selectedDay === "All"
                  ? "bg-slate-800 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              Full Week
            </button>
            {WEEKLY_TIMETABLE.map((d) => (
              <button
                key={d.day}
                onClick={() => setSelectedDay(d.day)}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5",
                  selectedDay === d.day
                    ? "bg-blue-700 text-white shadow-2xs font-bold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                  d.isToday && selectedDay !== d.day && "ring-1 ring-blue-500/30 text-blue-700 font-bold"
                )}
              >
                <span>{d.day}</span>
                {d.isToday && (
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      selectedDay === d.day ? "bg-white" : "bg-blue-600"
                    )}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Timetable Schedules List */}
        <div className="space-y-5">
          {displayedDays.map((daySchedule) => (
            <div
              key={daySchedule.day}
              className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden"
            >
              {/* Day Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{daySchedule.day}</span>
                  {daySchedule.isToday && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                      Today
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {daySchedule.slots.length} Classes
                </span>
              </div>

              {/* Slot Cards Grid */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
                {daySchedule.slots.map((slot) => {
                  const isLab = slot.type === "Lab";
                  const isTutorial = slot.type === "Tutorial";
                  return (
                    <div
                      key={slot.id}
                      className={cn(
                        "rounded-lg border p-4 transition-all flex flex-col justify-between space-y-3",
                        isLab
                          ? "border-emerald-200 bg-emerald-50/20"
                          : isTutorial
                          ? "border-amber-200 bg-amber-50/20"
                          : "border-slate-200 bg-white"
                      )}
                    >
                      <div>
                        {/* Time & Type Tag */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1 font-mono">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {slot.time}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded border",
                              isLab
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : isTutorial
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            )}
                          >
                            {slot.type}
                          </span>
                        </div>

                        {/* Subject Title & Code */}
                        <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {slot.subject}
                        </h2>
                        <span className="inline-block mt-1 font-mono text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                          {slot.code}
                        </span>
                      </div>

                      {/* Faculty & Room Footer */}
                      <div className="pt-3 border-t border-slate-100 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{slot.faculty}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{slot.room}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      <StudentFooter user={user} />
    </div>
  );
}
