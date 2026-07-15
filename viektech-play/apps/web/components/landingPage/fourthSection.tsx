import Image from "next/image";
import React from "react";
import { topContenders } from "../fakeJson";
import { FaArrowRightLong } from "react-icons/fa6";
import Link from "next/link";

const FourthSection = () => {
  const podium = topContenders.filter((player) => Number(player.number) <= 3);

  const others = topContenders.filter((player) => Number(player.number) > 3);

  return (
    <section className="bg-[url('/techbg1.png')] bg-cover bg-center bg-no-repeat py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-16 lg:flex-row lg:justify-between">
          {/* LEFT */}
          <div className="flex-1">
            {/* Heading */}
            <div className="mb-16">
              <div className="mb-3 flex items-center gap-3">
                <Image src="/ranks.png" alt="Rankings" width={40} height={40} />

                <p className="text-sm font-semibold uppercase tracking-widest text-blue-800">
                  Rankings
                </p>
              </div>

              <h2 className="text-4xl font-bold uppercase text-slate-800 lg:text-6xl pb-6">
                Top Contenders
              </h2>
            </div>

            {/* Podium */}
            <div className="flex flex-col items-center gap-8 md:flex-row md:items-end md:justify-center">
              {podium.map((player) => {
                const first = player.number === "1";

                return (
                  <div
                    key={player.number}
                    className={`relative
    ${
      player.number === "1"
        ? "order-1 md:order-2"
        : player.number === "2"
          ? "order-2 md:order-1"
          : "order-3"
    }
    ${player.number === "1" ? "md:-mt-12" : "md:mt-10"}
  `}
                  >
                    {/* Avatar */}
                    <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
                      <Image
                        src={player.image}
                        alt={player.name}
                        width={80}
                        height={80}
                        className="h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-lg"
                      />
                    </div>

                    {/* Card */}
                    <div
                      className={`flex flex-col items-center justify-center rounded-2xl border border-slate-300 shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl gap-y-5 mt-6 ${
                        first
                          ? "h-72 w-52 bg-blue-800 text-white"
                          : "h-56 w-44 bg-white text-slate-700"
                      }`}
                    >
                      <h1 className="text-6xl font-bold">#{player.number}</h1>

                      <h3 className="mt-3 text-3xl font-bold">{player.name}</h3>

                      <p
                        className={`mt-3 text-sm font-semibold ${
                          first ? "text-white" : "text-slate-500"
                        }`}
                      >
                        {player.points} PTS
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-[290px]">
            <Link
              href=""
              className="mb-8 flex items-center justify-end gap-3 font-semibold text-slate-700 transition hover:text-blue-800"
            >
              View Leaderboard
              <FaArrowRightLong />
            </Link>

            <div className="space-y-5">
              {others.map((player) => (
                <div
                  key={player.number}
                  className="flex items-center justify-between rounded-2xl border border-slate-300 bg-white px-6 py-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-slate-800">
                      #{player.number}
                    </span>

                    <Image
                      src={player.image}
                      alt={player.name}
                      width={50}
                      height={50}
                      className="h-12 w-12 rounded-xl object-cover"
                    />

                    <span className="font-semibold text-slate-800">
                      {player.name}
                    </span>
                  </div>

                  <span className="font-semibold text-slate-800">
                    {player.points} PTS
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FourthSection;
