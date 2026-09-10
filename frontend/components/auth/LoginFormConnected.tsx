"use client";

import React from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/lib/auth";

/**
 * The form already exposes an onSubmit hook, so wiring the real API needs no
 * changes to its markup — it keeps its own loading and error states.
 */
export function LoginFormConnected() {
  const { login } = useAuth();

  return (
    <LoginForm
      onSubmit={async ({ identifier, password }) => {
        await login(identifier, password);
      }}
    />
  );
}
