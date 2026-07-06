"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "./lib/auth-context";

/* ═══════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════ */
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
const IconControllerIcon = () => (
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

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */
const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Games", href: "#games" },
  { label: "Tournaments", href: "#tournaments" },
  { label: "Leaderboard", href: "#leaderboard" },
  { label: "Community", href: "#community" },
  { label: "About", href: "#about" },
];

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
    title: "Multiplayer",
    desc: "Team up or battle players worldwide in real-time matches.",
    cta: "Play Now",
    href: "/games",
    icon: <IconControllerIcon />,
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
    desc: "Join a growing community of gamers and creators. Connect and grow.",
    cta: "Join Discord",
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

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <main id="top" className="relative min-h-screen bg-white text-[#0a1e3f]">
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 border-b border-[#dbe6f2] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="ViekPlay"
                fill
                className="object-contain"
              />
            </div>
            <div className="leading-none">
              <h1
                className="text-xl font-bold tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                ViekPlay
              </h1>
              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#0091ff]">
                Viek Technologies
              </p>
            </div>
          </Link>

          <nav className="hidden gap-8 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#5b6b81] lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-[#0091ff]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            {!isAuthenticated && (
              <Link
                href="/login"
                className="hidden text-[12px] font-semibold uppercase tracking-[0.1em] text-[#5b6b81] hover:text-[#0a1e3f] sm:block"
              >
                Login
              </Link>
            )}
            <Link
              href={isAuthenticated ? "/games" : "/register"}
              className="btn-primary rounded-full px-6 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em]"
            >
              {isAuthenticated ? "Play Now" : "Get Started"}
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        {/* faint grid backdrop, top right */}
        <div className="grid-backdrop pointer-events-none absolute right-0 top-0 h-[600px] w-[600px]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-16 lg:grid-cols-2 lg:px-10 lg:pt-24">
          {/* Left column — copy */}
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#dbe6f2] bg-[#eaf5ff] px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0091ff]" />
              <span className="num-tag">The Future of Quiz Gaming</span>
            </div>

            <h1
              className="hero-title font-extrabold leading-[0.95] tracking-tight"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(3rem, 6.5vw, 5.5rem)",
              }}
            >
              Play.
              <br />
              Compete.
              <br />
              <span className="text-[#0091ff]">Win.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#5b6b81]">
              Battle thousands of players across the globe, climb the rankings,
              unlock achievements, join tournaments, and become the ultimate
              champion inside the ViekPlay universe.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href={isAuthenticated ? "/games" : "/register"}
                className="btn-primary inline-flex items-center gap-2 rounded-full px-8 py-4 text-[13px] font-bold uppercase tracking-[0.1em]"
              >
                <IconPlay />
                Play Now
              </Link>
              <a
                href="#leaderboard"
                className="btn-outline inline-flex items-center gap-2 rounded-full px-8 py-4 text-[13px] font-bold uppercase tracking-[0.1em]"
              >
                Leaderboard
                <IconArrow />
              </a>
            </div>

            {/* inline stat strip */}
            <div className="mt-14 flex flex-wrap gap-10 border-t border-[#dbe6f2] pt-8">
              <div>
                <h3
                  className="text-3xl font-extrabold"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  25K+
                </h3>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5b6b81]">
                  Active Players
                </p>
              </div>
              <div>
                <h3
                  className="text-3xl font-extrabold"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  120+
                </h3>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5b6b81]">
                  Daily Matches
                </p>
              </div>
              <div>
                <h3
                  className="text-3xl font-extrabold"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  500K+
                </h3>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5b6b81]">
                  Questions
                </p>
              </div>
            </div>
          </div>

          {/* Right column — robot in a bordered frame, ticket-style tag */}
          <div className="relative flex items-center justify-center">
            <div className="absolute h-[420px] w-[420px] rounded-full bg-[#eaf5ff]" />
            <div className="absolute h-[340px] w-[340px] rounded-full border border-[#dbe6f2]" />

            <div className="relative">
              <Image
                src="/robot.png"
                alt="ViekPlay Champion"
                width={480}
                height={480}
                priority
                className="animate-float relative z-10 object-contain"
                style={{ width: "auto", height: "480px" }}
              />
              <Image
                src="/controller.png"
                alt="Controller"
                width={140}
                height={140}
                className="animate-controller absolute -left-6 bottom-6 z-20"
                style={{ width: "auto", height: "140px" }}
              />

              {/* floating ticket tag */}
              <div className="ticket absolute -right-8 top-4 z-20 hidden -rotate-3 px-5 py-3 shadow-lg sm:block">
                <p className="num-tag">Rank #1</p>
                <p className="text-sm font-bold">Season Champion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURE CARDS — ticket motif ================= */}
      <section className="border-t border-[#dbe6f2] bg-[#f5f8fc] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-14 flex items-end justify-between">
            <div>
              <p className="num-tag mb-3">What You Get</p>
              <h2
                className="text-4xl font-extrabold"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Everything you need to compete.
              </h2>
            </div>
          </div>

          <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.id}
                id={f.id}
                className="ticket lift scroll-mt-28 p-7"
              >
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf5ff] text-[#0091ff]">
                    {f.icon}
                  </div>
                  <span className="num-tag opacity-60">{f.no}</span>
                </div>
                <h3
                  className="text-lg font-bold"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5b6b81]">
                  {f.desc}
                </p>
                <div className="dashed-divider my-5" />
                <Link
                  href={f.href}
                  className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-[#0091ff]"
                >
                  {f.cta}
                  <IconArrow />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STATS + FEATURED GAME ================= */}
      <section className="border-t border-[#dbe6f2] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            {/* Stats block */}
            <div className="rounded-2xl border border-[#dbe6f2] bg-[#0a1e3f] p-10">
              <p className="num-tag mb-8 text-[#0091ff]">By The Numbers</p>
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <h3
                      className="text-4xl font-extrabold text-white"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {s.value}
                    </h3>
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7d93b2]">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Game — ticket panel */}
            <div className="ticket ticket-notch-top flex flex-col justify-between p-7">
              <div>
                <p className="num-tag">Featured Game</p>
                <h3
                  className="mt-3 text-2xl font-extrabold"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Shadow Frontier
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5b6b81]">
                  Enter a futuristic battleground where only the strongest
                  survive.
                </p>
              </div>
              <div className="dashed-divider my-5" />
              <Link
                href="/games"
                className="btn-primary inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-[12px] font-bold uppercase tracking-[0.1em]"
              >
                <IconPlay />
                Play Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PARTNER STRIP ================= */}
      <section className="border-t border-[#dbe6f2] bg-[#f5f8fc] py-14">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-10">
          <p className="mb-8 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5b6b81]">
            Trusted by gamers. Powered by technology.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-16">
            {["ViekTech", "Unreal Engine", "AMD", "NVIDIA", "Discord"].map(
              (name) => (
                <span
                  key={name}
                  className="text-sm font-bold uppercase tracking-[0.14em] text-[#a8b7c9] transition-colors hover:text-[#0091ff]"
                >
                  {name}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ================= COMMUNITY ================= */}
      <section
        id="community-full"
        className="scroll-mt-28 border-t border-[#dbe6f2] py-28"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <p className="num-tag mb-4">Community</p>
              <h2
                className="text-4xl font-extrabold leading-tight sm:text-5xl"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Join the fastest growing quiz gaming platform.
              </h2>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#5b6b81]">
                Connect with friends, challenge players across the world, create
                tournaments, join organizations, and build your competitive
                reputation inside ViekPlay.
              </p>
              <div className="mt-10 flex flex-wrap gap-6">
                <div className="ticket px-7 py-5">
                  <h3
                    className="text-3xl font-extrabold"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    150+
                  </h3>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5b6b81]">
                    Countries
                  </p>
                </div>
                <div className="ticket px-7 py-5">
                  <h3
                    className="text-3xl font-extrabold"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    24/7
                  </h3>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5b6b81]">
                    Live Matches
                  </p>
                </div>
              </div>
              <Link
                href="/community"
                className="btn-primary mt-10 inline-flex items-center gap-2 rounded-full px-8 py-4 text-[12px] font-bold uppercase tracking-[0.1em]"
              >
                Join Community
                <IconArrow />
              </Link>
            </div>

            <div className="relative flex justify-center">
              <div className="absolute h-[380px] w-[380px] rounded-full bg-[#eaf5ff]" />
              <Image
                src="/robot.png"
                alt="Community"
                width={380}
                height={380}
                className="animate-float relative z-10 object-contain"
                style={{ width: "auto", height: "380px" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section
        id="about"
        className="scroll-mt-28 border-t border-[#dbe6f2] bg-[#f5f8fc] py-28"
      >
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <p className="num-tag mb-4">About ViekPlay</p>
          <h2
            className="text-4xl font-extrabold leading-tight sm:text-5xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Built by ViekTech, for players who love a challenge.
          </h2>
          <p className="mt-7 text-lg leading-relaxed text-[#5b6b81]">
            ViekPlay is Viek Technologies&apos; quiz gaming platform — built to
            make learning and competition fun for everyone, from our own team to
            players around the world. Whether you&apos;re here to sharpen your
            skills or chase the top of the leaderboard, ViekPlay is built for
            fair, fast, and rewarding play.
          </p>
          <Link
            href="/about"
            className="btn-outline mt-9 inline-flex items-center gap-2 rounded-full px-8 py-4 text-[12px] font-bold uppercase tracking-[0.1em]"
          >
            Learn More About Us
            <IconArrow />
          </Link>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="border-t border-[#dbe6f2] py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="rounded-3xl bg-[#0a1e3f] px-10 py-20 text-center">
            <p className="num-tag mb-4">Ready?</p>
            <h2
              className="text-5xl font-extrabold leading-tight text-white sm:text-6xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              The next match
              <br />
              starts now.
            </h2>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-[#a8b7c9]">
              Create your account and experience the future of quiz gaming built
              for competitive players.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-5">
              <Link
                href={isAuthenticated ? "/games" : "/register"}
                className="inline-flex items-center gap-2 rounded-full bg-[#0091ff] px-10 py-4 text-[13px] font-bold uppercase tracking-[0.1em] text-white transition hover:scale-105"
              >
                <IconPlay />
                Play Now
              </Link>
              <a
                href="#leaderboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-10 py-4 text-[13px] font-bold uppercase tracking-[0.1em] text-white transition hover:bg-white/10"
              >
                Leaderboard
                <IconArrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#dbe6f2] py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row lg:px-10">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="ViekPlay"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h3
                className="text-sm font-bold"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                ViekPlay
              </h3>
              <p className="text-xs text-[#5b6b81]">
                Powered by Viek Technologies
              </p>
            </div>
          </div>
          <p className="text-xs text-[#5b6b81]">
            © 2026 ViekPlay. All Rights Reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
