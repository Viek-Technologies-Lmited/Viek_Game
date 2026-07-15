import Image from "next/image";
import React from "react";

const FifthSection = () => {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-800 md:text-5xl">
            Quiz Categories
          </h2>

          <p className="mx-auto mt-4 max-w-4xl text-lg text-slate-600 md:text-3xl">
            Explore quizzes across today&apos;s most in-demand tech fields
          </p>
        </div>

        {/* Cards */}
        <div className="relative mt-20 flex flex-col items-center justify-center gap-8 lg:h-[420px] lg:flex-row lg:gap-0">
          {/* Programming */}
          <div className="transition duration-300 hover:-translate-y-2 hover:rotate-0 lg:absolute lg:left-45 lg:-rotate-1">
            <Image
              src="/programming.png"
              alt="Programming"
              width={300}
              height={430}
              className="h-auto w-[280px] lg:w-[330px]"
            />
          </div>

          {/* UI/UX */}
          <div className="z-10 transition duration-300 hover:-translate-y-2 lg:absolute bottom-15">
            <Image
              src="/ux.png"
              alt="UI UX"
              width={330}
              height={430}
              className="h-auto w-[280px] lg:w-[330px]"
            />
          </div>

          {/* Cyber */}
          <div className="transition duration-300 hover:-translate-y-2 hover:rotate-0 lg:absolute lg:right-48 lg:rotate-1 top-5">
            <Image
              src="/cyber.png"
              alt="Cybersecurity"
              width={330}
              height={430}
              className="h-auto w-[280px] lg:w-[330px]"
            />
          </div>
        </div>

        {/* Why Play */}
        <div className="mx-auto mt-24 max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-slate-800 md:text-5xl">
            Why Play?
          </h2>

          <p className="mt-5 text-lg leading-9 text-slate-600 md:text-2xl">
            Challenge yourself, learn new skills, and compete with tech
            enthusiasts from around the world.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FifthSection;
