"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { RoleSelector, RoleType } from "@/components/auth/RoleSelector";
import {
  User,
  Mail,
  Phone,
  Hash,
  Building2,
  BookOpen,
  Layers,
  Briefcase,
  Heart,
  CheckCircle2,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ------------------------------------------------------------
// Password strength helper — purely client-side UI feedback
// ------------------------------------------------------------
function getPasswordStrength(pass: string) {
  if (!pass) return { score: 0, label: "", color: "bg-slate-200" };
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;

  if (score <= 1) return { score: 1, label: "Weak", color: "bg-rose-500" };
  if (score <= 3) return { score: 2, label: "Medium", color: "bg-amber-500" };
  return { score: 3, label: "Strong", color: "bg-emerald-500" };
}

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
export interface SignupPayload {
  role: RoleType;
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  // Student
  enrollmentNo?: string;
  studentDept?: string;
  program?: string;
  semester?: string;
  // Professor
  employeeId?: string;
  profDept?: string;
  designation?: string;
  // Parent
  childEnrollmentNo?: string;
  relationship?: string;
}

interface SignupFormProps {
  /** Backend integration hook: called with full payload on submit */
  onSubmit?: (data: SignupPayload) => void | Promise<void>;
  /** External error from backend response */
  externalError?: string;
}

// ------------------------------------------------------------
// Shared input className helper
// ------------------------------------------------------------
const inputBase =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all";

const roleInputBase =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 pl-9 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all";

// ------------------------------------------------------------
// SignupForm
// ------------------------------------------------------------
export function SignupForm({ onSubmit, externalError }: SignupFormProps) {
  const router = useRouter();

  // Role
  const [role, setRole] = useState<RoleType>("student");

  // Common fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Student-specific fields
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [studentDept, setStudentDept] = useState("");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");

  // Professor-specific fields
  const [employeeId, setEmployeeId] = useState("");
  const [profDept, setProfDept] = useState("");
  const [designation, setDesignation] = useState("");

  // Parent-specific fields
  const [childEnrollmentNo, setChildEnrollmentNo] = useState("");
  const [relationship, setRelationship] = useState("");

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const strength = getPasswordStrength(password);

  // ---- Validation ----
  const areCommonFieldsValid =
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    mobileNumber.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    password === confirmPassword &&
    termsAccepted;

  const isRoleFieldsValid = (() => {
    if (role === "student")
      return (
        enrollmentNo.trim() !== "" &&
        studentDept.trim() !== "" &&
        program.trim() !== "" &&
        semester.trim() !== ""
      );
    if (role === "professor")
      return (
        employeeId.trim() !== "" &&
        profDept.trim() !== "" &&
        designation.trim() !== ""
      );
    if (role === "parent")
      return (
        childEnrollmentNo.trim() !== "" && relationship.trim() !== ""
      );
    return false;
  })();

  const isFormValid = areCommonFieldsValid && isRoleFieldsValid;

  // ---- Submit Handler ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    const payload: SignupPayload = {
      role,
      fullName,
      email,
      mobileNumber,
      password,
      ...(role === "student" && { enrollmentNo, studentDept, program, semester }),
      ...(role === "professor" && { employeeId, profDept, designation }),
      ...(role === "parent" && { childEnrollmentNo, relationship }),
    };

    try {
      // Backend integration point:
      // Replace with: await fetch("/api/auth/register", { method: "POST", body: JSON.stringify(payload) })
      // Or with Supabase: await supabase.auth.signUp({ email, password, options: { data: payload } })
      if (onSubmit) {
        await onSubmit(payload);
        router.push("/dashboard");
      } else {
        await new Promise((r) => setTimeout(r, 800));
        // Temporary session store — replaced by auth context when backend is connected
        const userSession = {
          fullName: payload.fullName,
          email: payload.email,
          role: payload.role,
          department:
            payload.role === "student"
              ? payload.studentDept
              : payload.role === "professor"
              ? payload.profDept
              : undefined,
          semester: payload.role === "student" ? payload.semester : undefined,
          program: payload.role === "student" ? payload.program : undefined,
          enrollmentNo: payload.role === "student" ? payload.enrollmentNo : undefined,
          employeeId: payload.role === "professor" ? payload.employeeId : undefined,
          designation: payload.role === "professor" ? payload.designation : undefined,
          relationship: payload.role === "parent" ? payload.relationship : undefined,
          childEnrollmentNo:
            payload.role === "parent" ? payload.childEnrollmentNo : undefined,
          mobileNumber: payload.mobileNumber,
        };
        sessionStorage.setItem("edusphere_user", JSON.stringify(userSession));
        router.push("/dashboard");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Success Banner */}
      {successMessage && (
        <div
          role="status"
          className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Account Created</p>
            <p className="text-emerald-700 mt-0.5">{successMessage}</p>
          </div>
        </div>
      )}

      {/* External error banner */}
      {externalError && !successMessage && (
        <div
          role="alert"
          className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700"
        >
          <span>{externalError}</span>
        </div>
      )}

      {/* ---- STEP 1: Role Selection ---- */}
      <RoleSelector
        selectedRole={role}
        onSelectRole={(newRole) => setRole(newRole)}
      />

      {/* ---- STEP 2: Registration Form ---- */}
      <div className="border-t border-slate-100 pt-3">
        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
          {role.charAt(0).toUpperCase() + role.slice(1)} Details
        </p>

        <div className="space-y-3">
          {/* Full Name */}
          <div className="space-y-1">
            <label
              htmlFor="signup-fullName"
              className="block text-xs font-semibold text-slate-700"
            >
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="signup-fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Dr. Eleanor Vance or Alex Mercer"
                className={inputBase}
                autoComplete="name"
                required
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label
                htmlFor="signup-email"
                className="block text-xs font-semibold text-slate-700"
              >
                Institutional Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={inputBase}
                  autoComplete="email"
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="signup-mobile"
                className="block text-xs font-semibold text-slate-700"
              >
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="signup-mobile"
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className={inputBase}
                  autoComplete="tel"
                  required
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ---- CONDITIONAL ROLE FIELDS ---- */}

          {/* Student Fields */}
          {role === "student" && (
            <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-100/80 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="signup-enrollmentNo"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Enrollment Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="signup-enrollmentNo"
                      type="text"
                      value={enrollmentNo}
                      onChange={(e) => setEnrollmentNo(e.target.value)}
                      placeholder="e.g. EN2026-904"
                      className={roleInputBase}
                      required
                    />
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="signup-studentDept"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="signup-studentDept"
                      type="text"
                      value={studentDept}
                      onChange={(e) => setStudentDept(e.target.value)}
                      placeholder="e.g. Computer Science"
                      className={roleInputBase}
                      required
                    />
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="signup-program"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Program / Degree <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="signup-program"
                      type="text"
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      placeholder="e.g. B.Tech CS"
                      className={roleInputBase}
                      required
                    />
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="signup-semester"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Semester / Class <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="signup-semester"
                      type="text"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      placeholder="e.g. Semester IV"
                      className={roleInputBase}
                      required
                    />
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Professor Fields */}
          {role === "professor" && (
            <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-100/80 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="signup-employeeId"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Employee ID <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="signup-employeeId"
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      placeholder="e.g. FAC-8821"
                      className={roleInputBase}
                      required
                    />
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="signup-profDept"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="signup-profDept"
                      type="text"
                      value={profDept}
                      onChange={(e) => setProfDept(e.target.value)}
                      placeholder="e.g. Physics"
                      className={roleInputBase}
                      required
                    />
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="signup-designation"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Designation <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="signup-designation"
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Assoc. Professor"
                      className={roleInputBase}
                      required
                    />
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Parent Fields */}
          {role === "parent" && (
            <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-100/80 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="signup-childEnrollmentNo"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Student Enrollment No.{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="signup-childEnrollmentNo"
                      type="text"
                      value={childEnrollmentNo}
                      onChange={(e) => setChildEnrollmentNo(e.target.value)}
                      placeholder="e.g. EN2026-904"
                      className={roleInputBase}
                      required
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="signup-relationship"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Relationship to Student{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="signup-relationship"
                      type="text"
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      placeholder="e.g. Father / Mother"
                      className={roleInputBase}
                      required
                    />
                    <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label
                htmlFor="signup-password"
                className="block text-xs font-semibold text-slate-700"
              >
                Password <span className="text-rose-500">*</span>
              </label>
              <PasswordInput
                id="signup-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
              />
              {/* Password strength indicator */}
              {password && (
                <div className="space-y-1 pt-0.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Strength:</span>
                    <span className="font-semibold">{strength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3].map((bar) => (
                      <div
                        key={bar}
                        className={cn(
                          "h-full flex-1 rounded-full transition-all",
                          strength.score >= bar ? strength.color : "bg-slate-200"
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="signup-confirmPassword"
                className="block text-xs font-semibold text-slate-700"
              >
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <PasswordInput
                id="signup-confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                error={
                  confirmPassword && password !== confirmPassword
                    ? "Passwords do not match"
                    : undefined
                }
                autoComplete="new-password"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Privacy Checkbox */}
      <div className="pt-1">
        <label className="flex items-start gap-2 cursor-pointer select-none">
          <input
            id="signup-terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 mt-0.5 shrink-0 cursor-pointer"
          />
          <span className="text-xs text-slate-600 leading-normal">
            I agree to the{" "}
            <Link
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-blue-600 hover:underline font-medium"
            >
              Institutional Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-blue-600 hover:underline font-medium"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>
      </div>

      {/* Submit Button */}
      {/* Backend integration point: wire onSubmit to auth/registration provider */}
      <button
        type="submit"
        id="signup-submit-btn"
        disabled={!isFormValid || isSubmitting}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm text-white shadow-sm transition-all duration-150",
          isFormValid && !isSubmitting
            ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 cursor-pointer shadow-blue-500/20"
            : "bg-slate-300 text-slate-500 cursor-not-allowed"
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creating Account…</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" />
            <span>Create Account</span>
          </>
        )}
      </button>

      {/* Secondary Navigation Link */}
      <div className="text-center pt-1 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Already have an institutional account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </form>
  );
}
