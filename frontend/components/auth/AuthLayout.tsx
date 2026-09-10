"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, ShieldCheck, BookOpen, Award, CheckCircle2 } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  subtitleText?: string;
}

export function AuthLayout({ children, subtitleText = "Internal Academic Management System" }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Side Panel (Desktop institutional illustration & branding) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background overlay circles */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-3">
            <Link href="/dashboard" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md shadow-sm group-hover:bg-white/20 transition-all">
                <GraduationCap className="w-6 h-6 text-blue-200" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white">Acadex</span>
                <span className="text-[11px] text-blue-200/80 uppercase tracking-widest font-medium">Academic Portal</span>
              </div>
            </Link>
          </div>

          {/* Center Institutional Features / Hero Banner */}
          <div className="relative z-10 my-8 space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-medium text-blue-200 backdrop-blur-sm mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                Institutional Security Standard
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight leading-snug">
                Unified Academic Operations & Governance
              </h1>
              <p className="text-sm text-blue-100/80 mt-2 leading-relaxed">
                Centralized cloud enterprise platform connecting students, faculty, and administration across all departments.
              </p>
            </div>

            <div className="space-y-3 border-t border-white/10 pt-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-100/90">Real-time attendance & course governance tracking</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-100/90">Automated examination & result processing workflow</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-100/90">Encrypted institutional records & compliance archival</p>
              </div>
            </div>
          </div>

          {/* Bottom Footer Info */}
          <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between text-[11px] text-blue-200/60">
            <span>© 2026 Acadex</span>
            <span>v2.0.0 (Build 402)</span>
          </div>
        </div>

        {/* Right Side Form Container */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div className="w-full max-w-md mx-auto my-auto space-y-6">
            {/* Header for mobile and right side */}
            <div className="text-center sm:text-left space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2.5 lg:hidden mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-800">Acadex</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Acadex
              </h2>
              <p className="text-xs text-slate-500 font-medium">{subtitleText}</p>
            </div>

            {/* Main Form Content */}
            {children}
          </div>

          {/* Form Footer Note */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
            <span>Official Institutional Access Portal • </span>
            <span className="font-semibold text-slate-500">Authorized personnel only</span>
          </div>
        </div>
      </div>
    </div>
  );
}
