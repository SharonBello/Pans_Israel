import React from 'react';
import { Event as EventIcon } from '@mui/icons-material';
import SupportPageHero from '@/components/Support/SupportPageHero/SupportPageHero';
import SupportTabs from '@/components/Support/SupportTabs/SupportTabs';
import ActivitiesSection from '@/components/Events/ActivitiesSection/ActivitiesSection';
import './ActivitiesPage.scss';

const ACTIVITIES_EMBED_URL = 'https://panspandas.vercel.app/embed/activities';

const ActivitiesPage: React.FC = (): React.JSX.Element => (
    <div className="activities-page" dir="rtl">
        <SupportPageHero
            icon={<EventIcon />}
            title="פעילויות ואירועים"
            subtitle="וובינרים, מפגשים, הרצאות וכנסים לקהילת ההורים ולאנשי המקצוע — הצטרפו אלינו."
        />

        <SupportTabs />

        <div className="activities-page__container">
            <ActivitiesSection />
        </div>
    </div>
);

export default ActivitiesPage;