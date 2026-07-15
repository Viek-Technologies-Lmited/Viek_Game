import React from "react";
import { howItWorks } from "../fakeJson";
import Image from "next/image";

const ThirdSection = () => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-1xl text-center">
          <h2 className="text-4xl font-bold text-slate-700 sm:text-5xl">
            How It Works
          </h2>

          <p className="mt-3 text-lg text-slate-500">
            Test Your Skills In Minutes
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 gap-x-30 gap-y-10 md:grid-cols-2 lg:grid-cols-3 items-center">
          {howItWorks.map((item) => (
            <div key={item.step}>
              {/* Step outside the card */}
              <h3 className="mb-2 text-center text-[35px] font-bold text-slate-700">
                {item.step}
              </h3>

              {/* Card */}
              <Image
                src={item.image}
                alt={item.image}
                width={420}
                height={500}
                className="h-auto w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThirdSection;
