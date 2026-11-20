import React from 'react';
import Hero from '../../components/sections/Hero/Hero';
import UserJourney from '../../components/sections/UserJourney/UserJourney';
import HomeSections from '../../components/sections/HomeSections/HomeSections';
import LatestArticleWidget from '../../components/blog/LatestArticleWidget/LatestArticleWidget';
import FeaturedMediaWidget from '@/components/FeaturedMediaWidget/FeaturedMediaWidget';
import ActivitiesSection from '@/components/Events/ActivitiesSection/ActivitiesSection';
import LatestVideos from '@/components/LatestVideos/LatestVideos';

const HomePage: React.FC = (): React.JSX.Element => {
  return (
    <>
      <Hero />
      <UserJourney />
      <ActivitiesSection />
      <LatestArticleWidget />
      <FeaturedMediaWidget />
      <LatestVideos />
      <HomeSections />
    </>
  );
};

export default HomePage;