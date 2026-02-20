import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  CardActions,
  CardActionArea,
  Fab,
  Button,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import {
  KeyboardArrowUp as ScrollTopIcon,
  Assessment,
  Lock,
  Science,
  Timeline,
  Verified as VerifiedIcon,
  Favorite as HeartIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import InfoTabs from '../../components/Info/InfoTabs/InfoTabs';
import TreatmentTabs from '../../components/Treatment/TreatmentTabs/TreatmentTabs';
import InfoContentRenderer from '../../components/Info/InfoSection/InfoContentRenderer';
import { infoSections } from '../../data/infoContent';
import './InfoPage.scss';

// ── Exact same ScaleCard interface + data as SymptomsPage ──────────────────
interface ScaleCard {
  id: string;
  title: string;
  description: string;
  route: string;
  available: boolean;
  icon?: 'assessment' | 'science' | 'timeline' | 'verified' | 'heart';
  color?: string;
  validated?: boolean;
  forParents?: boolean;
}

const SCALE_CARDS: ScaleCard[] = [
  {
    id: 'pans31',
    title: 'מדד פאנס 31-פריטים',
    description: "כלי הערכה מאומת מחקרית (Cronbach's α=0.89) לזיהוי ומדידת חומרת תסמיני PANS",
    route: '/scales/pans31',
    available: true,
    icon: 'verified',
    color: '#717DBC',
    validated: true,
  },
  {
    id: 'cbi',
    title: 'שאלון עומס המטפל (CBI)',
    description: 'הערכת העומס הרגשי, הפיזי והחברתי של הורים - מאומת ל-PANS (Farmer et al., 2018)',
    route: '/scales/cbi',
    available: true,
    icon: 'heart',
    color: '#9B59B6',
    validated: true,
    forParents: true,
  },
  {
    id: 'pandas',
    title: 'מדד פאנס/פאנדס',
    description: 'כלי הערכה מקיף למעקב אחר תסמיני פאנס/פאנדס לאורך זמן',
    route: '/scales/pandas',
    available: true,
    icon: 'assessment',
    color: '#6C5CE7',
  },
  {
    id: 'kovacevic',
    title: "שאלון קובאצ'ביץ'",
    description: "קריטריוני אבחון מבוססי תצפיות קליניות מ-591 מטופלים (ד\"ר קובאצ'ביץ' 2019)",
    route: '/scales/kovacevic',
    available: true,
    icon: 'science',
    color: '#E17055',
  },
  {
    id: 'ptec',
    title: 'שאלון PTEC',
    description: 'כלי מעקב אחר שיפור/החמרה בתסמינים לאורך זמן (0-306 נקודות)',
    route: '/scales/ptec',
    available: true,
    icon: 'timeline',
    color: '#00CEC9',
  },
];

// ── Exact same renderIcon as SymptomsPage ──────────────────────────────────
const renderIcon = (scale: ScaleCard) => {
  if (!scale.available) return <Lock className="scale-card__icon scale-card__icon--locked" />;
  const iconStyle = { color: scale.color || '#717DBC' };
  switch (scale.icon) {
    case 'verified': return <VerifiedIcon className="scale-card__icon scale-card__icon--active" sx={iconStyle} />;
    case 'science': return <Science className="scale-card__icon scale-card__icon--active" sx={iconStyle} />;
    case 'timeline': return <Timeline className="scale-card__icon scale-card__icon--active" sx={iconStyle} />;
    case 'heart': return <HeartIcon className="scale-card__icon scale-card__icon--active" sx={iconStyle} />;
    case 'assessment':
    default: return <Assessment className="scale-card__icon scale-card__icon--active" sx={iconStyle} />;
  }
};

// ──────────────────────────────────────────────────────────────────────────
const InfoPage: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const pathSegment = location.pathname.split('/').filter(Boolean).pop() ?? 'overview';
  const currentPageId = pageId ?? pathSegment;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showScrollTop, setShowScrollTop] = useState(false);

  const isScalesTab = currentPageId === 'scales';
  const currentSection = isScalesTab
    ? {
      id: 'scales',
      title: 'כלי הערכה',
      slug: 'scales',
      description: 'סולמות הערכה קליניים לזיהוי ומעקב אחר תסמיני פאנס/פאנדס',
      content: [] as any[],
      relatedPages: [] as any[],
    }
    : (infoSections[currentPageId] || infoSections.overview);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPageId]);

  const handleRelatedPageClick = (slug: string) => navigate(`/info/${slug}`);

  return (
    <Box className="info-page" dir="rtl">

      {/* Hero */}
      <Box className="info-page__hero">
        <Box className="info-page__hero-background">
          <Box className="info-page__hero-gradient" />
          <Box className="info-page__hero-pattern" />
        </Box>
        <Container maxWidth="lg" className="info-page__hero-content">
          {/* <Typography variant="overline" className="info-page__hero-label">
            מידע על התסמונות
          </Typography> */}
          <Typography variant="h1" className="info-page__hero-title">
            {currentSection.title}
          </Typography>
          <Typography variant="body1" className="info-page__hero-description">
            {currentSection.description}
          </Typography>
        </Container>
      </Box>

      {/* Tabs — render correct tab bar per nav group */}
      {currentPageId === 'treatment'
        ? <TreatmentTabs />
        : <InfoTabs currentPage={currentPageId} />
      }

      {/* Main Content */}
      <Box className="info-page__layout">
        <Box className="info-page__main">
          <Container maxWidth="lg" className="info-page__content-container">

            {isScalesTab ? (
              /* ── Scales tab: identical markup to SymptomsPage ── */
              <Box sx={{ pt: 3 }}>

                {/* Disclaimer — same as SymptomsPage */}
                <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>
                  <Typography variant="body1">
                    הסולמות המוצגים כאן הם כלי עזר בלבד ואינם מהווים תחליף לאבחון רפואי מקצועי.
                    אנא התייעצו עם רופא מומחה.
                  </Typography>
                </Alert>

                {/* Cards grid — same className as SymptomsPage */}
                <Box className="symptoms-page__grid">
                  {SCALE_CARDS.map((scale) => (
                    <Card
                      key={scale.id}
                      className={`scale-card ${!scale.available ? 'scale-card--disabled' : ''}`}
                      elevation={scale.available ? 3 : 1}
                      sx={{
                        borderTop: scale.available ? `4px solid ${scale.color || '#717DBC'}` : undefined,
                      }}
                    >
                      <CardContent className="scale-card__content">
                        {/* Icon & Badges */}
                        <Box className="scale-card__header">
                          {renderIcon(scale)}
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {scale.validated && (
                              <Chip
                                label="מאומת"
                                size="small"
                                sx={{ backgroundColor: 'rgba(76,175,80,0.1)', color: '#4CAF50', fontWeight: 'bold' }}
                              />
                            )}
                            {scale.forParents && (
                              <Chip
                                label="להורים"
                                size="small"
                                sx={{ backgroundColor: 'rgba(155,89,182,0.1)', color: '#9B59B6', fontWeight: 'bold' }}
                              />
                            )}
                            <Chip
                              label="זמין עכשיו"
                              color="success"
                              size="small"
                              className="scale-card__status"
                            />
                          </Box>
                        </Box>

                        {/* Title */}
                        <Typography variant="h5" component="h2" className="scale-card__title" gutterBottom>
                          {scale.title}
                        </Typography>

                        {/* Description */}
                        <Typography variant="body2" color="text.secondary" className="scale-card__description">
                          {scale.description}
                        </Typography>
                      </CardContent>

                      {/* Action button */}
                      <CardActions className="scale-card__actions">
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => navigate(scale.route)}
                          className="scale-card__button"
                          sx={{
                            backgroundColor: scale.color,
                            '&:hover': { backgroundColor: scale.color, filter: 'brightness(0.9)' },
                          }}
                        >
                          התחל מדד
                        </Button>
                      </CardActions>
                    </Card>
                  ))}
                </Box>

                {/* Link to community statistics */}
                <Box sx={{ mt: 4 }}>
                  <Divider>
                    <Chip
                      label="סטטיסטיקות קהילתיות"
                      onClick={() => navigate('/symptoms')}
                      clickable
                      icon={<ArrowForwardIcon sx={{ transform: 'rotate(180deg)' }} />}
                      sx={{ cursor: 'pointer', fontFamily: "'Heebo','Assistant',sans-serif" }}
                    />
                  </Divider>
                </Box>

              </Box>
            ) : (
              /* ── All other tabs ── */
              <>
                <InfoContentRenderer content={currentSection.content} />

                {currentSection.relatedPages && currentSection.relatedPages.length > 0 && (
                  <Box className="info-page__related">
                    <Typography variant="h5" className="info-page__related-title">
                      למידע נוסף
                    </Typography>
                    <Box className="info-page__related-grid">
                      {currentSection.relatedPages.map((page) => (
                        <Card key={page.id} className="info-page__related-card">
                          <CardActionArea
                            onClick={() => handleRelatedPageClick(page.slug)}
                            className="info-page__related-card-action"
                          >
                            <Box
                              className="info-page__related-card-media"
                              sx={{ backgroundImage: `url(${page.imageUrl})` }}
                              role="img"
                              aria-label={page.imageAlt || page.title}
                            />
                            <CardContent className="info-page__related-card-content">
                              <Typography variant="h5" className="info-page__related-card-title">
                                {page.title}
                              </Typography>
                              <Typography variant="body2" className="info-page__related-card-description">
                                {page.description}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                )}
              </>
            )}

            {/* CTA */}
            <Box className="info-page__cta">
              <Typography variant="h6" className="info-page__cta-title">צריכים עזרה?</Typography>
              <Typography variant="body2" className="info-page__cta-text">
                הצטרפו לקהילה שלנו לתמיכה ומידע נוסף
              </Typography>
              <Box className="info-page__cta-buttons">
                <a
                  className="info-page__cta-button info-page__cta-button--primary"
                  href="https://www.facebook.com/groups/PandasIsrael/?ref=share&mibextid=NSMWBT"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  הצטרפו לקהילה
                </a>
                <button
                  className="info-page__cta-button info-page__cta-button--secondary"
                  onClick={() => navigate('/resources')}
                >
                  משאבים להורים
                </button>
              </Box>
            </Box>

          </Container>
        </Box>
      </Box>

      <Fab
        className={`info-page__scroll-top ${showScrollTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="חזרה למעלה"
      >
        <ScrollTopIcon />
      </Fab>
    </Box>
  );
};

export default InfoPage;