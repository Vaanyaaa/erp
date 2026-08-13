"use client";

import React from "react";
import { GraduationCap, UserCheck, Users, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type RoleType = "student" | "professor" | "parent";

interface RoleOption {
  id: RoleType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const roles: RoleOption[] = [
  {
    id: "student",
    title: "Student",
    description: "Access course materials, attendance & results",
    icon: GraduationCap,
  },
  {
    id: "professor",
    title: "Professor",
    description: "Manage classes, post assignments & grades",
    icon: UserCheck,
  },
  {
    id: "parent",
    title: "Parent",
    description: "Monitor child's academic progress & fee status",
    icon: Users,
  },
];

interface RoleSelectorProps {
  selectedRole: RoleType;
  onSelectRole: (role: RoleType) => void;
}

export function RoleSelector({ selectedRole, onSelectRole }: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
        Select Institutional Role
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              type="button"
              id={`role-select-${role.id}`}
              onClick={() => onSelectRole(role.id)}
              className={cn(
                "relative flex flex-col items-start p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer",
                isSelected
                  ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-sm"
                  : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
              )}
            >
              {isSelected && (
                <CheckCircle className="absolute top-2.5 right-2.5 w-4 h-4 text-blue-600" />
              )}
              <div
                className={cn(
                  "p-2 rounded-lg mb-2 transition-colors",
                  isSelected ? "bg-blue-600 text-white" : "bg-slate-200/70 text-slate-600"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900">{role.title}</span>
              <span className="text-[10px] text-slate-500 mt-0.5 leading-tight line-clamp-2">
                {role.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
