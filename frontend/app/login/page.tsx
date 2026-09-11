import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginFormConnected } from "@/components/auth/LoginFormConnected";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Acadex",
  description:
    "Sign in to the Acadex internal academic management portal for students, professors, and parents.",
};

export default function LoginPage() {
  return (
    <AuthLayout hideHeader>
      {/* Backend integration point: pass onSubmit prop to LoginForm when auth provider is ready */}
      <LoginForm />
    </AuthLayout>
  );
}
