import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jayanth Pallapu | Applied AI Engineer & Data Science Manager",
  description:
    "Portfolio of Jayanth Pallapu — Applied AI Engineer specializing in architecting end-to-end AI solutions, multi-agent systems, analytics pipelines, and predictive models.",
  keywords: [
    "Jayanth Pallapu",
    "Applied AI Engineer",
    "Data Science Manager",
    "Multi-agent AI",
    "Machine Learning",
    "Python",
    "CrewAI",
    "LangChain",
    "LangGraph",
    "Portfolio",
  ],
  authors: [{ name: "Jayanth Pallapu" }],
  openGraph: {
    title: "Jayanth Pallapu | Applied AI Engineer & Data Science Manager",
    description:
      "Applied AI Engineer specializing in architecting end-to-end AI solutions, multi-agent systems, and predictive models.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jayanth Pallapu | Applied AI Engineer & Data Science Manager",
    description:
      "Applied AI Engineer specializing in architecting end-to-end AI solutions, multi-agent systems, and predictive models.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
