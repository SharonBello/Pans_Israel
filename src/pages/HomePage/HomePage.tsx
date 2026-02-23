import React from 'react';
import Hero from '../../components/sections/Hero/Hero';
import UserJourney from '../../components/sections/UserJourney/UserJourney';
import HomeSections from '../../components/sections/HomeSections/HomeSections';
import LatestArticleWidget from '../../components/blog/LatestArticleWidget/LatestArticleWidget';

const HomePage: React.FC = (): React.JSX.Element => {
  return (
    <>
      <Hero />
      <UserJourney />
      <LatestArticleWidget />
      <HomeSections />
    </>
  );
};

export default HomePage;
