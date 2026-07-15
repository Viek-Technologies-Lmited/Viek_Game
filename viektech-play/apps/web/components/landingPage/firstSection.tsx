import React from "react";
import Button from "../button";
import Link from "next/link";
import Image from "next/image";

const FirstSection = () => {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col items-center gap-12 px-6 py-16 lg:flex-row lg:px-8">
      {/* Left Content */}
      <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
        <span className="rounded-full bg-indigo-200 px-5 py-2 text-sm font-semibold tracking-wide text-indigo-800">
          🚀 SEASON 1 NOW LIVE
        </span>

        <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-800 sm:text-5xl lg:text-6xl">
          Compete. <span className="text-blue-800">Solve.</span> Rise to the
          top.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
          The ultimate high-stakes programming arena. Test your algorithmic
          speed, solve complex puzzles under pressure, and secure your place
          among the world&apos;s top developers.
        </p>

        <div className="mt-10 flex items-center gap-4 sm:flex-row">
          <Link href="/play">
            <Button
              type="button"
              className="rounded-full bg-blue-800 px-8 py-3 text-white transition hover:bg-blue-900"
            >
              Play Now
            </Button>
          </Link>

          <Link href="/leaderboard">
            <Button
              type="button"
              className="rounded-full border border-blue-800 bg-transparent px-8 py-3 text-blue-800 transition hover:bg-blue-800 hover:text-white"
            >
              Leaderboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Right Image */}
      <div className="flex flex-1 justify-center">
        <Image
          src="/img1.png"
          alt="Programming Competition"
          width={650}
          height={650}
          priority
          className="h-auto w-full max-w-md lg:max-w-xl rounded-2xl"
        />
      </div>
    </section>
  );
};

export default FirstSection;
