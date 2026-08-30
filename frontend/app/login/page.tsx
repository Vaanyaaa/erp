import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | EduSphere ERP",
  description:
    "Sign in to the EduSphere ERP internal academic management portal for students, professors, and parents.",
};

export default function LoginPage() {
  return (
    <AuthLayout hideHeader>
      {/* Backend integration point: pass onSubmit prop to LoginForm when auth provider is ready */}
      <LoginForm />
    </AuthLayout>
  );
}
