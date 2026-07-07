"use client";

import Link from "next/link";
import { useAuth } from "./lib/auth-context";

const IconTrophy = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="h-7 w-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
    />
  </svg>
);
const IconController = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="h-7 w-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166M4.772 5.79c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg>
);
const IconChart = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="h-7 w-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
    />
  </svg>
);
const IconUsers = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="h-7 w-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
    />
  </svg>
);
const IconArrow = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    className="h-4 w-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
    />
  </svg>
);
const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const FEATURES = [
  {
    id: "tournaments",
    no: "01",
    title: "Tournaments",
    desc: "Compete in high-stakes tournaments worldwide and win amazing prizes.",
    cta: "Join Now",
    href: "/tournaments",
    icon: <IconTrophy />,
  },
  {
    id: "games",
    no: "02",
    title: "Multiplayer Quiz",
    desc: "Battle players worldwide in real-time quiz matches, one question at a time.",
    cta: "Play Now",
    href: "/games",
    icon: <IconController />,
  },
  {
    id: "leaderboard",
    no: "03",
    title: "Leaderboards",
    desc: "Climb the ranks and become the top legend on ViekPlay.",
    cta: "View Rankings",
    href: "/leaderboard",
    icon: <IconChart />,
  },
  {
    id: "community",
    no: "04",
    title: "Community",
    desc: "Join a growing community of quiz players. Connect and compete.",
    cta: "Join Us",
    href: "/community",
    icon: <IconUsers />,
  },
];

const STATS = [
  { value: "250K+", label: "Active Players" },
  { value: "1,250+", label: "Games Played" },
  { value: "530+", label: "Tournaments" },
  { value: "120K+", label: "Top Ranked Players" },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="relative min-h-screen bg-[#0b1120] text-slate-100">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="grid-backdrop pointer-events-none absolute right-0 top-0 h-[600px] w-[600px]" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-20 text-center lg:pt-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-blue-300">
              The Future of Quiz Gaming
            </span>
          </div>

          <h1
            className="hero-title font-extrabold leading-[0.95] tracking-tight"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(2.75rem, 6vw, 5rem)",
            }}
          >
            Play. Compete.{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Win.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
            Battle players across the globe in live quiz matches, climb the
            rankings, and become the ultimate champion inside the ViekPlay
            universe.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href={isAuthenticated ? "/games" : "/register"}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-sm font-bold uppercase tracking-[0.1em] text-white transition-transform hover:scale-105"
            >
              <IconPlay />
              Play Now
            </Link>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-8 py-4 text-sm font-bold uppercase tracking-[0.1em] text-slate-200 transition-colors hover:border-blue-400 hover:text-blue-300"
            >
              Leaderboard
              <IconArrow />
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-10 border-t border-slate-800 pt-8">
            {[
              { value: "25K+", label: "Active Players" },
              { value: "120+", label: "Daily Matches" },
              { value: "500K+", label: "Questions" },
            ].map((s) => (
              <div key={s.label}>
                <h3
                  className="text-3xl font-extrabold"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {s.value}
                </h3>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURE CARDS ================= */}
      <section className="border-t border-slate-800 bg-[#0f172a] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-14">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-blue-400">
              What You Get
            </p>
            <h2
              className="text-4xl font-extrabold"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Everything you need to compete.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.id}
                id={f.id}
                className="panel panel-hover scroll-mt-28 p-7"
              >
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    {f.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-600">
                    {f.no}
                  </span>
                </div>
                <h3
                  className="text-lg font-bold"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {f.desc}
                </p>
                <div className="my-5 border-t border-slate-800" />
                <Link
                  href={f.href}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-blue-400 hover:text-blue-300"
                >
                  {f.cta}
                  <IconArrow />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STATS BAND ================= */}
      <section className="border-t border-slate-800 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="panel p-10">
            <p className="mb-8 text-xs font-bold uppercase tracking-[0.14em] text-blue-400">
              By The Numbers
            </p>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <h3
                    className="text-4xl font-extrabold"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {s.value}
                  </h3>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="border-t border-slate-800 py-24">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-blue-400">
            Ready?
          </p>
          <h2
            className="text-4xl font-extrabold leading-tight sm:text-5xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            The next match starts now.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
            Create your account and experience the future of quiz gaming built
            for competitive players.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href={isAuthenticated ? "/games" : "/register"}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-10 py-4 text-sm font-bold uppercase tracking-[0.1em] text-white transition-transform hover:scale-105"
            >
              <IconPlay />
              Play Now
            </Link>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-10 py-4 text-sm font-bold uppercase tracking-[0.1em] text-slate-200 hover:border-blue-400 hover:text-blue-300"
            >
              Leaderboard
              <IconArrow />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-800 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-center md:flex-row md:text-left lg:px-10">
          <div>
            <h3
              className="text-sm font-bold"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              ViekPlay
            </h3>
            <p className="text-xs text-slate-500">
              Powered by Viek Technologies
            </p>
          </div>
          <p className="text-xs text-slate-500">
            © 2026 ViekPlay. All Rights Reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
