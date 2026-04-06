import React from 'react';
import { Helmet } from 'react-helmet';
import HeroPro from '../components/HeroPro';
import ProblemSolution from '../components/ProblemSolution';
import Atouts from '../components/Atouts';
import ChiffresCles from '../components/ChiffresCles';
import Testimonials from '../components/Testimonials';
import NewsSection from '../components/NewsSection';
import LatestRealisations from '../components/LatestRealisations';

export default function Home() {
  return (
    <div>
      <Helmet>
        <title>SERVAGRI — L’agriculture de précision du champ à votre écran</title>
        <meta name="description" content="SERVAGRI propose des solutions d’irrigation intelligente, d’analyse agronomiqueee et d’agriculture de précision pour booster vos récoltes et économiser l’eau au Sénégal." />
        <meta property="og:title" content="SERVAGRI — Agriculture de précision au Sénégal" />
        <meta property="og:description" content="Solutions d’irrigation connectée, Big Data et agriculture de précision pour les agriculteurs sénégalais." />
      </Helmet>
      <HeroPro />
      <ProblemSolution />
      <Atouts />
      <ChiffresCles />
      <LatestRealisations />
      <Testimonials />
      <NewsSection />
    </div>
  );
} 