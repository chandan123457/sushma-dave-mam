import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, Inter_Tight, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const body = Inter_Tight({
  variable: "--font-body",
  subsets: ["latin"],
});

const code = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Public site typography
const heading = Manrope({
  variable: "--font-site-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const text = Inter({
  variable: "--font-site-text",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dr. Sushma Dave — Electrochemistry, Biosensors & Nanomaterials",
    template: "%s — Dr. Sushma Dave",
  },
  description:
    "Research portfolio of Dr. Sushma Dave, Professor of Chemistry at JIET Jodhpur — electrochemistry, biosensors, infectious diseases, nanomaterials and photocatalytic degradation of dyes.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable} ${code.variable} ${heading.variable} ${text.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
