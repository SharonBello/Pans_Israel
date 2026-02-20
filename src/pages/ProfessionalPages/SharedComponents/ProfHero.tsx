
import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import '../ProfessionalPage.scss';

interface HeroProps {
    icon: React.ReactNode;
    label: string;
    title: string;
    desc: string;
}

export const ProfHero: React.FC<HeroProps> = ({ icon, label, title, desc }) => (
    <Box className="prof-hero" dir="rtl">
        <Container maxWidth="lg" className="prof-hero__inner">
            <Box className="prof-hero__icon-wrap">{icon}</Box>
            <Typography variant="overline" className="prof-hero__label">{label}</Typography>
            <Typography variant="h1" className="prof-hero__title">{title}</Typography>
            <Typography className="prof-hero__desc">{desc}</Typography>
        </Container>
    </Box>
);