import React from "react";
import { landingstats } from "../fakeJson";

const StatsSection = () => {
  return (
    <section className=" py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:grid-cols-4">
          {landingstats.map(({ number, text }) => (
            <div
              key={text}
              className="flex flex-col items-center justify-center text-center"
            >
              <h2 className="text-3xl font-bold text-slate-700 lg:text-5xl">
                {number}
              </h2>

              <p className="mt-2 text-xs font-semibold uppercase text-slate-500 lg:text-sm">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
