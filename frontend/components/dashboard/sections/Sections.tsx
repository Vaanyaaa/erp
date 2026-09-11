"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Bell,
  ClipboardCheck,
  CreditCard,
  BookOpen,
  Calendar,
  User,
  Construction,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Panel,
  PanelEmpty,
  PanelError,
  PrimaryButton,
  SectionHeading,
  inputBase,
} from "@/components/dashboard/Panel";
import { useAuth, roleLabel, canPost } from "@/lib/auth";
import { PLACEHOLDER_COPY, labelFor } from "@/lib/roles";
import {
  api,
  Notice,
  AttendanceData,
  FeesData,
  CourseItem,
  TimetableSlotItem,
} from "@/lib/api";

/* ── Notices ─────────────────────────────── */

const CATEGORY_BADGE: Record<string, "default" | "info" | "warning" | "success" | "secondary"> = {
  tp_cell: "info",
  exam: "warning",
  fees: "success",
  emergency: "warning",
  general: "secondary",
};

export function NoticesSection() {
  const { user } = useAuth();
  const staff = canPost(user?.role);

  const [notices, setNotices] = useState<Notice[] | null>(null);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("general");
  const [eventDate, setEventDate] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [posting, setPosting] = useState(false);

  const load = useCallback(async () => {
    try {
      const query = filter ? `?category=${filter}` : "";
      const data = await api<{ notices: Notice[] }>(`/notices${query}`);
      setNotices(data.notices);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load notices.");
    }
  }, [filter]);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  const draft = async () => {
    setDrafting(true);
    setError("");
    try {
      const data = await api<{ draft: { title: string; body: string; category: string } }>(
        "/notices/draft",
        { method: "POST", body: { prompt } }
      );
      setTitle(data.draft.title);
      setBody(data.draft.body);
      setCategory(data.draft.category);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not draft the notice.");
    } finally {
      setDrafting(false);
    }
  };

  const publish = async () => {
    setPosting(true);
    setError("");
    try {
      await api("/notices", {
        method: "POST",
        body: { title, body, category, eventDate: eventDate || null },
      });
      setPrompt("");
      setTitle("");
      setBody("");
      setEventDate("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish the notice.");
    } finally {
      setPosting(false);
    }
  };

  const remove = async (id: number) => {
    try {
      await api(`/notices/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove the notice.");
    }
  };

  return (
    <>
      <SectionHeading
        title="Notices"
        description="Everything the institution has published, newest first."
      />

      {staff && (
        <Panel title="Write a notice" icon={Sparkles} iconClass="text-violet-500">
          <div className="p-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Mid-sem results out on Monday, collect marksheets from the department office"
                className={inputBase}
              />
              <PrimaryButton onClick={draft} loading={drafting} disabled={!prompt.trim()}>
                Draft notice
              </PrimaryButton>
            </div>

            {(title || body) && (
              <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={cn(inputBase, "bg-white font-semibold")}
                  placeholder="Notice title"
                />
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={7}
                  className={cn(inputBase, "bg-white resize-y")}
                  placeholder="Notice body"
                />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    <option value="general">General</option>
                    <option value="exam">Examination</option>
                    <option value="fees">Fees</option>
                    {user?.role === "tp_admin" && <option value="tp_cell">TP Cell</option>}
                    <option value="emergency">Emergency</option>
                  </select>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    title="Optional date — puts this notice on the calendar"
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                  </div>
                  <PrimaryButton onClick={publish} loading={posting} disabled={!title || !body}>
                    <Send className="w-4 h-4" />
                    Publish notice
                  </PrimaryButton>
                </div>
              </div>
            )}
          </div>
        </Panel>
      )}

      <Panel
        title="All notices"
        icon={Bell}
        iconClass="text-amber-500"
        action={
          <select
            value={filter}
            onChange={(e) => {
              setNotices(null);
              setFilter(e.target.value);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="">All categories</option>
            <option value="tp_cell">TP Cell</option>
            <option value="exam">Examination</option>
            <option value="fees">Fees</option>
            <option value="general">General</option>
          </select>
        }
      >
        {error && <PanelError message={error} />}
        {!notices ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : notices.length === 0 ? (
          <PanelEmpty icon={Bell} title="No notices in this category" />
        ) : (
          <div className="divide-y divide-slate-100">
            {notices.map((n) => (
              <div key={n.id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={CATEGORY_BADGE[n.category] ?? "secondary"}>
                      {n.category === "tp_cell" ? "TP Cell" : n.category}
                    </Badge>
                    {staff && (
                      <button
                        onClick={() => remove(n.id)}
                        aria-label="Remove notice"
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-1.5 whitespace-pre-line">{n.body}</p>
                <p className="text-[10px] text-slate-400 mt-2">
                  {n.postedBy?.fullName} · {new Date(n.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}

/* ── Attendance ──────────────────────────── */

export function AttendanceSection() {
  const [data, setData] = useState<AttendanceData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<AttendanceData>("/academics/attendance")
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <SectionHeading title="Attendance" description="Course-wise record for the current term." />

      <Panel
        title="Overall"
        icon={ClipboardCheck}
        iconClass="text-emerald-500"
        action={data?.overall !== null && data && <Badge variant="secondary">{data.overall}%</Badge>}
      >
        {error && <PanelError message={error} />}
        {!data ? (
          <div className="p-4">
            <Skeleton className="h-24 w-full" />
          </div>
        ) : data.total === 0 ? (
          <PanelEmpty icon={ClipboardCheck} title="No attendance recorded yet" />
        ) : (
          <div className="p-4 space-y-3">
            {data.byCourse.map((c) => (
              <div key={c.code}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">
                    {c.code} · {c.name}
                  </span>
                  <span className="text-slate-500">
                    {c.present}/{c.total} · {c.percentage}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${c.percentage}%` }}
                    className={cn(
                      "h-full rounded-full",
                      c.percentage >= 80
                        ? "bg-emerald-500"
                        : c.percentage >= 75
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {data && data.records.length > 0 && (
        <Panel title="Recent classes" icon={Calendar} iconClass="text-blue-500">
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {data.records.map((r) => (
              <div key={r.id} className="flex items-center justify-between px-4 py-2 text-xs">
                <span className="text-slate-600">{r.date}</span>
                <span className="text-slate-500 flex-1 px-3 truncate">
                  {r.course?.name ?? "—"}
                </span>
                <Badge variant={r.status === "present" ? "success" : "warning"}>{r.status}</Badge>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </>
  );
}

/* ── Fees ────────────────────────────────── */

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function FeesSection() {
  const [data, setData] = useState<FeesData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<FeesData>("/academics/fees")
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <SectionHeading title="Fees" description="What has been paid and what is still due." />

      {data?.totals && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total billed", value: data.totals.total, color: "text-slate-800", bg: "bg-slate-50", border: "border-slate-200" },
            { label: "Paid", value: data.totals.paid, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
            { label: "Outstanding", value: data.totals.outstanding, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
          ].map((c) => (
            <div key={c.label} className={cn("rounded-xl border bg-white p-4 shadow-sm", c.border)}>
              <div className={cn("inline-flex p-2 rounded-lg mb-3", c.bg)}>
                <CreditCard className={cn("w-5 h-5", c.color)} />
              </div>
              <p className="text-xs text-slate-500 font-medium mb-1">{c.label}</p>
              <p className={cn("text-2xl font-bold leading-tight", c.color)}>{money(c.value)}</p>
            </div>
          ))}
        </div>
      )}

      <Panel title="Fee items" icon={CreditCard} iconClass="text-amber-500">
        {error && <PanelError message={error} />}
        {!data ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : data.fees.length === 0 ? (
          <PanelEmpty icon={CreditCard} title="No fee records" />
        ) : (
          <div className="divide-y divide-slate-100">
            {data.fees.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{f.title}</p>
                  <p className="text-[11px] text-slate-400">
                    Due {f.dueDate ?? "—"}
                    {f.receiptNo ? ` · Receipt ${f.receiptNo}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-slate-800">{money(f.amountDue)}</span>
                  <Badge
                    variant={
                      f.status === "paid" ? "success" : f.status === "overdue" ? "warning" : "secondary"
                    }
                  >
                    {f.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}

/* ── Courses ─────────────────────────────── */

export function CoursesSection() {
  const [courses, setCourses] = useState<CourseItem[] | null>(null);

  useEffect(() => {
    api<{ courses: CourseItem[] }>("/academics/courses")
      .then((d) => setCourses(d.courses))
      .catch(() => setCourses([]));
  }, []);

  return (
    <>
      <SectionHeading title="Courses" description="Subjects registered for this semester." />
      <Panel title="Registered courses" icon={BookOpen} iconClass="text-blue-500">
        {!courses ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <PanelEmpty icon={BookOpen} title="No courses registered" />
        ) : (
          <div className="divide-y divide-slate-100">
            {courses.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{c.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {c.code} · Semester {c.semester}
                  </p>
                </div>
                <Badge variant="secondary">{c.credits} credits</Badge>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}

/* ── Timetable ───────────────────────────── */

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function TimetableSection() {
  const [slots, setSlots] = useState<TimetableSlotItem[] | null>(null);

  useEffect(() => {
    api<{ slots: TimetableSlotItem[] }>("/academics/timetable")
      .then((d) => setSlots(d.slots))
      .catch(() => setSlots([]));
  }, []);

  const today = new Date().getDay();

  return (
    <>
      <SectionHeading title="Timetable" description="Weekly class schedule." />

      {!slots ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : slots.length === 0 ? (
        <Panel title="Weekly schedule" icon={Calendar} iconClass="text-blue-500">
          <PanelEmpty icon={Calendar} title="No timetable published" />
        </Panel>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[1, 2, 3, 4, 5].map((day) => {
            const daySlots = slots.filter((s) => s.dayOfWeek === day);
            if (daySlots.length === 0) return null;
            return (
              <Panel
                key={day}
                title={DAYS[day]}
                icon={Calendar}
                iconClass="text-blue-500"
                action={day === today ? <Badge variant="default">Today</Badge> : undefined}
              >
                <div className="divide-y divide-slate-100">
                  {daySlots.map((s) => (
                    <div key={s.id} className="flex items-center gap-3 px-4 py-2.5 text-xs">
                      <span className="font-semibold text-slate-800 w-24 shrink-0">
                        {s.startTime}
                        {s.endTime ? `–${s.endTime}` : ""}
                      </span>
                      <span className="flex-1 text-slate-600 truncate">{s.subject}</span>
                      <span className="text-slate-400 shrink-0">{s.room}</span>
                    </div>
                  ))}
                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </>
  );
}

/* ── Profile ─────────────────────────────── */

export function ProfileSection() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const rows: [string, string | undefined][] = [
    ["Full name", user.fullName],
    ["Email", user.email],
    ["Mobile", user.mobileNumber],
    ["Role", roleLabel(user.role)],
    ["Enrollment no.", user.enrollmentNo],
    ["Employee ID", user.employeeId],
    ["Department", user.department],
    ["Program", user.program],
    ["Semester", user.semester],
    ["Designation", user.designation],
    ["Ward enrollment no.", user.childEnrollmentNo],
    ["Relationship", user.relationship],
  ];

  return (
    <>
      <SectionHeading title="Profile" description="Details from your institutional account." />

      <Panel
        title="Account details"
        icon={User}
        iconClass="text-blue-500"
        action={
          <button
            onClick={logout}
            className="text-xs font-medium text-rose-600 hover:text-rose-700 transition-colors"
          >
            Sign out
          </button>
        }
      >
        <div className="divide-y divide-slate-100">
          {rows
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <div key={label} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-slate-500">{label}</span>
                <span className="text-sm font-medium text-slate-800">{value}</span>
              </div>
            ))}
        </div>
      </Panel>
    </>
  );
}

/* ── Not-yet-built sections ──────────────── */

export function Placeholder({
  sectionId,
  copyKey,
}: {
  sectionId: string;
  copyKey?: string;
}) {
  const label = labelFor(sectionId);
  const copy =
    PLACEHOLDER_COPY[copyKey ?? sectionId] ?? {
      title: `${label} is not built yet`,
      hint: "This feature is still to be added.",
    };

  return (
    <>
      <SectionHeading title={label} />
      <Panel title={label} icon={Construction} iconClass="text-slate-400">
        <PanelEmpty icon={Construction} title={copy.title} hint={copy.hint} />
      </Panel>
    </>
  );
}
