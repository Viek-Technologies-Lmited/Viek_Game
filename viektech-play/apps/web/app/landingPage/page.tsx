import FifthSection from "@/components/landingPage/fifthSection";
import FirstSection from "@/components/landingPage/firstSection";
import FourthSection from "@/components/landingPage/fourthSection";
import Header from "@/components/landingPage/header";
import LastSection from "@/components/landingPage/lastSection";
import StatsSection from "@/components/landingPage/statsSection";
import Thirdsection from "@/components/landingPage/thirdsection";
import React from "react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <FirstSection />
      <StatsSection />
      <Thirdsection />
      <FourthSection />
      <FifthSection />
      <LastSection />
    </div>
  );
};

export default LandingPage;
