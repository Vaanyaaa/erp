"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Briefcase,
  Building2,
  Bell,
  CalendarDays,
  Sparkles,
  Send,
  Trash2,
  FileQuestion,
  MapPin,
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
import { useAuth } from "@/lib/auth";
import { tpCellTabsFor, Role } from "@/lib/roles";
import {
  api,
  Company,
  Question,
  Notice,
  CalendarWeek,
  GeneratedTest,
} from "@/lib/api";

type Tab = "notices" | "bank" | "test" | "calendar";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "notices", label: "Notices", icon: Bell },
  { id: "bank", label: "Question Bank", icon: FileQuestion },
  { id: "test", label: "Practice Test", icon: Sparkles },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
];

const DIFFICULTY_STYLE: Record<string, string> = {
  easy: "bg-emerald-100 text-emerald-700 border-emerald-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  hard: "bg-rose-100 text-rose-700 border-rose-200",
};

export function TPCellSection() {
  const { user } = useAuth();
  const isTpAdmin = user?.role === "tp_admin";

  // Parents see placement news and the calendar, but not the practice tooling.
  const allowed = tpCellTabsFor(user?.role as Role);
  const tabs = TABS.filter((t) => allowed.includes(t.id));
  const [tab, setTab] = useState<Tab>(tabs[0]?.id ?? "notices");

  return (
    <>
      <SectionHeading
        title="Training & Placement Cell"
        description="Placement notices, past company questions and the week ahead — all in one place instead of scattered across Telegram."
      />

      {/* Tab strip */}
      <div className="flex items-center gap-1 p-1 rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap",
              tab === id
                ? "bg-blue-50 text-blue-700 shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <Icon className={cn("w-4 h-4", tab === id ? "text-blue-600" : "text-slate-400")} />
            {label}
          </button>
        ))}
      </div>

      {tab === "notices" && <TpNotices isTpAdmin={isTpAdmin} />}
      {tab === "bank" && allowed.includes("bank") && <QuestionBank isTpAdmin={isTpAdmin} />}
      {tab === "test" && allowed.includes("test") && <TestBuilder />}
      {tab === "calendar" && <PlacementCalendar canPost={isTpAdmin} />}
    </>
  );
}

/* ── Notices ─────────────────────────────── */

function TpNotices({ isTpAdmin }: { isTpAdmin: boolean }) {
  const [notices, setNotices] = useState<Notice[] | null>(null);
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [posting, setPosting] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api<{ notices: Notice[] }>("/notices?category=tp_cell");
      setNotices(data.notices);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load notices.");
    }
  }, []);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  const draft = async () => {
    if (!prompt.trim()) return;
    setDrafting(true);
    setError("");
    try {
      const data = await api<{ draft: { title: string; body: string } }>("/notices/draft", {
        method: "POST",
        body: { prompt, category: "tp_cell" },
      });
      setTitle(data.draft.title);
      setBody(data.draft.body);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not draft the notice.");
    } finally {
      setDrafting(false);
    }
  };

  const publish = async () => {
    if (!title.trim() || !body.trim()) return;
    setPosting(true);
    setError("");
    try {
      await api("/notices", {
        method: "POST",
        body: { title, body, category: "tp_cell", priority: "high" },
      });
      setPrompt("");
      setTitle("");
      setBody("");
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
    <div className="space-y-5">
      {isTpAdmin && (
        <Panel title="Post a placement notice" icon={Sparkles} iconClass="text-violet-500">
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Describe it in one line
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Wipro drive on 20 March, registration closes Friday"
                  className={inputBase}
                />
                <PrimaryButton onClick={draft} loading={drafting} disabled={!prompt.trim()}>
                  Draft notice
                </PrimaryButton>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                The draft is editable — nothing is published until you send it.
              </p>
            </div>

            {(title || body) && (
              <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Notice title"
                  className={cn(inputBase, "bg-white font-semibold")}
                />
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={7}
                  placeholder="Notice body"
                  className={cn(inputBase, "bg-white resize-y")}
                />
                <div className="flex justify-end">
                  <PrimaryButton onClick={publish} loading={posting}>
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
        title="Placement notices"
        icon={Bell}
        iconClass="text-amber-500"
        action={notices && <Badge variant="secondary">{notices.length}</Badge>}
      >
        {error && <PanelError message={error} />}
        {!notices ? (
          <div className="p-4 space-y-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : notices.length === 0 ? (
          <PanelEmpty
            icon={Bell}
            title="No placement notices yet"
            hint="Notices posted by the TP Cell will land here, and every student sees the same list."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {notices.map((n) => (
              <div key={n.id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    {n.priority === "high" && <Badge variant="warning">Priority</Badge>}
                    {isTpAdmin && (
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
    </div>
  );
}

/* ── Question bank ───────────────────────── */

function QuestionBank({ isTpAdmin }: { isTpAdmin: boolean }) {
  const [companies, setCompanies] = useState<Company[] | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [selected, setSelected] = useState<number | "all">("all");
  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ companies: Company[] }>("/tpcell/companies")
      .then((d) => setCompanies(d.companies))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selected !== "all") params.set("companyId", String(selected));
    if (difficulty) params.set("difficulty", difficulty);
    if (type) params.set("type", type);
    if (year) params.set("year", year);

    api<{ questions: Question[] }>(`/tpcell/questions?${params}`)
      .then((d) => setQuestions(d.questions))
      .catch((err) => setError(err.message));
  }, [selected, difficulty, type, year]);

  return (
    <div className="space-y-5">
      <Panel
        title="Companies"
        icon={Building2}
        iconClass="text-blue-500"
        action={isTpAdmin ? <Badge variant="info">You can add questions</Badge> : undefined}
      >
        {!companies ? (
          <div className="p-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : (
          <div className="p-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => {
                setQuestions(null);
                setSelected("all");
              }}
              className={cn(
                "text-left p-3 rounded-xl border transition-all duration-150",
                selected === "all"
                  ? "border-blue-200 bg-blue-50 shadow-sm"
                  : "border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200"
              )}
            >
              <p className="text-sm font-semibold text-slate-800">All companies</p>
              <p className="text-[11px] text-slate-500 mt-1">
                {companies.reduce((n, c) => n + c.questionCount, 0)} questions
              </p>
            </button>

            {companies.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setQuestions(null);
                  setSelected(c.id);
                }}
                className={cn(
                  "text-left p-3 rounded-xl border transition-all duration-150",
                  selected === c.id
                    ? "border-blue-200 bg-blue-50 shadow-sm"
                    : "border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200"
                )}
              >
                <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {c.questionCount} questions · {c.sector}
                </p>
                {c.ctcRange && (
                  <p className="text-[11px] text-emerald-600 font-medium mt-0.5">{c.ctcRange}</p>
                )}
              </button>
            ))}
          </div>
        )}
      </Panel>

      <Panel
        title="Questions"
        icon={FileQuestion}
        iconClass="text-violet-500"
        action={questions && <Badge variant="secondary">{questions.length} found</Badge>}
      >
        {/* Filters */}
        <div className="flex flex-wrap gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
          <select
            value={difficulty}
            onChange={(e) => {
              setQuestions(null);
              setDifficulty(e.target.value);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="">All difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            value={type}
            onChange={(e) => {
              setQuestions(null);
              setType(e.target.value);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="">All types</option>
            <option value="dsa">DSA</option>
            <option value="aptitude">Aptitude</option>
            <option value="technical">Technical</option>
            <option value="hr">HR</option>
          </select>

          <select
            value={year}
            onChange={(e) => {
              setQuestions(null);
              setYear(e.target.value);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="">All years</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>

        {error && <PanelError message={error} />}

        {!questions ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : questions.length === 0 ? (
          <PanelEmpty
            icon={FileQuestion}
            title="Nothing matches those filters"
            hint="Try widening the difficulty or year filter."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {questions.map((q) => (
              <div key={q.id}>
                <button
                  onClick={() => setOpen(open === q.id ? null : q.id)}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{q.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {q.company?.name} · {q.year} · {q.topic}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium shrink-0 capitalize",
                        DIFFICULTY_STYLE[q.difficulty]
                      )}
                    >
                      {q.difficulty}
                    </span>
                  </div>
                </button>

                {open === q.id && (
                  <div className="px-4 pb-4 space-y-2">
                    {q.content && (
                      <p className="text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-lg p-3">
                        {q.content}
                      </p>
                    )}
                    {q.answer && (
                      <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                        <span className="font-semibold">Approach: </span>
                        {q.answer}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ── Test builder ────────────────────────── */

function TestBuilder() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyId, setCompanyId] = useState<string>("");
  const [count, setCount] = useState(10);
  const [test, setTest] = useState<GeneratedTest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ companies: Company[] }>("/tpcell/companies")
      .then((d) => setCompanies(d.companies))
      .catch(() => {});
  }, []);

  const generate = async () => {
    setLoading(true);
    setError("");
    setTest(null);
    try {
      const data = await api<{ test: GeneratedTest }>("/tpcell/tests/generate", {
        method: "POST",
        body: {
          companyId: companyId ? Number(companyId) : undefined,
          totalQuestions: count,
        },
      });
      setTest(data.test);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not build the test.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <Panel title="Build a practice set" icon={Sparkles} iconClass="text-violet-500">
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company</label>
              <select
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className={inputBase}
              >
                <option value="">Any company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Questions</label>
              <input
                type="number"
                min={1}
                max={30}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className={inputBase}
              />
            </div>

            <div className="flex items-end">
              <PrimaryButton onClick={generate} loading={loading} className="w-full">
                Build set
              </PrimaryButton>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Questions are pulled from the TP Cell&apos;s vetted bank in a 40/40/20 easy-medium-hard
            mix, so nothing in the paper is invented.
          </p>
        </div>
      </Panel>

      {error && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <PanelError message={error} />
        </div>
      )}

      {test && (
        <Panel
          title={test.title}
          icon={FileQuestion}
          iconClass="text-blue-500"
          action={
            <div className="flex items-center gap-1.5">
              <Badge variant="success">{test.breakdown.easy} easy</Badge>
              <Badge variant="warning">{test.breakdown.medium} medium</Badge>
              <Badge variant="default">{test.breakdown.hard} hard</Badge>
            </div>
          }
        >
          <ol className="divide-y divide-slate-100">
            {test.questions.map((q, i) => (
              <li key={q.id} className="px-4 py-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800">{q.title}</p>
                    {q.content && <p className="text-xs text-slate-500 mt-1">{q.content}</p>}
                    <p className="text-[11px] text-slate-400 mt-1">
                      {q.company?.name} · {q.topic} · {q.difficulty}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      )}
    </div>
  );
}

/* ── Placement calendar ──────────────────── */

const EVENT_STYLE: Record<string, string> = {
  company_visit: "bg-blue-50 text-blue-700 border-blue-200",
  seminar: "bg-violet-50 text-violet-700 border-violet-200",
  deadline: "bg-rose-50 text-rose-700 border-rose-200",
  exam: "bg-amber-50 text-amber-700 border-amber-200",
};

function PlacementCalendar({ canPost }: { canPost: boolean }) {
  const [week, setWeek] = useState<CalendarWeek | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    eventDate: "",
    startTime: "",
    venue: "",
    type: "company_visit",
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setWeek(await api<CalendarWeek>("/calendar/week"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the calendar.");
    }
  }, []);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  const add = async () => {
    if (!form.title || !form.eventDate) return;
    setSaving(true);
    try {
      await api("/calendar", { method: "POST", body: form });
      setForm({ title: "", eventDate: "", startTime: "", venue: "", type: "company_visit" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add the event.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {canPost && (
        <Panel title="Add an event" icon={CalendarDays} iconClass="text-blue-500">
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
            <PrimaryButton onClick={add} loading={saving} disabled={!form.title || !form.eventDate}>
              Add
            </PrimaryButton>
          </div>
        </Panel>
      )}

      <Panel
        title="This week on campus"
        icon={CalendarDays}
        iconClass="text-blue-500"
        action={week && <Badge variant="secondary">{week.weekStart} → {week.weekEnd}</Badge>}
      >
        {error && <PanelError message={error} />}
        {!week ? (
          <div className="p-4 grid grid-cols-2 lg:grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
        ) : (
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {week.days.map((day) => (
              <div
                key={day.date}
                className={cn(
                  "rounded-xl border p-2.5 min-h-28",
                  day.isToday
                    ? "border-blue-200 bg-blue-50"
                    : "border-slate-100 bg-slate-50"
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

                <div className="space-y-1.5">
                  {day.items.length === 0 ? (
                    <p className="text-[10px] text-slate-400">—</p>
                  ) : (
                    day.items.map((e) => (
                      <div
                        key={e.id}
                        className={cn(
                          "rounded-lg border px-2 py-1.5",
                          EVENT_STYLE[e.type] ?? EVENT_STYLE.company_visit
                        )}
                      >
                        <p className="text-[11px] font-semibold leading-tight">{e.title}</p>
                        {e.time && <p className="text-[10px] opacity-80 mt-0.5">{e.time}</p>}
                        {e.venue && (
                          <p className="text-[10px] opacity-80 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-2.5 h-2.5" />
                            {e.venue}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel title="Why this lives here" icon={Briefcase} iconClass="text-slate-400">
        <p className="px-4 py-3 text-xs text-slate-500">
          Placement updates used to arrive on Telegram while everything else ran through WhatsApp,
          Classroom and email — so students missed them. The calendar gives a reason to check back
          between notices.
        </p>
      </Panel>
    </div>
  );
}
