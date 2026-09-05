"use client";

import React from "react";
import { TopBar } from "./TopBar";

/**
 * AppShell — wraps authenticated pages with the full-width navbar.
 * Usage:
 *   <AppShell>
 *     <YourPageContent />
 *   </AppShell>
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-800">
      {/* ── Top Navbar with all options & quick actions ───────────── */}
      <TopBar />

      {/* ── Full Width Page Content ───────────────────────────────── */}
      <main className="flex-1 w-full pb-12">
        {children}
      </main>
    </div>
  );
}
