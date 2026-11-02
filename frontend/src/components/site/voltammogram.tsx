"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * A stylised cyclic voltammogram — the "duck" curve every electrochemist knows.
 * Drawn as the hero's quiet signature instead of stock science imagery.
 */
const FORWARD =
  "M20 250 C 90 248, 150 246, 200 238 C 245 230, 270 205, 292 160 C 308 128, 318 98, 336 92 C 356 86, 372 118, 392 150 C 420 192, 470 206, 560 210";
const REVERSE =
  "M560 210 C 600 212, 610 214, 600 222 C 560 236, 500 238, 452 250 C 420 258, 400 290, 380 322 C 364 346, 350 352, 334 344 C 312 332, 296 300, 270 284 C 220 262, 120 258, 20 250";

const GRID = Array.from({ length: 9 }, (_, i) => i);

export function Voltammogram({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const draw = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0 },
          animate: { pathLength: 1 },
          transition: { duration: 2.4, delay, ease: [0.65, 0, 0.35, 1] as const },
        };

  return (
    <svg viewBox="0 0 600 400" fill="none" className={className} aria-hidden>
      {GRID.map((i) => (
        <line key={`v${i}`} x1={20 + i * 67.5} y1="40" x2={20 + i * 67.5} y2="380" stroke="currentColor" strokeOpacity="0.07" />
      ))}
      {GRID.slice(0, 6).map((i) => (
        <line key={`h${i}`} x1="20" y1={40 + i * 68} x2="580" y2={40 + i * 68} stroke="currentColor" strokeOpacity="0.07" />
      ))}
      <line x1="20" y1="250" x2="580" y2="250" stroke="currentColor" strokeOpacity="0.18" strokeDasharray="2 4" />

      <motion.path d={FORWARD} stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" {...draw(0.4)} />
      <motion.path d={REVERSE} stroke="var(--copper)" strokeWidth="1.6" strokeLinecap="round" {...draw(2.2)} />

      <motion.g initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6, duration: 1 }}>
        <circle cx="336" cy="92" r="3.5" fill="var(--accent)" />
        <text x="346" y="80" className="fill-current" fontSize="11" fontFamily="var(--font-mono)" opacity="0.6">
          E<tspan baselineShift="sub" fontSize="8">pa</tspan>
        </text>
        <circle cx="342" cy="348" r="3.5" fill="var(--copper)" />
        <text x="352" y="370" className="fill-current" fontSize="11" fontFamily="var(--font-mono)" opacity="0.6">
          E<tspan baselineShift="sub" fontSize="8">pc</tspan>
        </text>
      </motion.g>

      <text x="580" y="396" textAnchor="end" className="fill-current" fontSize="10" fontFamily="var(--font-mono)" opacity="0.45" letterSpacing="1.4">
        E / V vs Ag|AgCl
      </text>
      <text x="14" y="34" className="fill-current" fontSize="10" fontFamily="var(--font-mono)" opacity="0.45" letterSpacing="1.4">
        i / µA
      </text>
    </svg>
  );
}
