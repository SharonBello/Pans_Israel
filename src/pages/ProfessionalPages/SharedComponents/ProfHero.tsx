import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import '../ProfessionalPage.scss';

export type HeroVariant =
    | 'professional'   // Dark Navy  — /professional/*
    | 'symptoms'       // Deep Blue  — /symptoms, /info/*, /scales/*
    | 'treatment'      // Forest Green — /holistic, /treatment/*
    | 'community'      // Purple     — /support, /testimonials, /resources/*, /community/*
    | 'about';         // Burgundy   — /about

interface HeroProps {
    icon: React.ReactNode;
    label: string;
    title: string;
    desc: string;
    variant?: HeroVariant;
}

export const ProfHero: React.FC<HeroProps> = ({
    icon, label, title, desc, variant = 'professional',
}) => (
    <Box className={`prof-hero prof-hero--${variant}`} dir="rtl">
        <Container maxWidth="lg" className="prof-hero__inner">
            <Box className="prof-hero__icon-wrap">{icon}</Box>
            <Typography variant="overline" className="prof-hero__label">{label}</Typography>
            <Typography variant="h1" className="prof-hero__title">{title}</Typography>
            <Typography className="prof-hero__desc">{desc}</Typography>
        </Container>
    </Box>
);