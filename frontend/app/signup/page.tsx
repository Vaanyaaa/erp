import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupFormConnected } from "@/components/auth/SignupFormConnected";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Acadex",
  description:
    "Register for the Acadex internal academic management portal as a student, professor, or parent.",
};

export default function SignupPage() {
  return (
    <AuthLayout subtitleText="Internal Academic Management System • Account Registration">
      <SignupFormConnected />
    </AuthLayout>
  );
}
