"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { maskSecret } from "@/lib/format";

export default function SecretCell({ secret }: { secret: string }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="flex items-center gap-2">
      <code className="max-w-[180px] truncate font-mono text-[12.5px] text-gray-600 sm:max-w-[260px]">
        {revealed ? secret : maskSecret(secret)}
      </code>
      <button
        onClick={() => setRevealed((v) => !v)}
        className="tap flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        aria-label={revealed ? "Hide secret" : "Reveal secret"}
      >
        {revealed ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
      <button
        onClick={copy}
        className="tap flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        aria-label="Copy secret"
      >
        {copied ? (
          <Check size={15} className="text-emerald-500" />
        ) : (
          <Copy size={15} />
        )}
      </button>
    </div>
  );
}
