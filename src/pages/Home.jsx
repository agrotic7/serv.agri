import React from 'react';
import HeroPro from '../components/HeroPro';
// import ProblemSolution from '../components/ProblemSolution';
import Atouts from '../components/Atouts';
import ChiffresCles from '../components/ChiffresCles';
// import ServicesOverview from '../components/ServicesOverview';
// import Testimonials from '../components/Testimonials';
// import CallToAction from '../components/CallToAction';
import NewsSection from '../components/NewsSection';
import LatestRealisations from '../components/LatestRealisations';

export default function Home() {
  return (
    <div>
      <HeroPro />
      {/* <ProblemSolution /> */}
      <Atouts />
      <ChiffresCles />
      {/* <ServicesOverview /> */}
      {/* <Testimonials /> */}
      {/* <CallToAction /> */}
      <LatestRealisations />
      <NewsSection />
    </div>
  );
} 