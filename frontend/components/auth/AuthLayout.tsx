"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, ShieldCheck, CheckCircle2 } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  titleText?: string;
  subtitleText?: string;
  hideHeader?: boolean;
}

export function AuthLayout({
  children,
  titleText = "EduSphere ERP",
  subtitleText = "Internal Academic Management System",
  hideHeader = false,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100/70 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        {/* Left Side Panel (Institutional Branding) */}
        <div className="lg:col-span-5 bg-slate-900 p-8 text-white flex flex-col justify-between relative">
          {/* Top Brand Header */}
          <div className="space-y-3">
            <Link href="/login" className="inline-flex items-center gap-3 group focus:outline-none">
              <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold tracking-tight text-white">EduSphere</span>
                  <span className="text-[10px] font-semibold text-blue-400 bg-blue-950/60 border border-blue-800 px-1 py-0.2 rounded font-mono">
                    ERP
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Academic Portal</span>
              </div>
            </Link>
          </div>

          {/* Center Institutional Info */}
          <div className="my-8 space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-300 mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Verified Institutional Portal
              </span>
              <h1 className="text-xl font-bold text-white tracking-tight leading-snug">
                Unified Academic Operations &amp; Governance
              </h1>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Centralized academic cloud system for students, faculty, and university administration.
              </p>
            </div>

            <div className="space-y-2.5 border-t border-slate-800 pt-5">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">Real-time attendance &amp; timetable tracking</p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">Campus recruitment &amp; TPO internship portal</p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">Role-based student, parent &amp; faculty accounts</p>
              </div>
            </div>
          </div>

          {/* Bottom Footer Info */}
          <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>© 2026 EduSphere ERP</span>
            <span>v2.0.0</span>
          </div>
        </div>

        {/* Right Side Form Container */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div className="w-full max-w-md mx-auto my-auto space-y-6">
            {!hideHeader && (
              <div className="text-center sm:text-left space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2.5 lg:hidden mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white">
                    <GraduationCap className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-base font-bold text-slate-900">EduSphere ERP</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {titleText}
                </h2>
                <p className="text-xs text-slate-500 font-medium">{subtitleText}</p>
              </div>
            )}

            {children}
          </div>

          {/* Form Footer Note */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
            <span>Official Institutional Access • </span>
            <span className="font-semibold text-slate-500">Authorized personnel only</span>
          </div>
        </div>
      </div>
    </div>
  );
}
