"use client";

import React, { useEffect, useRef, useState } from "react";
import { FolderOpen, ScanLine, UploadCloud, Table2, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Panel,
  PanelEmpty,
  PanelError,
  SectionHeading,
} from "@/components/dashboard/Panel";
import { api, getToken, API_URL, OcrResult, DocumentItem } from "@/lib/api";
import { cn } from "@/lib/utils";

export function DocumentsSection() {
  const [result, setResult] = useState<OcrResult | null>(null);
  const [history, setHistory] = useState<DocumentItem[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const loadHistory = async () => {
    try {
      const data = await api<{ documents: DocumentItem[] }>("/documents");
      setHistory(data.documents);
    } catch {
      setHistory([]);
    }
  };

  useEffect(() => {
    (async () => {
      await loadHistory();
    })();
  }, []);

  const upload = async (file: File) => {
    setBusy(true);
    setError("");
    setResult(null);
    setFileName(file.name);

    const form = new FormData();
    form.append("file", file);

    try {
      // FormData sets its own multipart boundary, so this call skips the
      // JSON content-type the shared client would otherwise add.
      const response = await fetch(`${API_URL}/documents/ocr`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: form,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not read that image.");
      setResult(data as OcrResult);
      await loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read that image.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <SectionHeading
        title="Document Reader"
        description="Photograph a marksheet or attendance register and get the numbers typed out for you."
      />

      <Panel title="Read a scanned sheet" icon={ScanLine} iconClass="text-blue-500">
        <div className="p-4">
          <button
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className={cn(
              "w-full flex flex-col items-center justify-center gap-3 py-10 rounded-xl border-2 border-dashed transition-colors",
              busy
                ? "border-slate-200 bg-slate-50 cursor-wait"
                : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/40 cursor-pointer"
            )}
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <UploadCloud className={cn("w-6 h-6 text-blue-500", busy && "animate-pulse")} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">
                {busy ? `Reading ${fileName}…` : "Choose an image to read"}
              </p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG, BMP, WEBP or TIFF · up to 10 MB</p>
            </div>
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
              e.target.value = "";
            }}
          />
        </div>

        {error && <PanelError message={error} />}
      </Panel>

      {result && (
        <>
          <Panel
            title="Extracted table"
            icon={Table2}
            iconClass="text-emerald-500"
            action={<Badge variant="success">{result.document.confidence}% confidence</Badge>}
          >
            {result.structured.rows.length === 0 ? (
              <PanelEmpty
                icon={Table2}
                title="No subject–marks pairs found"
                hint="The raw text is below — you can still copy from it."
              />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="text-left px-4 py-2">Subject</th>
                    <th className="text-right px-4 py-2">Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.structured.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2.5 text-slate-700">{row.label}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-slate-800">
                        {row.value}
                        {row.outOf ? ` / ${row.outOf}` : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <p className="px-4 py-3 text-[11px] text-slate-400 border-t border-slate-100">
              Always check these against the original before saving — OCR gets handwriting wrong
              sometimes.
            </p>
          </Panel>

          <Panel title="Raw text" icon={FileText} iconClass="text-slate-400">
            <pre className="px-4 py-3 text-xs text-slate-600 whitespace-pre-wrap font-mono">
              {result.text || "(nothing readable)"}
            </pre>
          </Panel>
        </>
      )}

      <Panel
        title="Previously read"
        icon={FolderOpen}
        iconClass="text-amber-500"
        action={history && <Badge variant="secondary">{history.length}</Badge>}
      >
        {!history || history.length === 0 ? (
          <PanelEmpty
            icon={FolderOpen}
            title="Nothing read yet"
            hint="Documents you scan will be listed here."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {history.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm text-slate-700 truncate">{doc.originalName}</p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(doc.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
                <Badge variant={doc.confidence > 80 ? "success" : "warning"}>
                  {doc.confidence}%
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}
