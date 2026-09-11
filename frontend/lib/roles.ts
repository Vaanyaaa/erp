import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Calendar,
  CalendarRange,
  FileText,
  GraduationCap,
  BarChart2,
  CreditCard,
  Library,
  Bell,
  User,
  Settings,
  HeadphonesIcon,
  FolderOpen,
  Briefcase,
} from "lucide-react";

export type Role = "student" | "professor" | "parent" | "tp_admin";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * Does the TP Cell head also teach?
 *
 * Set to false deliberately: in most colleges the Training & Placement officer
 * is an administrative post, not a teaching one, so a timetable there would be
 * an empty section for the person who actually holds the role. Flip this to
 * true if your TP Cell head does teach — the nav item and the dashboard
 * schedule panel both come back on, and the backend already scopes a
 * timetable by professorId.
 */
export const TP_ADMIN_TEACHES = false;

const ALL: Record<string, NavItem> = {
  dashboard: { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  courses: { id: "courses", label: "Courses", icon: BookOpen },
  attendance: { id: "attendance", label: "Attendance", icon: ClipboardCheck },
  timetable: { id: "timetable", label: "Timetable", icon: Calendar },
  assignments: { id: "assignments", label: "Assignments", icon: FileText },
  examination: { id: "examination", label: "Examination", icon: GraduationCap },
  results: { id: "results", label: "Results", icon: BarChart2 },
  tpcell: { id: "tpcell", label: "TP Cell", icon: Briefcase },
  calendar: { id: "calendar", label: "Calendar", icon: CalendarRange },
  fees: { id: "fees", label: "Fees", icon: CreditCard },
  library: { id: "library", label: "Library", icon: Library },
  notices: { id: "notices", label: "Notices", icon: Bell },
  documents: { id: "documents", label: "Documents", icon: FolderOpen },
  profile: { id: "profile", label: "Profile", icon: User },
  settings: { id: "settings", label: "Settings", icon: Settings },
  support: { id: "support", label: "Support", icon: HeadphonesIcon },
};

/**
 * One list per role. A section that isn't in a role's list is unreachable for
 * that role — the router falls back to the dashboard rather than rendering it.
 */
const NAV_BY_ROLE: Record<Role, string[]> = {
  student: [
    "dashboard",
    "courses",
    "attendance",
    "timetable",
    "assignments",
    "examination",
    "results",
    "tpcell",
    "calendar",
    "fees",
    "library",
    "notices",
    "profile",
    "settings",
    "support",
  ],

  professor: [
    "dashboard",
    "attendance",
    "timetable",
    "assignments",
    "examination",
    "results",
    "tpcell",
    "calendar",
    "library",
    "notices",
    "documents",
    "profile",
    "settings",
    "support",
  ],

  tp_admin: [
    "dashboard",
    ...(TP_ADMIN_TEACHES ? ["timetable"] : []),
    "examination",
    "tpcell",
    "calendar",
    "notices",
    "documents",
    "profile",
    "settings",
    "support",
  ],

  parent: [
    "dashboard",
    "courses",
    "attendance",
    "timetable",
    "examination",
    "results",
    "tpcell",
    "calendar",
    "fees",
    "notices",
    "profile",
    "settings",
    "support",
  ],
};

export function navItemsFor(role: Role | undefined): NavItem[] {
  const ids = NAV_BY_ROLE[role ?? "student"] ?? NAV_BY_ROLE.student;
  return ids.map((id) => ALL[id]);
}

export function canAccess(role: Role | undefined, sectionId: string): boolean {
  const ids = NAV_BY_ROLE[role ?? "student"] ?? NAV_BY_ROLE.student;
  return ids.includes(sectionId);
}

export function labelFor(sectionId: string): string {
  return ALL[sectionId]?.label ?? "Section";
}

/** Roles that may add calendar events, notices and uploads. */
export function canPublish(role: Role | undefined): boolean {
  return role === "professor" || role === "tp_admin";
}

/** Only professors upload assignments and notes. */
export function canUploadMaterials(role: Role | undefined): boolean {
  return role === "professor" || role === "tp_admin";
}

/**
 * Parents get the TP Cell for visibility into placements, but not the
 * practice tooling — that is for the student to use, not to be watched at.
 */
export function tpCellTabsFor(role: Role | undefined): string[] {
  if (role === "parent") return ["notices", "calendar"];
  return ["notices", "bank", "test", "calendar"];
}

/** Sections that exist in the nav but whose feature isn't built yet. */
export const PLACEHOLDER_COPY: Record<string, { title: string; hint: string }> = {
  examination: {
    title: "Examination module is not built yet",
    hint: "The examination login is still to be made. Once it exists, exam schedules, hall tickets and seating will show up here.",
  },
  results: {
    title: "Results module is not built yet",
    hint: "The results login is still to be made. Published marks, grade cards and backlog status will appear here.",
  },
  attendance_staff: {
    title: "Attendance marking is not built yet",
    hint: "This feature is still to be added. Marking a class and viewing section-wise attendance will live here.",
  },
  courses: {
    title: "Courses is not built yet",
    hint: "This feature is still to be added.",
  },
  settings: {
    title: "Settings is not built yet",
    hint: "This feature is still to be added.",
  },
  support: {
    title: "Support is not built yet",
    hint: "This feature is still to be added.",
  },
};
