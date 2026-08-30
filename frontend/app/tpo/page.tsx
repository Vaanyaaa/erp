"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  Award,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  XCircle,
  FileCheck,
  Search,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useUser,
  StudentHeaderNav,
  StudentProfileBanner,
  StudentFooter,
} from "@/components/dashboard/StudentHeader";

interface PlacementDrive {
  id: string;
  company: string;
  role: string;
  type: "Full Time + Internship" | "Summer Internship" | "Full Time";
  package: string;
  eligibility: string;
  deadline: string;
  location: string;
  status: "Eligible" | "Application Open" | "Under Review";
  tags: string[];
}

const PLACEMENT_DRIVES: PlacementDrive[] = [
  {
    id: "drive-msft",
    company: "Microsoft IDC",
    role: "Software Engineering Intern (Summer 2026)",
    type: "Summer Internship",
    package: "₹1,50,000 / month + Pre-Placement Offer (PPO)",
    eligibility: "B.Tech IT / CSE • CGPA ≥ 8.0 • No Active Backlogs",
    deadline: "Sep 15, 2025",
    location: "Hyderabad / Bengaluru",
    status: "Eligible",
    tags: ["Product", "DSA", "Cloud"],
  },
  {
    id: "drive-amzn",
    company: "Amazon AWS",
    role: "Cloud Support Associate & Software Dev",
    type: "Full Time + Internship",
    package: "₹1,25,000 / mo (Intern) • ₹28.5 LPA (Full Time)",
    eligibility: "B.Tech IT / CSE / ECE • CGPA ≥ 7.5",
    deadline: "Sep 20, 2025",
    location: "Bengaluru / Gurugram",
    status: "Eligible",
    tags: ["Cloud", "Linux", "Networking"],
  },
  {
    id: "drive-infy",
    company: "Infosys Limited",
    role: "Specialist Programmer (HackWithInfy)",
    type: "Full Time",
    package: "₹9.5 LPA – ₹11.5 LPA",
    eligibility: "All Branches • CGPA ≥ 7.0",
    deadline: "Sep 28, 2025",
    location: "Pan India",
    status: "Eligible",
    tags: ["Coding", "System Design"],
  },
  {
    id: "drive-goog",
    company: "Google India",
    role: "Student Training in Engineering Program (STEP)",
    type: "Summer Internship",
    package: "₹1,40,000 / month + Housing",
    eligibility: "B.Tech 3rd Year • Strong Programming Skills",
    deadline: "Oct 05, 2025",
    location: "Bengaluru / Hyderabad",
    status: "Eligible",
    tags: ["Algorithms", "Problem Solving"],
  },
];

interface QuizQuestion {
  id: number;
  question: string;
  category: "DSA" | "Aptitude" | "Core CS";
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the worst-case time complexity of QuickSort when using deterministic pivot selection?",
    category: "DSA",
    options: ["O(N log N)", "O(N²)", "O(log N)", "O(N)"],
    correctAnswer: 1,
    explanation: "QuickSort's worst-case time complexity is O(N²) when the selected pivot is repeatedly the extreme (smallest or largest) element, such as in already sorted arrays.",
  },
  {
    id: 2,
    question: "In relational databases, which Normal Form deals with removing transitive functional dependencies?",
    category: "Core CS",
    options: ["First Normal Form (1NF)", "Second Normal Form (2NF)", "Third Normal Form (3NF)", "BCNF"],
    correctAnswer: 2,
    explanation: "Third Normal Form (3NF) requires the relation to be in 2NF and have no non-prime attribute transitively dependent on any candidate key.",
  },
  {
    id: 3,
    question: "A pipe can fill a tank in 6 hours and another pipe can empty it in 8 hours. If both pipes are opened together, in how many hours will the tank be full?",
    category: "Aptitude",
    options: ["12 hours", "18 hours", "24 hours", "14 hours"],
    correctAnswer: 2,
    explanation: "Net rate = (1/6 - 1/8) = (4 - 3)/24 = 1/24. Therefore, the tank fills completely in 24 hours.",
  },
  {
    id: 4,
    question: "Which of the following TCP flags is used to initiate a three-way handshake connection?",
    category: "Core CS",
    options: ["ACK", "SYN", "FIN", "RST"],
    correctAnswer: 1,
    explanation: "The SYN (Synchronize Sequence Numbers) packet is the first step sent by the client to initiate the TCP three-way handshake.",
  },
  {
    id: 5,
    question: "What data structure is predominantly used to implement Breadth-First Search (BFS) on a graph?",
    category: "DSA",
    options: ["Stack", "Queue", "Priority Queue", "Min-Heap"],
    correctAnswer: 1,
    explanation: "Breadth-First Search (BFS) processes nodes level-by-level in FIFO order, which is inherently supported by a Queue.",
  },
];

export default function TPOPage() {
  const { user, logout } = useUser();

  const [appliedDrives, setAppliedDrives] = useState<Record<string, boolean>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [quizFilter, setQuizFilter] = useState<string>("All");

  const handleSelectAnswer = (questionId: number, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleApplyDrive = (driveId: string) => {
    setAppliedDrives((prev) => ({
      ...prev,
      [driveId]: true,
    }));
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const score = QUIZ_QUESTIONS.filter(
    (q) => selectedAnswers[q.id] === q.correctAnswer
  ).length;

  const filteredQuestions =
    quizFilter === "All"
      ? QUIZ_QUESTIONS
      : QUIZ_QUESTIONS.filter((q) => q.category === quizFilter);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col">
      <StudentHeaderNav user={user} onLogout={logout} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <StudentProfileBanner user={user} />

        {/* TPO Overview Stats Banner */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h1 className="text-base font-bold text-slate-900">
                  Training &amp; Placement Office (TPO)
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Campus recruitment drives, aptitude practice assessments &amp; internship applications
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-xs">
                CGPA: 8.92 • Eligible for Tier-1 Drives
              </span>
              <span className="px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs">
                Resume Verified ✓
              </span>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            SECTION 1: PLACEMENT NOTICE BOARD
           ───────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-blue-700 text-white flex items-center justify-center text-[11px] font-bold">
                1
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Placement Notice Board
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {PLACEMENT_DRIVES.length} Active Drives
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PLACEMENT_DRIVES.map((drive) => {
              const isApplied = appliedDrives[drive.id];
              return (
                <div
                  key={drive.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    {/* Top Company & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700">
                          <Building2 className="w-5 h-5 text-blue-700" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            {drive.company}
                          </h3>
                          <span className="text-xs font-semibold text-blue-700">
                            {drive.type}
                          </span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[10px]">
                        {drive.status}
                      </span>
                    </div>

                    {/* Role Title */}
                    <div>
                      <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                        Role Profile
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                        {drive.role}
                      </p>
                    </div>

                    {/* Compensation */}
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <span className="text-slate-500 font-medium">Compensation: </span>
                      <span className="font-bold text-slate-900">{drive.package}</span>
                    </div>

                    {/* Eligibility & Deadline */}
                    <div className="text-xs text-slate-500 space-y-1">
                      <p>
                        <span className="font-medium text-slate-700">Criteria: </span>
                        {drive.eligibility}
                      </p>
                      <p className="flex items-center gap-1 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Deadline: {drive.deadline}</span>
                        <span>• {drive.location}</span>
                      </p>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {drive.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Apply Button Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Official Campus Drive
                    </span>

                    {isApplied ? (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Application Submitted
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApplyDrive(drive.id)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                      >
                        <span>Apply via TPO</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            SECTION 2: PLACEMENT QUIZ
           ───────────────────────────────────────────── */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-blue-700 text-white flex items-center justify-center text-[11px] font-bold">
                2
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Placement Quiz &amp; Aptitude Practice
                </h2>
                <p className="text-xs text-slate-500">
                  Technical and quantitative practice problems for campus recruitment rounds.
                </p>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-slate-200 text-xs font-semibold self-start sm:self-auto">
              {["All", "DSA", "Core CS", "Aptitude"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setQuizFilter(cat)}
                  className={cn(
                    "px-3 py-1 rounded-md transition-colors cursor-pointer",
                    quizFilter === cat
                      ? "bg-blue-700 text-white shadow-2xs"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quiz Score Summary (Shown when submitted) */}
          {isSubmitted && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Quiz Completed — Score: {score} / {QUIZ_QUESTIONS.length} ({Math.round((score / QUIZ_QUESTIONS.length) * 100)}%)
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {score >= 4
                      ? "Excellent performance! Ready for technical assessment rounds."
                      : "Good effort! Review the detailed answers below."}
                  </p>
                </div>
              </div>

              <button
                onClick={handleResetQuiz}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retake Quiz
              </button>
            </div>
          )}

          {/* Quiz Questions List */}
          <div className="space-y-4">
            {filteredQuestions.map((q, qIndex) => {
              const selectedOpt = selectedAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3"
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 font-mono">
                        {qIndex + 1}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {q.question}
                      </h4>
                    </div>

                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                      {q.category}
                    </span>
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      const isOptionCorrect = q.correctAnswer === optIdx;

                      let buttonStyle = "border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-800";

                      if (isSubmitted) {
                        if (isOptionCorrect) {
                          buttonStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                        } else if (isOptionSelected && !isOptionCorrect) {
                          buttonStyle = "border-rose-300 bg-rose-50 text-rose-900 font-bold";
                        }
                      } else if (isOptionSelected) {
                        buttonStyle = "border-blue-700 bg-blue-50 text-blue-900 font-bold";
                      }

                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => handleSelectAnswer(q.id, optIdx)}
                          className={cn(
                            "flex items-center gap-2.5 p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer disabled:cursor-default",
                            buttonStyle
                          )}
                        >
                          <span
                            className={cn(
                              "w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 border font-mono",
                              isOptionSelected
                                ? "bg-blue-700 text-white border-blue-700"
                                : "bg-white text-slate-600 border-slate-200"
                            )}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {isSubmitted && (
                    <div
                      className={cn(
                        "p-3 rounded-lg border text-xs leading-relaxed mt-2",
                        isCorrect
                          ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      )}
                    >
                      <div className="flex items-center gap-1.5 font-bold mb-0.5">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-800">Correct!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span className="text-rose-700">
                              Incorrect. Correct Option: {String.fromCharCode(65 + q.correctAnswer)}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-slate-600">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Quiz Action Button */}
          {!isSubmitted && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length === 0}
                className={cn(
                  "inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer",
                  Object.keys(selectedAnswers).length > 0
                    ? "bg-blue-700 hover:bg-blue-800 shadow-2xs"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                )}
              >
                <span>Submit Placement Quiz</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </main>

      <StudentFooter user={user} />
    </div>
  );
}
