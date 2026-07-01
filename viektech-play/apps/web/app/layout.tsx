import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./lib/auth-context";
import Navbar from "./components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ViekPlay - Interactive Quiz Gaming Platform",
  description:
    "Challenge yourself with exciting quizzes, compete on leaderboards, and earn achievements on ViekPlay.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-[#0f172a] text-zinc-900 dark:text-zinc-100">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}