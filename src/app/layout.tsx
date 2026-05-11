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
  title: "Jayanth Pallapu | Full Stack Developer & Software Engineer",
  description:
    "Portfolio of Jayanth Pallapu — a passionate Full Stack Developer with expertise in building scalable web applications and creating seamless user experiences.",
  keywords: [
    "Jayanth Pallapu",
    "Full Stack Developer",
    "Software Engineer",
    "React",
    "Next.js",
    "TypeScript",
    "Portfolio",
  ],
  authors: [{ name: "Jayanth Pallapu" }],
  openGraph: {
    title: "Jayanth Pallapu | Full Stack Developer",
    description:
      "Passionate Full Stack Developer building scalable web applications and seamless user experiences.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jayanth Pallapu | Full Stack Developer",
    description:
      "Passionate Full Stack Developer building scalable web applications and seamless user experiences.",
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
