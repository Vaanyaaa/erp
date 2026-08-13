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
  title: "EduSphere ERP | Internal Academic Management System",
  description:
    "EduSphere ERP is a unified internal portal for students, professors, parents, and administrators of educational institutions.",
};

const features = [
  {
    icon: BookOpen,
    title: "Course Management",
    description: "Access materials, assignments, and academic records in one place.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: CheckCircle2,
    title: "Attendance Tracking",
    description: "Real-time attendance monitoring across all departments.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: BarChart2,
    title: "Results & Analytics",
    description: "Automated examination results and CGPA tracking.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Users,
    title: "Multi-Role Access",
    description: "Tailored portals for students, professors, and parents.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-sm">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-slate-800 tracking-tight">EduSphere ERP</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Academic Portal</span>
            </div>
          </div>

          {/* Auth Links */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              Log In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24">
        <div className="w-full max-w-4xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
            <ShieldCheck className="w-3.5 h-3.5" />
            Authorized Personnel Only
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            EduSphere{" "}
            <span className="text-blue-600">ERP</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            A unified internal academic management system for students, professors, parents, and administrators.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              id="cta-signup"
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md shadow-blue-500/25 transition-all w-full sm:w-auto justify-center"
            >
              <UserPlus className="w-4 h-4" />
              Create Account
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              id="cta-login"
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all w-full sm:w-auto justify-center"
            >
              <LogIn className="w-4 h-4" />
              Sign In to Portal
            </Link>
          </div>

          <p className="text-xs text-slate-400 pt-1">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Feature Cards */}
        <div className="w-full max-w-4xl mx-auto mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className={`w-9 h-9 rounded-lg ${f.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-400">
        © 2026 EduSphere ERP · Internal Academic Management System · Authorized users only
      </footer>
    </div>
  );
}
