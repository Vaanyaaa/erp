"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FileText,
  Library,
  UploadCloud,
  Download,
  Trash2,
  CalendarClock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Panel,
  PanelEmpty,
  PanelError,
  PrimaryButton,
  SectionHeading,
  inputBase,
} from "@/components/dashboard/Panel";
import { useAuth } from "@/lib/auth";
import { canUploadMaterials, Role } from "@/lib/roles";
import { api, getToken, API_URL, Material } from "@/lib/api";

function fileSize(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Opens the file in a new tab. The endpoint needs a bearer token, so we fetch
 * it as a blob rather than pointing an anchor straight at the URL.
 */
async function openMaterial(material: Material) {
  const response = await fetch(`${API_URL}/materials/${material.id}/file`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!response.ok) throw new Error("That file is no longer available.");
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

interface Props {
  kind: "assignment" | "note";
}

export function MaterialsSection({ kind }: Props) {
  const { user } = useAuth();
  const canUpload = canUploadMaterials(user?.role as Role);

  const [materials, setMaterials] = useState<Material[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAssignment = kind === "assignment";
  const heading = isAssignment ? "Assignments" : "Library";
  const icon = isAssignment ? FileText : Library;

  const load = useCallback(async () => {
    try {
      const data = await api<{ materials: Material[] }>(`/materials?kind=${kind}`);
      setMaterials(data.materials);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the list.");
    }
  }, [kind]);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  const submit = async () => {
    if (!file || !title.trim()) return;
    setBusy(true);
    setError("");

    const form = new FormData();
    form.append("file", file);
    form.append("kind", kind);
    form.append("title", title);
    if (subject) form.append("subject", subject);
    if (description) form.append("description", description);
    if (isAssignment && dueDate) form.append("dueDate", dueDate);

    try {
      const response = await fetch(`${API_URL}/materials`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: form,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Upload failed.");

      setTitle("");
      setSubject("");
      setDescription("");
      setDueDate("");
      setFile(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: number) => {
    try {
      await api(`/materials/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove that file.");
    }
  };

  const open = async (material: Material) => {
    try {
      await openMaterial(material);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open that file.");
    }
  };

  return (
    <>
      <SectionHeading
        title={heading}
        description={
          canUpload
            ? isAssignment
              ? "Upload an assignment once and every student sees it in their portal."
              : "Upload notes once and every student sees them in their portal."
            : isAssignment
            ? "Assignments your faculty have posted."
            : "Notes and reading material your faculty have shared."
        }
      />

      {canUpload && (
        <Panel
          title={isAssignment ? "Post an assignment" : "Share notes"}
          icon={UploadCloud}
          iconClass="text-violet-500"
        >
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isAssignment ? "Assignment 3 — MapReduce design" : "Unit 4 notes"}
                className={inputBase}
              />
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className={inputBase}
              />
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="What should students know about this?"
              className={cn(inputBase, "resize-y")}
            />

            {isAssignment && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Due date (optional)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={inputBase}
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  A due date also puts this on everyone&apos;s calendar.
                </p>
              </div>
            )}

            <button
              onClick={() => inputRef.current?.click()}
              className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/40 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <UploadCloud className="w-5 h-5 text-blue-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-700 truncate">
                  {file ? file.name : "Choose a file"}
                </p>
                <p className="text-xs text-slate-400">PDF, Word or PowerPoint · up to 25 MB</p>
              </div>
            </button>

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                e.target.value = "";
              }}
            />

            <div className="flex justify-end">
              <PrimaryButton onClick={submit} loading={busy} disabled={!file || !title.trim()}>
                {isAssignment ? "Post assignment" : "Share notes"}
              </PrimaryButton>
            </div>
          </div>

          {error && <PanelError message={error} />}
        </Panel>
      )}

      <Panel
        title={isAssignment ? "Posted assignments" : "Shared notes"}
        icon={icon}
        iconClass={isAssignment ? "text-amber-500" : "text-sky-500"}
        action={materials && <Badge variant="secondary">{materials.length}</Badge>}
      >
        {!canUpload && error && <PanelError message={error} />}

        {!materials ? (
          <div className="p-4 space-y-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : materials.length === 0 ? (
          <PanelEmpty
            icon={icon}
            title={isAssignment ? "No assignments posted yet" : "No notes shared yet"}
            hint={
              canUpload
                ? "Anything you upload here appears in every student's portal straight away."
                : "Your faculty haven't uploaded anything yet."
            }
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {materials.map((m) => (
              <div key={m.id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{m.title}</p>
                    {m.description && (
                      <p className="text-xs text-slate-600 mt-1">{m.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                      {m.subject && <span>{m.subject}</span>}
                      <span>{m.uploadedBy?.fullName}</span>
                      <span>{new Date(m.createdAt).toLocaleDateString("en-IN")}</span>
                      {m.sizeBytes ? <span>{fileSize(m.sizeBytes)}</span> : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {m.dueDate && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 text-amber-700 px-2.5 py-0.5 text-xs font-medium">
                        <CalendarClock className="w-3 h-3" />
                        {new Date(`${m.dueDate}T00:00:00`).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    )}

                    <button
                      onClick={() => open(m)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Open
                    </button>

                    {canUpload && m.uploadedBy?.id === user?.id && (
                      <button
                        onClick={() => remove(m.id)}
                        aria-label="Remove file"
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}
