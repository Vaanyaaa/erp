"use client";

import React from "react";
import { HelpCircle, Mail, Phone, MessageSquare, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

export default function SupportPage() {
  return (
    <AppShell>
      <div className="px-6 py-6 max-w-4xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Help & Support Desk
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Institutional IT cell support, examination office helpline, and ERP guidance
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">ERP Technical Support</h3>
              <p className="text-xs text-slate-500 mt-0.5">For login problems, fee receipt slips, and technical bugs</p>
            </div>
            <a
              href="mailto:support-erp@college.edu"
              className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              support-erp@college.edu <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Academic Office Helpline</h3>
              <p className="text-xs text-slate-500 mt-0.5">For attendance discrepancy, timetable queries, and elective forms</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-800">
              +91 (011) 2659-7100 (Ext. 402)
            </span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
