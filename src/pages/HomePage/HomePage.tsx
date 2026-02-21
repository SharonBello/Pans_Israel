import React from 'react';
import Hero from '../../components/sections/Hero/Hero';
import UserJourney from '../../components/sections/UserJourney/UserJourney';
import HomeSections from '../../components/sections/HomeSections/HomeSections';

const HomePage: React.FC = (): React.JSX.Element => {
  return (
    <>
      <Hero />
      <UserJourney />
      <HomeSections />
    </>
  );
};

export default HomePage;
