"use client";

import React, { useEffect, useState } from "react";
import {
  BookCopy,
  ClipboardCheck,
  FileText,
  Award,
  ChevronRight,
  Clock,
  Calendar,
  BarChart2,
  Bell,
  Activity,
  BookMarked,
  Library,
  Wallet,
  HeadphonesIcon,
  CalendarRange,
  Briefcase,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Panel, PanelEmpty, PanelError } from "@/components/dashboard/Panel";
import { CalendarWeekStrip } from "@/components/dashboard/sections/CalendarSection";
import { canAccess, Role, TP_ADMIN_TEACHES } from "@/lib/roles";
import {
  api,
  Summary,
  AttendanceData,
  Notice,
  ActivityItem,
  TimetableSlotItem,
} from "@/lib/api";

const overviewCards = [
  { id: "courses", icon: BookCopy, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", title: "Enrolled Courses" },
  { id: "attendance", icon: ClipboardCheck, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", title: "Attendance Rate" },
  { id: "assignments", icon: FileText, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", title: "Pending Items" },
  { id: "results", icon: Award, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100", title: "Latest Result" },
] as const;

const quickAccessItems = [
  { id: "timetable", label: "Timetable", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
  { id: "tpcell", label: "TP Cell", icon: Briefcase, color: "text-violet-600", bg: "bg-violet-50" },
  { id: "calendar", label: "Calendar", icon: CalendarRange, color: "text-sky-600", bg: "bg-sky-50" },
  { id: "assignments", label: "Assignments", icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
  { id: "results", label: "Results", icon: BarChart2, color: "text-emerald-600", bg: "bg-emerald-50" },
  { id: "fees", label: "Fees", icon: Wallet, color: "text-amber-600", bg: "bg-amber-50" },
  { id: "library", label: "Library", icon: Library, color: "text-sky-600", bg: "bg-sky-50" },
  { id: "support", label: "Support", icon: HeadphonesIcon, color: "text-rose-600", bg: "bg-rose-50" },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.round(hrs / 24)}d`;
}

export function OverviewSection({
  role,
  onNavigate,
}: {
  role: Role;
  onNavigate: (id: string) => void;
}) {
  const isStaff = role === "professor" || role === "tp_admin";
  const showSchedule = canAccess(role, "timetable") && (role !== "tp_admin" || TP_ADMIN_TEACHES);
  const showAcademicCards = !isStaff;
  const showAttendance = canAccess(role, "attendance") && !isStaff;

  const [summary, setSummary] = useState<Summary | null>(null);
  const [attendance, setAttendance] = useState<AttendanceData | null>(null);
  const [notices, setNotices] = useState<Notice[] | null>(null);
  const [activity, setActivity] = useState<ActivityItem[] | null>(null);
  const [slots, setSlots] = useState<TimetableSlotItem[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Only ask for what this role actually shows.
        const [n, act] = await Promise.all([
          api<{ notices: Notice[] }>("/notices?limit=5"),
          api<{ activity: ActivityItem[] }>("/academics/activity"),
        ]);
        if (cancelled) return;
        setNotices(n.notices);
        setActivity(act.activity);

        if (showAcademicCards) {
          const s = await api<Summary>("/academics/summary");
          if (!cancelled) setSummary(s);
        }
        if (showAttendance) {
          const a = await api<AttendanceData>("/academics/attendance");
          if (!cancelled) setAttendance(a);
        }
        if (showSchedule) {
          const tt = await api<{ slots: TimetableSlotItem[] }>("/academics/timetable/today");
          if (!cancelled) setSlots(tt.slots);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load the dashboard.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [showAcademicCards, showAttendance, showSchedule]);

  if (error) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <PanelError message={error} />
      </div>
    );
  }

  const noticesPanel = (
    <Panel
      title="Latest Notices"
      icon={Bell}
      iconClass="text-amber-500"
      action={
        <button
          onClick={() => onNavigate("notices")}
          className="text-xs text-blue-500 font-medium hover:text-blue-700 transition-colors"
        >
          View All
        </button>
      }
    >
      {!notices ? (
        <div className="p-4 space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : notices.length === 0 ? (
        <PanelEmpty
          icon={Bell}
          title="No notices to display"
          hint="Official notices and announcements from your institution will appear here."
        />
      ) : (
        <div className="divide-y divide-slate-100">
          {notices.map((notice) => (
            <button
              key={notice.id}
              onClick={() => onNavigate("notices")}
              className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-slate-800 truncate">{notice.title}</p>
                {notice.category === "tp_cell" && <Badge variant="info">TP Cell</Badge>}
                {notice.priority === "high" && notice.category !== "tp_cell" && (
                  <Badge variant="warning">Urgent</Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notice.body}</p>
              <p className="text-[10px] text-slate-400 mt-1">
                {notice.postedBy?.fullName} · {timeAgo(notice.createdAt)} ago
              </p>
            </button>
          ))}
        </div>
      )}
    </Panel>
  );

  const activityPanel = (
    <Panel
      title="Recent Activity"
      icon={Activity}
      iconClass="text-violet-500"
      action={<Badge variant="secondary">Recent</Badge>}
    >
      <div className="p-4">
        {!activity ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-11 w-full" />
            ))}
          </div>
        ) : activity.length === 0 ? (
          <PanelEmpty icon={Activity} title="No recent activity" />
        ) : (
          <div className="space-y-2.5">
            {activity.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100"
              >
                <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                  <Activity className="w-3.5 h-3.5 text-violet-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate">{item.action}</p>
                  {item.detail && (
                    <p className="text-[10px] text-slate-400 truncate">{item.detail}</p>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {timeAgo(item.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );

  const schedulePanel = (
    <Panel
      title={role === "professor" ? "Today's Classes" : "Today's Schedule"}
      icon={Clock}
      action={
        <button
          onClick={() => onNavigate("timetable")}
          className="text-xs text-blue-500 font-medium hover:text-blue-700 transition-colors"
        >
          View All
        </button>
      }
    >
      <div className="grid grid-cols-3 gap-2 px-4 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
        <span>Time</span>
        <span>Subject</span>
        <span>Room</span>
      </div>

      {!slots ? (
        <div className="p-4 space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : slots.length === 0 ? (
        <PanelEmpty
          icon={Calendar}
          title={role === "professor" ? "No classes today" : "No classes scheduled"}
          hint="Nothing on the timetable for today."
        />
      ) : (
        <div className="divide-y divide-slate-100">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="grid grid-cols-3 gap-2 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-slate-800">{slot.startTime}</span>
              <span className="truncate">{slot.subject}</span>
              <span className="text-slate-500">{slot.room ?? "—"}</span>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );

  const attendancePanel = (
    <Panel
      title="Attendance Overview"
      icon={ClipboardCheck}
      iconClass="text-emerald-500"
      action={<Badge variant="secondary">This Term</Badge>}
    >
      <div className="p-4 space-y-3">
        {!attendance ? (
          <Skeleton className="h-32 w-full" />
        ) : attendance.total === 0 ? (
          <PanelEmpty icon={BarChart2} title="No attendance recorded yet" />
        ) : (
          <>
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-4">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-3xl font-bold text-slate-800 leading-none">
                    {attendance.overall}%
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {attendance.present} of {attendance.total} classes
                  </p>
                </div>
                <div className="flex items-end gap-1.5 h-12">
                  {attendance.byCourse.map((c) => (
                    <div
                      key={c.code}
                      title={`${c.code} — ${c.percentage}%`}
                      style={{ height: `${c.percentage}%` }}
                      className="w-5 rounded-sm bg-emerald-400"
                    />
                  ))}
                </div>
              </div>

              {attendance.overall !== null && attendance.overall < 80 && (
                <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1.5">
                  Below 80% — heading toward the 75% exam cutoff.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <div>
                  <p className="text-[10px] text-slate-500">Present</p>
                  <p className="text-sm font-semibold text-slate-800">{attendance.present}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div>
                  <p className="text-[10px] text-slate-500">Absent</p>
                  <p className="text-sm font-semibold text-slate-800">{attendance.absent}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Panel>
  );

  const shortcuts = quickAccessItems.filter((item) => canAccess(role, item.id));

  return (
    <>
      {showAcademicCards && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {overviewCards
            .filter((card) => canAccess(role, card.id))
            .map((card) => {
              const Icon = card.icon;
              const data = summary?.cards[card.id];
              return (
                <div
                  key={card.id}
                  className={cn(
                    "rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow",
                    card.border
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn("p-2 rounded-lg", card.bg)}>
                      <Icon className={cn("w-5 h-5", card.color)} />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium mb-1">{card.title}</p>
                  {summary ? (
                    <p className="text-2xl font-bold text-slate-800 mb-1 leading-tight">
                      {data?.value ?? "—"}
                    </p>
                  ) : (
                    <Skeleton className="h-7 w-20 mb-2" />
                  )}
                  <p className="text-[10px] text-slate-400">
                    {summary ? data?.label : "Data will appear here"}
                  </p>
                </div>
              );
            })}
        </div>
      )}

      {/* The week strip is the anchor for staff, who have no academic cards. */}
      <CalendarWeekStrip onOpen={() => onNavigate("calendar")} />

      {/* Whichever panels this role actually has, laid out two per row. */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {[
          showSchedule ? schedulePanel : null,
          showAttendance ? attendancePanel : null,
          noticesPanel,
          activityPanel,
        ]
          .filter(Boolean)
          .map((panel, i) => (
            <React.Fragment key={i}>{panel}</React.Fragment>
          ))}
      </div>

      {shortcuts.length > 0 && (
        <Panel title="Quick Access" icon={BookMarked}>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {shortcuts.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`quick-access-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  aria-label={`Go to ${item.label}`}
                  className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all duration-150 cursor-pointer"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
                      item.bg
                    )}
                  >
                    <Icon className={cn("w-5 h-5", item.color)} />
                  </div>
                  <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </Panel>
      )}
    </>
  );
}
