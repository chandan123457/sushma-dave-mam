/** Line icons for research themes, chosen by keywords in the area title. */
const PATHS: Record<string, React.ReactNode> = {
  // electrode dipped in solution with a signal trace
  sensor: (
    <>
      <path d="M9 3v8M15 3v8" />
      <path d="M5 11h14v3a7 7 0 0 1-14 0v-3Z" />
      <path d="M8 16.5h2l1-2 2 4 1-2h2" />
    </>
  ),
  // virus particle
  disease: (
    <>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.9 2.9M15.5 15.5l2.9 2.9M5.6 18.4l2.9-2.9M15.5 8.5l2.9-2.9" />
    </>
  ),
  // hexagonal lattice
  nano: (
    <>
      <path d="m12 3 4 2.3v4.6L12 12.2 8 9.9V5.3L12 3Z" />
      <path d="m8 9.9-4 2.3v4.6l4 2.3 4-2.3" />
      <path d="m16 9.9 4 2.3v4.6l-4 2.3-4-2.3v-4.6" />
    </>
  ),
  // light on a flask
  light: (
    <>
      <path d="M10 3h4M11 3v5l-5 9a2 2 0 0 0 1.7 3h8.6a2 2 0 0 0 1.7-3l-5-9V3" />
      <path d="M8 15h8" />
      <path d="M19 4.5l1.5-1.5M20 8h2M3.5 3 5 4.5" />
    </>
  ),
  // water droplet with leaf
  water: (
    <>
      <path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z" />
      <path d="M9.5 15.5c1.5 0 3-1.2 3.5-3" />
    </>
  ),
};

export function researchIcon(title: string) {
  const t = title.toLowerCase();
  if (/disease|drug|infect/.test(t)) return "disease";
  if (/nano/.test(t)) return "nano";
  if (/dye|photo/.test(t)) return "light";
  if (/environment|remediation|water/.test(t)) return "water";
  return "sensor";
}

export function ResearchIcon({ title, className }: { title: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {PATHS[researchIcon(title)]}
    </svg>
  );
}
