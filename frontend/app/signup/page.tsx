import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | EduSphere ERP",
  description:
    "Register for the EduSphere ERP internal academic management portal as a student, professor, or parent.",
};

export default function SignupPage() {
  return (
    <AuthLayout subtitleText="Internal Academic Management System • Account Registration">
      {/* Backend integration point: pass onSubmit prop to SignupForm when auth provider is ready */}
      <SignupForm />
    </AuthLayout>
  );
}
