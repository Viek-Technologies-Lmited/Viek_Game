import Image from "next/image";
import React from "react";
import { lastSectionCards } from "../fakeJson";
import Button from "../button";

const LastSection = () => {
  return (
    <section className="bg-blue-800 py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Ready to Challenge Yourself?
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-blue-100">
            Join thousands of developers competing every day. Test your
            knowledge, climb the leaderboard, and earn exciting rewards.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {lastSectionCards.map((card, index) => (
            <div key={index} className="overflow-hidden rounded-3xl">
              <Image
                src={card}
                alt={`Card ${index + 1}`}
                width={420}
                height={500}
                className="h-auto w-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button className="rounded-full! bg-white px-10 py-4 text-lg font-semibold text-blue-800 transition hover:bg-blue-100! w-fit!">
            Start Playing
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LastSection;
