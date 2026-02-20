import { Box, Typography, Chip } from '@mui/material';
import { OpenInNew as ExternalIcon } from '@mui/icons-material';

interface LinkCardProps { title: string; desc: string; url: string; tag?: string; tagColor?: string; }

export const LinkCard: React.FC<LinkCardProps> = ({ title, desc, url, tag, tagColor = '#023373' }) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className="prof-link-card">
        <Box className="prof-link-card__body">
            <Typography className="prof-link-card__title">{title}</Typography>
            <Typography className="prof-link-card__desc">{desc}</Typography>
        </Box>
        <Box className="prof-link-card__footer">
            {tag && <Chip label={tag} size="small" className="prof-link-card__tag" style={{ background: tagColor + '18', color: tagColor }} />}
            <ExternalIcon className="prof-link-card__icon" />
        </Box>
    </a>
);

