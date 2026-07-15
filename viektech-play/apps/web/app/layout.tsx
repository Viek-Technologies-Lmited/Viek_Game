import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./lib/auth-context";
import Navbar from "./components/navbar";

export const metadata: Metadata = {
  title: "ViekPlay — Play. Compete. Win.",
  description:
    "ViekPlay is Viek Technologies' competitive quiz gaming platform. Battle players worldwide, climb the rankings, join tournaments, and become a champion.",
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
      <body>{children}</body>
    </html>
  );
}
