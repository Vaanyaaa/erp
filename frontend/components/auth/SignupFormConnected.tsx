"use client";

import React from "react";
import { SignupForm } from "@/components/auth/SignupForm";
import { useAuth } from "@/lib/auth";

/**
 * The backend accepts the payload SignupForm already builds, including its
 * studentDept / profDept field names, so nothing about the form changes here.
 */
export function SignupFormConnected() {
  const { register } = useAuth();

  return (
    <SignupForm
      onSubmit={async (payload) => {
        await register(payload as unknown as Record<string, unknown>);
      }}
    />
  );
}
