import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  CardActionArea,
  Fab,
} from '@mui/material';
import {
  KeyboardArrowUp as ScrollTopIcon,
} from '@mui/icons-material';
import InfoTabs from '../../components/Info/InfoTabs/InfoTabs';
import InfoContentRenderer from '../../components/Info/InfoSection/InfoContentRenderer';
import AssessmentScales from '../../components/Info/AssessmentScales/AssessmentScales';
import { infoSections } from '../../data/infoContent';
import './InfoPage.scss';

const InfoPage: React.FC = () => {
  const { pageId = 'overview' } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const currentSection = infoSections[pageId] || infoSections.overview;

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pageId]);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRelatedPageClick = (slug: string) => {
    navigate(`/info/${slug}`);
  };

  return (
    <Box className="info-page" dir="rtl">
      {/* Hero Section */}
      <Box className="info-page__hero">
        <Box className="info-page__hero-background">
          <Box className="info-page__hero-gradient" />
          <Box className="info-page__hero-pattern" />
        </Box>
        <Container maxWidth="lg" className="info-page__hero-content">
          <Typography variant="overline" className="info-page__hero-label">
            מידע על התסמונות
          </Typography>
          <Typography variant="h1" className="info-page__hero-title">
            {currentSection.title}
          </Typography>
          <Typography variant="body1" className="info-page__hero-description">
            {currentSection.description}
          </Typography>
        </Container>
      </Box>

      {/* Tab Navigation */}
      <InfoTabs currentPage={pageId} />

      {/* Main Content Area */}
      <Box className="info-page__layout">
        {/* Main Content */}
        <Box className="info-page__main">
          <Container maxWidth="lg" className="info-page__content-container">
            {/* Content Renderer */}
            <InfoContentRenderer content={currentSection.content} />

            {/* Assessment Scales (on symptoms page) */}
            {pageId === 'symptoms' && (
              <Box className="info-page__scales-section">
                <AssessmentScales showInteractive={true} />
              </Box>
            )}

            {/* Related Pages */}
            {currentSection.relatedPages && currentSection.relatedPages.length > 0 && (
              <Box className="info-page__related">
                <Typography variant="h5" className="info-page__related-title">
                  למידע נוסף
                </Typography>
                <Box className="info-page__related-grid">
                  {currentSection.relatedPages.map((page) => (
                    <Card
                      key={page.id}
                      className="info-page__related-card"
                    >
                      <CardActionArea
                        onClick={() => handleRelatedPageClick(page.slug)}
                        className="info-page__related-card-action"
                      >
                        <Box
                          className="info-page__related-card-media"
                          sx={{
                            backgroundImage: `url(${page.imageUrl})`,
                          }}
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

            {/* Call to Action */}
            <Box className="info-page__cta">
              <Typography variant="h6" className="info-page__cta-title">
                צריכים עזרה?
              </Typography>
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

      {/* Scroll to Top */}
      <Fab
        className={`info-page__scroll-top ${showScrollTop ? 'visible' : ''}`}
        onClick={handleScrollTop}
        aria-label="חזרה למעלה"
      >
        <ScrollTopIcon />
      </Fab>
    </Box>
  );
};

export default InfoPage;
