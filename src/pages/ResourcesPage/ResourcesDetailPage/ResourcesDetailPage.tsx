import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as ArrowIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { resourceSections, downloadableResources } from '../../../data/resourcesContent';
import ResourcesContentRenderer from '../../../components/Resources/ResourcesSection/ResourcesContentRenderer';
import ResourcesTabs from '../../../components/Resources/ResourcesTabs/ResourcesTabs';
import './ResourcesDetailPage.scss';

const ResourcesDetailPage: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pageId]);

  // Validate pageId - check if section exists
  const currentPageId = pageId && resourceSections[pageId] ? pageId : null;
  const currentSection = currentPageId ? resourceSections[currentPageId] : null;

  // Page not found
  if (!currentSection) {
    return (
      <Box className="resources-detail" dir="rtl">
        <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            העמוד לא נמצא
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            מזהה עמוד: {pageId || 'לא צוין'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            עמודים זמינים: {Object.keys(resourceSections).join(', ')}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/resources')}
            sx={{ mt: 2 }}
          >
            חזרה לעמוד המשאבים
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="resources-detail" dir="rtl">
      {/* Hero Section */}
      <section className="resources-detail__hero">
        <div className="resources-detail__hero-bg" />
        <div className="resources-detail__hero-content">
          <Container maxWidth="lg">
            {/* Breadcrumbs */}
            <Breadcrumbs 
              className="resources-detail__breadcrumbs"
              separator="‹"
            >
              <Link
                component="button"
                onClick={() => navigate('/')}
                className="resources-detail__breadcrumb-link"
              >
                <HomeIcon fontSize="small" />
                דף הבית
              </Link>
              <Link
                component="button"
                onClick={() => navigate('/resources')}
                className="resources-detail__breadcrumb-link"
              >
                משאבים
              </Link>
              <Typography className="resources-detail__breadcrumb-current">
                {currentSection.title}
              </Typography>
            </Breadcrumbs>

            <Typography variant="h1" className="resources-detail__hero-title">
              {currentSection.title}
            </Typography>
            {currentSection.description && (
              <Typography className="resources-detail__hero-subtitle">
                {currentSection.description}
              </Typography>
            )}
          </Container>
        </div>
      </section>

      {/* Tabs Navigation */}
      <ResourcesTabs currentPage={currentPageId || ''} />

      {/* Main Content */}
      <section className="resources-detail__content">
        <Container maxWidth="lg">
          <div className="resources-detail__main">
            {/* Render dynamic content */}
            {currentSection.content && currentSection.content.length > 0 ? (
              <ResourcesContentRenderer content={currentSection.content as any} />
            ) : (
              <Typography variant="body1" color="text.secondary">
                אין תוכן להצגה בעמוד זה
              </Typography>
            )}

            {/* Downloadable Resources - Show on parents page */}
            {currentPageId === 'parents' && downloadableResources.length > 0 && (
              <div className="resources-detail__downloads">
                <Typography variant="h3" className="resources-detail__downloads-title">
                  <DownloadIcon />
                  מדריכים ומשאבים להורדה
                </Typography>
                <div className="resources-detail__downloads-grid">
                  {downloadableResources.map((resource) => (
                    <Card key={resource.id} className="resources-detail__download-card">
                      <CardContent>
                        <Typography variant="h6" className="resources-detail__download-title">
                          {resource.title}
                        </Typography>
                        <Typography variant="body2" className="resources-detail__download-desc">
                          {resource.description}
                        </Typography>
                        {resource.titleEn && (
                          <Typography variant="caption" className="resources-detail__download-en">
                            {resource.titleEn}
                          </Typography>
                        )}
                        <Button
                          variant="outlined"
                          size="small"
                          href={resource.url}
                          download={`${resource.id}.pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          startIcon={<DownloadIcon />}
                          className="resources-detail__download-btn"
                        >
                          הורד PDF
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Related Pages */}
            {currentSection.relatedPages && currentSection.relatedPages.length > 0 && (
              <div className="resources-detail__related">
                <Typography variant="h3" className="resources-detail__related-title">
                  עמודים קשורים
                </Typography>
                <div className="resources-detail__related-grid">
                  {currentSection.relatedPages.map((page) => (
                    <Card 
                      key={page.id} 
                      className="resources-detail__related-card"
                      onClick={() => navigate(`/resources/${page.slug}`)}
                    >
                      <CardContent>
                        <Typography variant="h6">{page.title}</Typography>
                        <Typography variant="body2">{page.description}</Typography>
                        <ArrowIcon className="resources-detail__related-arrow" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Back Button */}
            <div className="resources-detail__back">
              <Button
                variant="outlined"
                onClick={() => navigate('/resources')}
                startIcon={<ArrowIcon className="rtl-flip" />}
                className="resources-detail__back-btn"
              >
                חזרה לעמוד המשאבים
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </Box>
  );
};

export default ResourcesDetailPage;
