/**
 * Single place where the frontend talks to the Express backend.
 * Point NEXT_PUBLIC_API_URL at a deployed API when you host it; the default
 * matches the backend's own default port so `npm run dev` in both folders
 * just works.
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "acadex_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Set for multipart uploads — the body is passed through untouched. */
  raw?: boolean;
}

export async function api<T = unknown>(
  path: string,
  { body, raw, headers, ...rest }: RequestOptions = {}
): Promise<T> {
  const token = getToken();

  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };
  if (token) finalHeaders.Authorization = `Bearer ${token}`;
  if (body && !raw) finalHeaders["Content-Type"] = "application/json";

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: raw ? (body as BodyInit) : body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Can't reach the server. Start the backend with `npm run dev` in the backend folder.",
      0
    );
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new ApiError(data.message || "That request failed.", response.status);
  }

  return data as T;
}

/* ── Response shapes ─────────────────────── */

export interface AppUser {
  id: number;
  fullName: string;
  email: string;
  mobileNumber?: string;
  role: "student" | "professor" | "parent" | "tp_admin";
  lastLoginAt?: string;
  enrollmentNo?: string;
  department?: string;
  program?: string;
  semester?: string;
  employeeId?: string;
  designation?: string;
  childEnrollmentNo?: string;
  relationship?: string;
}

export interface Notice {
  id: number;
  title: string;
  body: string;
  category: "general" | "tp_cell" | "exam" | "fees" | "emergency";
  priority: "normal" | "high";
  eventDate?: string | null;
  createdAt: string;
  postedBy?: { id: number; fullName: string; role: string };
}

export interface Company {
  id: number;
  name: string;
  sector?: string;
  ctcRange?: string;
  description?: string;
  questionCount: number;
}

export interface Question {
  id: number;
  year: number;
  type: string;
  difficulty: "easy" | "medium" | "hard";
  topic?: string;
  title: string;
  content?: string;
  answer?: string;
  company?: { id: number; name: string };
}

export interface CalendarEventItem {
  id: number;
  title: string;
  eventDate: string;
  startTime?: string;
  venue?: string;
  type: "company_visit" | "seminar" | "deadline" | "exam";
  notes?: string;
}

/** One row on the calendar, whatever fed it. */
export interface CalendarItem {
  id: string;
  refId: number;
  source: "calendar" | "notice" | "material";
  category: string;
  type: string;
  title: string;
  date: string;
  time?: string | null;
  venue?: string | null;
  detail?: string | null;
  postedBy?: string;
  canDelete: boolean;
}

export interface MonthDay {
  date: string;
  dayOfMonth: number;
  inMonth: boolean;
  isToday: boolean;
  items: CalendarItem[];
}

export interface MonthCalendar {
  year: number;
  month: number;
  monthLabel: string;
  weeks: MonthDay[][];
  totalItems: number;
}

export interface Material {
  id: number;
  kind: "assignment" | "note";
  title: string;
  description?: string;
  subject?: string;
  dueDate?: string | null;
  originalName?: string;
  mimeType?: string;
  sizeBytes?: number;
  createdAt: string;
  uploadedBy?: { id: number; fullName: string };
}

export interface CalendarWeek {
  weekStart: string;
  weekEnd: string;
  days: {
    date: string;
    label: string;
    dayOfMonth: number;
    isToday: boolean;
    items: CalendarItem[];
    events: CalendarItem[];
  }[];
}

export interface SummaryCard {
  value: string | number | null;
  label: string;
}

export interface Summary {
  scope: "self" | "ward" | "staff";
  student?: { fullName: string; enrollmentNo?: string };
  cards: {
    courses: SummaryCard;
    attendance: SummaryCard;
    assignments: SummaryCard;
    results: SummaryCard;
  };
}

export interface AttendanceData {
  scope: string;
  overall: number | null;
  present: number;
  absent: number;
  total: number;
  byCourse: {
    code: string;
    name: string;
    total: number;
    present: number;
    percentage: number;
  }[];
  records: {
    id: number;
    date: string;
    status: string;
    course?: { code: string; name: string };
  }[];
}

export interface FeesData {
  scope: string;
  fees: {
    id: number;
    title: string;
    amountDue: number;
    dueDate?: string;
    status: "pending" | "paid" | "overdue";
    receiptNo?: string;
  }[];
  totals: { total: number; paid: number; outstanding: number } | null;
}

export interface TimetableSlotItem {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime?: string;
  subject: string;
  room?: string;
}

export interface ActivityItem {
  id: number;
  action: string;
  detail?: string;
  createdAt: string;
}

export interface CourseItem {
  id: number;
  code: string;
  name: string;
  credits: number;
  semester?: string;
}

export interface DocumentItem {
  id: number;
  originalName: string;
  confidence: number;
  kind: string;
  createdAt: string;
}

export interface OcrResult {
  document: DocumentItem;
  text: string;
  lines: string[];
  structured: {
    rows: { label: string; value: number; outOf: number | null }[];
    unparsed: string[];
  };
}

export interface GeneratedTest {
  title: string;
  generatedAt: string;
  requested: number;
  delivered: number;
  breakdown: { easy: number; medium: number; hard: number };
  questions: Question[];
}
