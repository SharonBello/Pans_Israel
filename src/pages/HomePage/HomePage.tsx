import React from 'react';
import Hero from '../../components/sections/Hero/Hero';
import UserJourney from '../../components/sections/UserJourney/UserJourney';
import HomeSections from '../../components/sections/HomeSections/HomeSections';
import LatestArticleWidget from '../../components/blog/LatestArticleWidget/LatestArticleWidget';
import FeaturedMediaWidget from '@/components/FeaturedMediaWidget/FeaturedMediaWidget';
import ActivitiesSection from '@/components/Events/ActivitiesSection/ActivitiesSection';
import LatestVideos from '@/components/LatestVideos/LatestVideos';
import CommunityCta from '@/components/Community/CommunityCta/CommunityCta';
import { GroupAdd as JoinIcon } from '@mui/icons-material';

const HomePage: React.FC = (): React.JSX.Element => {
  return (
    <>
      <Hero />
      <UserJourney />
      <ActivitiesSection />
      <CommunityCta
        inset
        icon={<JoinIcon />}
        title="הצטרפו לקהילה"
        text="משפחות שמתמודדות עם פאנס/פאנדס לא צריכות להתמודד לבד. השאירו שם ואימייל, ותוכלו לבחור לקבל עדכונים על מפגשים, הרצאות ומידע חדש."
        primary={{ label: 'הצטרפות לקהילה', to: '/join' }}
      />
      <LatestArticleWidget />
      <FeaturedMediaWidget />
      <LatestVideos />
      <HomeSections />
    </>
  );
};

export default HomePage;