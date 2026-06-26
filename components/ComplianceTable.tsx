"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, FileText, ShieldCheck } from "lucide-react";
import type { ComplianceDocument } from "@/lib/types";
import { formatFileSize, shortChecksum, formatDate } from "@/lib/format";
import { EmptyState } from "@/components/ui";

export default function ComplianceTable({
  documents,
}: {
  documents: ComplianceDocument[];
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return documents;
    return documents.filter((d) =>
      [d.fileName, d.projectName, d.classification, d.uploadedBy, d.sha256]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(term))
    );
  }, [q, documents]);

  return (
    <>
      <div className="relative mb-5 max-w-md">
        <Search
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by file, project, classification…"
          className="vault-input !pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck size={26} />}
          title={q ? "No matches" : "No documents yet"}
          description={
            q
              ? "Try a different search term."
              : "Documents uploaded inside projects appear here."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-ios bg-white shadow-ios">
          <div className="hidden grid-cols-12 gap-4 border-b border-gray-100 px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-gray-400 md:grid">
            <span className="col-span-4">Document</span>
            <span className="col-span-3">Checksum (SHA-256)</span>
            <span className="col-span-2">Project</span>
            <span className="col-span-1">Size</span>
            <span className="col-span-2">Classification</span>
          </div>
          <div className="divide-y divide-gray-100">
            {filtered.map((d) => (
              <div
                key={d.id}
                className="grid grid-cols-1 gap-x-4 gap-y-2 px-5 py-4 md:grid-cols-12 md:items-center"
              >
                <div className="flex items-center gap-3 md:col-span-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                    <FileText size={17} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-medium text-gray-900">
                      {d.fileName}
                    </p>
                    <p className="text-[12px] text-gray-400">
                      {formatDate(d.uploadedAt)}
                    </p>
                  </div>
                </div>
                <div className="md:col-span-3">
                  <code className="font-mono text-[12.5px] text-gray-500">
                    {shortChecksum(d.sha256) || "—"}
                  </code>
                </div>
                <div className="md:col-span-2">
                  {d.projectName ? (
                    <Link
                      href={`/projects/${d.projectId}`}
                      className="text-[13.5px] text-gray-600 hover:text-gray-900 hover:underline"
                    >
                      {d.projectName}
                    </Link>
                  ) : (
                    <span className="text-[13.5px] text-gray-400">—</span>
                  )}
                </div>
                <div className="text-[13px] text-gray-600 md:col-span-1">
                  {formatFileSize(d.fileSizeBytes)}
                </div>
                <div className="md:col-span-2">
                  {d.classification ? (
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[12px] font-medium text-gray-600">
                      {d.classification}
                    </span>
                  ) : (
                    <span className="text-[13px] text-gray-400">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
