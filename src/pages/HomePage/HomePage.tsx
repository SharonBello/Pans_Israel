import React from 'react';
import Hero from '../../components/sections/Hero/Hero';
import UserJourney from '../../components/sections/UserJourney/UserJourney';
import HomeSections from '../../components/sections/HomeSections/HomeSections';
import LatestArticleWidget from '../../components/blog/LatestArticleWidget/LatestArticleWidget';
import FeaturedMediaWidget from '@/components/FeaturedMediaWidget/FeaturedMediaWidget';
import ActivitiesSection from '@/components/Events/ActivitiesSection/ActivitiesSection';

const HomePage: React.FC = (): React.JSX.Element => {
  return (
    <>
      <Hero />
      <UserJourney />
      {/* ═══════════════ Upcoming Activities ═══════════════ */}
      <ActivitiesSection variant="list" />
      <LatestArticleWidget />
      <FeaturedMediaWidget />
      <HomeSections />
    </>
  );
};

export default HomePage;
