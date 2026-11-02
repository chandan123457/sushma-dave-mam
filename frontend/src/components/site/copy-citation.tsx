"use client";

import { useState } from "react";

export function CopyCitation({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="flex items-center justify-between rounded-full border border-line-strong px-5 py-3 text-left text-[0.85rem] transition-colors hover:border-ink"
    >
      {copied ? "Citation copied" : "Copy citation"}
      <span className="font-mono text-[0.7rem] text-muted">{copied ? "✓" : "⌘C"}</span>
    </button>
  );
}
