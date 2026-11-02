"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import clsx from "clsx";
import { api } from "@/lib/admin-api";
import type { Media } from "@/lib/types";

/* ── Buttons ─────────────────────────────────────────────────────────── */

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  loading?: boolean;
};

export function Button({ variant = "primary", size = "md", loading, className, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background-color,border-color,color,transform] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        size === "sm" ? "h-8 px-3.5 text-[0.78rem]" : "h-10 px-5 text-[0.85rem]",
        variant === "primary" && "bg-ink text-paper hover:bg-ink-2",
        variant === "secondary" && "border border-line-strong bg-white/60 text-ink hover:border-ink",
        variant === "ghost" && "text-ink-2 hover:bg-ink/5 hover:text-ink",
        variant === "danger" && "border border-[#c4553a]/30 text-[#a8432b] hover:bg-[#a8432b] hover:text-white",
        className,
      )}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={clsx("h-3.5 w-3.5 animate-spin", className)} viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
      <path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Form fields ─────────────────────────────────────────────────────── */

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={clsx("block", className)}>
      <span className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[0.78rem] font-medium text-ink-2">{label}</span>
        {hint && <span className="text-[0.72rem] text-faint">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-line-strong/70 bg-white/70 px-3.5 py-2.5 text-[0.9rem] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-faint focus:border-ink focus:bg-white focus:shadow-[0_0_0_3px_rgb(21_23_28/0.06)]";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={clsx(inputCls, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={clsx(inputCls, "min-h-24 resize-y leading-relaxed", props.className)} />;
}

export function Select({ options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }) {
  return (
    <div className="relative">
      <select {...props} className={clsx(inputCls, "appearance-none pr-9", props.className)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted" width="10" height="10" viewBox="0 0 10 10" aria-hidden>
        <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" fill="none" strokeWidth="1.3" />
      </svg>
    </div>
  );
}

export function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-start justify-between gap-4 rounded-lg border border-line-strong/70 bg-white/50 px-4 py-3 text-left transition-colors hover:border-ink/50"
    >
      <span>
        <span className="block text-[0.85rem] font-medium">{label}</span>
        {description && <span className="mt-0.5 block text-[0.75rem] text-muted">{description}</span>}
      </span>
      <span className={clsx("relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors", checked ? "bg-accent" : "bg-ink/15")}>
        <span className={clsx("absolute left-0 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ease-out-expo", checked ? "translate-x-[18px]" : "translate-x-0.5")} />
      </span>
    </button>
  );
}

export function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const parts = draft.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) onChange([...value, ...parts.filter((p) => !value.includes(p))]);
    setDraft("");
  };
  return (
    <div className={clsx(inputCls, "flex min-h-[46px] flex-wrap items-center gap-1.5 !py-2")}>
      {value.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-ink/[0.06] py-1 pl-2.5 pr-1 text-[0.78rem]">
          {tag}
          <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} className="flex h-4 w-4 items-center justify-center rounded-full text-muted hover:bg-ink hover:text-paper" aria-label={`Remove ${tag}`}>
            ×
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={add}
        placeholder={value.length ? "" : placeholder ?? "Type and press Enter"}
        className="min-w-[120px] flex-1 bg-transparent py-0.5 outline-none placeholder:text-faint"
      />
    </div>
  );
}

/** Upload a file (or paste a link) and get back a URL. */
export function FileField({
  value,
  onChange,
  accept,
  kind = "file",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  accept?: string;
  kind?: "image" | "file";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const toast = useToast();

  async function upload(file: File) {
    setBusy(true);
    try {
      const media = await api.upload<Media>(file);
      onChange(media.url);
      toast(`Uploaded ${file.name}`);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Upload failed", "error");
    } finally {
      setBusy(false);
    }
  }

  const isImage = kind === "image" || (value && /\.(png|jpe?g|webp|avif|gif)$/i.test(value));

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) upload(file);
      }}
      className={clsx(
        "rounded-lg border border-dashed p-3 transition-colors",
        dragging ? "border-accent bg-accent-soft/50" : "border-line-strong/80 bg-white/40",
      )}
    >
      <div className="flex items-center gap-3">
        {value && isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-14 w-14 shrink-0 rounded-md object-cover ring-1 ring-line" />
        ) : (
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-ink/[0.04] font-mono text-[0.65rem] uppercase text-muted ring-1 ring-line">
            {value ? value.split(".").pop()?.slice(0, 4) : kind === "image" ? "img" : "file"}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <input
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder="Drop a file, browse, or paste a link"
            className="w-full truncate bg-transparent text-[0.82rem] outline-none placeholder:text-faint"
          />
          <div className="mt-1.5 flex gap-3 text-[0.75rem]">
            <button type="button" onClick={() => inputRef.current?.click()} className="font-medium text-accent hover:underline" disabled={busy}>
              {busy ? "Uploading…" : value ? "Replace" : "Browse"}
            </button>
            {value && (
              <>
                <a href={value} target="_blank" rel="noreferrer" className="text-muted hover:text-ink">
                  Open
                </a>
                <button type="button" onClick={() => onChange(null)} className="text-muted hover:text-[#a8432b]">
                  Remove
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept ?? (kind === "image" ? "image/*" : ".pdf,.doc,.docx,image/*")}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ── Misc ───────────────────────────────────────────────────────────── */

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "accent" | "copper" | "muted"; children: React.ReactNode }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.7rem] font-medium",
        tone === "neutral" && "bg-ink/[0.06] text-ink-2",
        tone === "accent" && "bg-accent-soft text-accent",
        tone === "copper" && "bg-[#f3dccf] text-copper",
        tone === "muted" && "bg-transparent text-faint ring-1 ring-line",
      )}
    >
      {children}
    </span>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-serif text-[2.6rem] leading-none tracking-tight">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-[0.9rem] text-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </header>
  );
}

/* ── Toasts ─────────────────────────────────────────────────────────── */

type Toast = { id: number; text: string; tone: "ok" | "error" };
const ToastContext = createContext<(text: string, tone?: Toast["tone"]) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string, tone: Toast["tone"] = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={clsx(
              "pointer-events-auto flex items-center gap-2.5 rounded-full py-2.5 pl-3.5 pr-5 text-[0.82rem] shadow-[0_8px_30px_rgb(0_0_0/0.18)] [animation:toast-in_.5s_cubic-bezier(.16,1,.3,1)]",
              t.tone === "ok" ? "bg-ink text-paper" : "bg-[#a8432b] text-white",
            )}
          >
            <span className={clsx("h-1.5 w-1.5 rounded-full", t.tone === "ok" ? "bg-[#7fc3a8]" : "bg-white")} />
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
