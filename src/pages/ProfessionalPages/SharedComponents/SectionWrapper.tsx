import { Box, Typography } from '@mui/material';

export const SectionWrapper: React.FC<{ title: string; children: React.ReactNode; accent?: string }> = ({ title, children, accent = '#023373' }) => (
    <Box className="prof-section">
        <Box className="prof-section__header" style={{ borderRightColor: accent }}>
            <Typography variant="h5" className="prof-section__title">{title}</Typography>
        </Box>
        {children}
    </Box>
);