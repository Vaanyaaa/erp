"use client";

import React from "react";
import { Settings, Bell, Lock, Globe, Shield, Moon } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="px-6 py-6 max-w-4xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Portal Settings
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your notification preferences, credentials, and account security
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 shadow-xs">
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Email & SMS Alerts</h3>
                <p className="text-xs text-slate-500">Receive timetable changes and exam hall ticket alerts</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Enabled
            </span>
          </div>

          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Portal Password</h3>
                <p className="text-xs text-slate-500">Last updated 45 days ago</p>
              </div>
            </div>
            <button
              onClick={() => alert("Password change dialog")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            >
              Update Password
            </button>
          </div>

          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Two-Factor Authentication (2FA)</h3>
                <p className="text-xs text-slate-500">Secured via registered student phone number</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Active
            </span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
