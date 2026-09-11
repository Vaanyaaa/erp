"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
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
import { useAuth } from "@/lib/auth";
import { canPublish, Role } from "@/lib/roles";
import { api, MonthCalendar, CalendarItem } from "@/lib/api";

/** Every category that can land on the calendar, with its colour. */
const CATEGORY_META: Record<string, { label: string; chip: string; dot: string }> = {
  tp_cell: {
    label: "TP Cell",
    chip: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  exam: {
    label: "Examination",
    chip: "bg-violet-50 text-violet-700 border-violet-200",
    dot: "bg-violet-500",
  },
  assignment: {
    label: "Assignments",
    chip: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  fees: {
    label: "Fees",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  general: {
    label: "General",
    chip: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
  emergency: {
    label: "Urgent",
    chip: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function meta(category: string) {
  return CATEGORY_META[category] ?? CATEGORY_META.general;
}

export function CalendarSection() {
  const { user } = useAuth();
  const editable = canPublish(user?.role as Role);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-based
  const [data, setData] = useState<MonthCalendar | null>(null);
  const [active, setActive] = useState<string[]>([]); // empty = show everything
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    eventDate: "",
    startTime: "",
    venue: "",
    type: "company_visit",
  });

  const load = useCallback(async () => {
    try {
      const result = await api<MonthCalendar>(`/calendar/month?year=${year}&month=${month}`);
      setData(result);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the calendar.");
    }
  }, [year, month]);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  const step = (delta: number) => {
    setData(null);
    setSelected(null);
    const next = month + delta;
    if (next < 1) {
      setMonth(12);
      setYear(year - 1);
    } else if (next > 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(next);
    }
  };

  const toggle = (category: string) =>
    setActive((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );

  const visible = (items: CalendarItem[]) =>
    active.length === 0 ? items : items.filter((i) => active.includes(i.category));

  const addEvent = async () => {
    if (!form.title || !form.eventDate) return;
    setSaving(true);
    try {
      await api("/calendar", { method: "POST", body: form });
      setForm({ title: "", eventDate: "", startTime: "", venue: "", type: "company_visit" });
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add the event.");
    } finally {
      setSaving(false);
    }
  };

  const removeEvent = async (item: CalendarItem) => {
    try {
      await api(`/calendar/${item.refId}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove the event.");
    }
  };

  // Categories actually present this month, so the filter never offers a
  // chip that would empty the grid.
  const present = new Set<string>();
  data?.weeks.forEach((w) => w.forEach((d) => d.items.forEach((i) => present.add(i.category))));

  const selectedDay = data?.weeks.flat().find((d) => d.date === selected);

  return (
    <>
      <SectionHeading
        title="Calendar"
        description="Placement drives, exam dates, fee deadlines and assignment due dates on one grid."
      />

      {editable && (
        <Panel
          title="Add an event"
          icon={Plus}
          iconClass="text-blue-500"
          action={
            <button
              onClick={() => setShowForm((v) => !v)}
              className="text-xs text-blue-500 font-medium hover:text-blue-700 transition-colors"
            >
              {showForm ? "Cancel" : "New event"}
            </button>
          }
        >
          {showForm && (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-5 gap-3">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Event title"
                className={cn(inputBase, "sm:col-span-2")}
              />
              <input
                type="date"
                value={form.eventDate}
                onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                className={inputBase}
              />
              <input
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                placeholder="Venue"
                className={inputBase}
              />
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className={inputBase}
              >
                <option value="company_visit">Company visit</option>
                <option value="seminar">Seminar</option>
                <option value="deadline">Deadline</option>
                <option value="exam">Exam</option>
              </select>
              <div className="sm:col-span-5 flex justify-end">
                <PrimaryButton
                  onClick={addEvent}
                  loading={saving}
                  disabled={!form.title || !form.eventDate}
                >
                  Add to calendar
                </PrimaryButton>
              </div>
            </div>
          )}
        </Panel>
      )}

      <Panel
        title={data?.monthLabel ?? "Loading"}
        icon={CalendarRange}
        iconClass="text-blue-500"
        action={
          <div className="flex items-center gap-1">
            <button
              onClick={() => step(-1)}
              aria-label="Previous month"
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setData(null);
                setYear(now.getFullYear());
                setMonth(now.getMonth() + 1);
              }}
              className="px-2 py-1 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => step(1)}
              aria-label="Next month"
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        }
      >
        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
          <button
            onClick={() => setActive([])}
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
              active.length === 0
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            )}
          >
            Everything
          </button>

          {Object.keys(CATEGORY_META)
            .filter((c) => present.has(c))
            .map((category) => {
              const m = meta(category);
              const on = active.includes(category);
              return (
                <button
                  key={category}
                  onClick={() => toggle(category)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
                    on ? m.chip : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  )}
                >
                  <span className={cn("w-2 h-2 rounded-full", m.dot)} />
                  {m.label}
                </button>
              );
            })}
        </div>

        {error && <PanelError message={error} />}

        {!data ? (
          <div className="p-4 grid grid-cols-7 gap-1.5">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1.5 mb-1.5">
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center py-1"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {data.weeks.flat().map((day) => {
                const items = visible(day.items);
                return (
                  <button
                    key={day.date}
                    onClick={() => setSelected(day.date === selected ? null : day.date)}
                    className={cn(
                      "text-left rounded-lg border p-1.5 min-h-20 align-top transition-colors",
                      !day.inMonth && "opacity-40",
                      day.isToday
                        ? "border-blue-300 bg-blue-50"
                        : selected === day.date
                        ? "border-slate-400 bg-white"
                        : "border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200"
                    )}
                  >
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        day.isToday ? "text-blue-700" : "text-slate-700"
                      )}
                    >
                      {day.dayOfMonth}
                    </span>

                    <div className="mt-1 space-y-1">
                      {items.slice(0, 2).map((item) => (
                        <div
                          key={item.id}
                          className={cn(
                            "rounded px-1 py-0.5 border text-[10px] font-medium leading-tight truncate",
                            meta(item.category).chip
                          )}
                          title={item.title}
                        >
                          {item.title}
                        </div>
                      ))}
                      {items.length > 2 && (
                        <p className="text-[10px] text-slate-400 pl-1">
                          +{items.length - 2} more
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Panel>

      {/* Day detail */}
      {selectedDay && (
        <Panel
          title={new Date(`${selectedDay.date}T00:00:00`).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          icon={CalendarRange}
          iconClass="text-blue-500"
          action={
            <button
              onClick={() => setSelected(null)}
              className="text-xs text-slate-500 font-medium hover:text-slate-700 transition-colors"
            >
              Close
            </button>
          }
        >
          {visible(selectedDay.items).length === 0 ? (
            <PanelEmpty icon={CalendarRange} title="Nothing scheduled on this day" />
          ) : (
            <div className="divide-y divide-slate-100">
              {visible(selectedDay.items).map((item) => (
                <div key={item.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500">
                        {item.time && <span>{item.time}</span>}
                        {item.venue && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.venue}
                          </span>
                        )}
                        {item.postedBy && <span>{item.postedBy}</span>}
                      </div>
                      {item.detail && (
                        <p className="text-xs text-slate-600 mt-1.5 whitespace-pre-line line-clamp-3">
                          {item.detail}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                          meta(item.category).chip
                        )}
                      >
                        {meta(item.category).label}
                      </span>
                      {editable && item.canDelete && (
                        <button
                          onClick={() => removeEvent(item)}
                          aria-label="Remove event"
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      )}

      {data && data.totalItems === 0 && (
        <Panel title="Nothing this month" icon={CalendarRange} iconClass="text-slate-400">
          <PanelEmpty
            icon={CalendarRange}
            title="No dated items this month"
            hint={
              editable
                ? "Add an event above, or give a notice a date when you post it — dated notices show up here automatically."
                : "Placement drives, exam dates and assignment deadlines will appear here as staff add them."
            }
          />
        </Panel>
      )}

      {!editable && (
        <p className="text-[11px] text-slate-400 px-1">
          View only — events are added by faculty and the TP Cell.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 px-1">
        {Object.entries(CATEGORY_META)
          .filter(([c]) => present.has(c))
          .map(([category, m]) => (
            <span key={category} className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className={cn("w-2 h-2 rounded-full", m.dot)} />
              {m.label}
            </span>
          ))}
      </div>
    </>
  );
}

/** Compact week strip used on the dashboard. */
export function CalendarWeekStrip({ onOpen }: { onOpen: () => void }) {
  const [days, setDays] = useState<
    { date: string; label: string; dayOfMonth: number; isToday: boolean; items: CalendarItem[] }[]
  | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api<{ days: typeof days }>("/calendar/week");
        setDays(data.days);
      } catch {
        setDays([]);
      }
    })();
  }, []);

  return (
    <Panel
      title="This week"
      icon={CalendarRange}
      iconClass="text-blue-500"
      action={
        <button
          onClick={onOpen}
          className="text-xs text-blue-500 font-medium hover:text-blue-700 transition-colors"
        >
          Full calendar
        </button>
      }
    >
      {!days ? (
        <div className="p-4 grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {days.map((day) => (
            <div
              key={day.date}
              className={cn(
                "rounded-xl border p-2.5 min-h-24",
                day.isToday ? "border-blue-200 bg-blue-50" : "border-slate-100 bg-slate-50"
              )}
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500">{day.label}</span>
                <span
                  className={cn(
                    "text-sm font-bold",
                    day.isToday ? "text-blue-700" : "text-slate-700"
                  )}
                >
                  {day.dayOfMonth}
                </span>
              </div>

              <div className="space-y-1">
                {day.items.length === 0 ? (
                  <p className="text-[10px] text-slate-400">—</p>
                ) : (
                  day.items.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "rounded-lg border px-2 py-1",
                        meta(item.category).chip
                      )}
                    >
                      <p className="text-[11px] font-semibold leading-tight line-clamp-2">
                        {item.title}
                      </p>
                      {item.time && <p className="text-[10px] opacity-80 mt-0.5">{item.time}</p>}
                    </div>
                  ))
                )}
                {day.items.length > 2 && (
                  <p className="text-[10px] text-slate-400">+{day.items.length - 2} more</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
