import React from 'react';
import Hero from '../../components/sections/Hero/Hero';
import HomeSections from '../../components/sections/HomeSections/HomeSections';

const HomePage: React.FC = (): React.JSX.Element => {
  return (
    <>
      <Hero />
      <HomeSections />
    </>
  );
};

export default HomePage;
