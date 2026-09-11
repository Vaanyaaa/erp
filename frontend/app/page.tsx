import Link from "next/link";
import type { Metadata } from "next";
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Users,
  BarChart2,
  ArrowRight,
  LogIn,
  UserPlus,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Acadex | Internal Academic Management System",
  description:
    "Acadex is a unified internal portal for students, professors, parents, and administrators of educational institutions.",
};

const features = [
  {
    icon: BookOpen,
    title: "Course Management",
    description: "Access course materials, daily timetables, and academic curriculum in one unified workspace.",
    color: "text-blue-700",
    bg: "bg-blue-50 border border-blue-200",
  },
  {
    icon: CheckCircle2,
    title: "Attendance Tracking",
    description: "Real-time attendance percentage tracking with eligibility status and margin calculation.",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border border-emerald-200",
  },
  {
    icon: BarChart2,
    title: "Training & Placement",
    description: "Campus recruitment drives, aptitude practice quizzes, and internship applications.",
    color: "text-purple-700",
    bg: "bg-purple-50 border border-purple-200",
  },
  {
    icon: Users,
    title: "Multi-Role Access",
    description: "Dedicated, secure internal portals tailored for students, professors, and parents.",
    color: "text-amber-700",
    bg: "bg-amber-50 border border-amber-200",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 tracking-tight">EduSphere</span>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1 py-0.2 rounded font-mono">
                  ERP
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Academic Portal</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
        <div className="w-full max-w-3xl mx-auto text-center space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            Authorized Institutional Access
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            EduSphere <span className="text-blue-700">ERP</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Unified internal academic management system for students, faculty, parents, and campus administration.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              id="cta-login"
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 shadow-xs transition-colors w-full sm:w-auto justify-center"
            >
              <LogIn className="w-4 h-4" />
              Sign In to Portal
            </Link>
            <Link
              id="cta-signup"
              href="/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-colors w-full sm:w-auto justify-center"
            >
              <UserPlus className="w-4 h-4" />
              Create Account
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="w-full max-w-4xl mx-auto mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-colors text-left"
              >
                <div className={`w-8 h-8 rounded-lg ${f.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${f.color}`} />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        © 2026 EduSphere ERP · Internal Academic Management System · Authorized users only
      </footer>
    </div>
  );
}
