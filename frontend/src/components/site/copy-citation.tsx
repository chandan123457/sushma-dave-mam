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
      className="flex h-12 items-center justify-center gap-2 rounded-xl border border-hairline-strong bg-white text-[0.92rem] font-semibold text-fg transition-colors hover:border-fg-faint hover:bg-subtle"
    >
      {copied ? "Citation copied" : "Copy citation"}
    </button>
  );
}
