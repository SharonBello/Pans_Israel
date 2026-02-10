import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Lightbulb as TipIcon,
  Download as DownloadIcon,
  Circle as BulletIcon,
  OpenInNew as ExternalLinkIcon,
} from '@mui/icons-material';
import './ResourcesContentRenderer.scss';

// Flexible content block type that accepts various content structures
interface ContentBlock {
  id: string;
  type: string;
  title?: string;
  content?: string;
  items?: Array<any>;
  variant?: string;
  columns?: string[];
  rows?: string[][];
  videoUrl?: string;
  url?: string;
  buttonText?: string;
  downloadUrl?: string;
  downloadLabel?: string;
}

interface ResourcesContentRendererProps {
  content: ContentBlock[] | any[];
}

const ResourcesContentRenderer: React.FC<ResourcesContentRendererProps> = ({ content }) => {
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);

  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const getCalloutIcon = (variant?: string) => {
    switch (variant) {
      case 'warning':
        return <WarningIcon />;
      case 'tip':
        return <TipIcon />;
      case 'success':
        return <CheckIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'heading':
        return (
          <Typography
            key={block.id}
            variant="h4"
            className="resources-content__heading"
            id={block.id}
          >
            {block.title}
          </Typography>
        );

      case 'paragraph':
        return (
          <Typography
            key={block.id}
            variant="body1"
            className="resources-content__paragraph"
            dangerouslySetInnerHTML={{ __html: block.content || '' }}
          />
        );

      case 'list':
        return (
          <Box key={block.id} className="content-block content-block--list">
            {block.title && (
              <Typography variant="subtitle1" className="content-block__list-title">
                {block.title}
              </Typography>
            )}
            <List className="content-block__list" disablePadding>
              {block.items?.map((item, index) => {
                const isString = typeof item === 'string';
                const title = isString ? item : item.title;
                const description = isString ? undefined : item.description;
                const url = isString ? undefined : (item as any).url;

                const listItemContent = (
                  <ListItem
                    key={`${block.id}-item-${index}`}
                    className={`content-block__list-item ${url ? 'content-block__list-item--link' : ''}`}
                    disablePadding
                    sx={{ mb: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {url ? (
                        <ExternalLinkIcon sx={{ fontSize: '1.1rem', color: '#E67E22' }} />
                      ) : (
                        <BulletIcon sx={{ fontSize: '0.5rem', color: '#6CA6D9' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        url ? (
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <span>{title}</span>
                          </Box>
                        ) : (
                          title
                        )
                      }
                      secondary={description || undefined}
                      primaryTypographyProps={{
                        fontWeight: url ? 600 : (description ? 600 : 400),
                        fontSize: '0.95rem',
                        color: url ? '#023373' : 'inherit',
                      }}
                      secondaryTypographyProps={{
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                        sx: { mt: 0.25 },
                      }}
                    />
                  </ListItem>
                );

                // Wrap in <a> if URL exists
                if (url) {
                  return (
                    <a
                      key={`${block.id}-link-${index}`}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="content-block__external-link"
                    >
                      {listItemContent}
                    </a>
                  );
                }

                return listItemContent;
              })}
            </List>
          </Box>
        );

      case 'accordion':
        return (
          <Box key={block.id} className="resources-content__accordion-wrapper">
            {block.items?.map((item: any, index: number) => {
              if (typeof item === 'string') return null;
              const panelId = `${block.id}-${index}`;
              return (
                <Accordion
                  key={panelId}
                  expanded={expandedAccordion === panelId}
                  onChange={handleAccordionChange(panelId)}
                  className="resources-content__accordion"
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    className="resources-content__accordion-summary"
                  >
                    <Typography className="resources-content__accordion-title">
                      {item.title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className="resources-content__accordion-details">
                    <Typography
                      dangerouslySetInnerHTML={{ __html: item.description || '' }}
                    />
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        );

      case 'callout':
        return (
          <Box
            key={block.id}
            className={`resources-content__callout resources-content__callout--${block.variant || 'info'}`}
          >
            <Box className="resources-content__callout-icon">
              {getCalloutIcon(block.variant)}
            </Box>
            <Box className="resources-content__callout-content">
              {block.title && (
                <Typography variant="h6" className="resources-content__callout-title">
                  {block.title}
                </Typography>
              )}
              <Typography
                variant="body2"
                className="resources-content__callout-text"
                dangerouslySetInnerHTML={{ __html: block.content || '' }}
              />
            </Box>
          </Box>
        );

      case 'card':
        return (
          <Card key={block.id} className="resources-content__card">
            <CardContent>
              {block.title && (
                <Typography variant="h6" className="resources-content__card-title">
                  {block.title}
                </Typography>
              )}
              <Typography
                variant="body2"
                dangerouslySetInnerHTML={{ __html: block.content || '' }}
              />
            </CardContent>
          </Card>
        );

      case 'table':
        return (
          <TableContainer
            key={block.id}
            component={Paper}
            className="resources-content__table-container"
          >
            <Table className="resources-content__table">
              {block.columns && (
                <TableHead>
                  <TableRow>
                    {block.columns.map((col: string, index: number) => (
                      <TableCell key={index} className="resources-content__table-header">
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
              )}
              <TableBody>
                {block.rows?.map((row: string[], rowIndex: number) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell: string, cellIndex: number) => (
                      <TableCell key={cellIndex} className="resources-content__table-cell">
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );

      case 'video':
        return (
          <Box key={block.id} className="resources-content__video-wrapper">
            {block.title && (
              <Typography variant="h6" className="resources-content__video-title">
                {block.title}
              </Typography>
            )}
            <Box className="resources-content__video-container">
              <iframe
                src={block.videoUrl}
                title={block.title || 'Video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="resources-content__video-iframe"
              />
            </Box>
          </Box>
        );

      case 'download':
        const downloadUrl = block.url || block.downloadUrl;
        const downloadLabel = block.buttonText || block.downloadLabel || 'הורד קובץ';

        return (
          <Box key={block.id} className="resources-content__download">
            <Card className="resources-content__download-card">
              <CardContent>
                {block.title && (
                  <Typography variant="h6" className="resources-content__download-title">
                    <DownloadIcon />
                    {block.title}
                  </Typography>
                )}
                {block.content && (
                  <Typography
                    variant="body2"
                    className="resources-content__download-desc"
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                )}
                {block.items && block.items.length > 0 && (
                  <Box className="resources-content__download-list">
                    {block.items.map((item: any, index: number) => {
                      if (typeof item === 'string') {
                        return (
                          <Typography key={index} variant="body2">
                            {item}
                          </Typography>
                        );
                      }
                      return (
                        <Box key={index} className="resources-content__download-item">
                          <Typography variant="subtitle2">
                            {item.title}
                          </Typography>
                          {item.description && (
                            <Typography variant="body2" color="text.secondary">
                              {item.description}
                            </Typography>
                          )}
                          {item.url && (
                            <Button
                              variant="outlined"
                              size="small"
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              startIcon={<DownloadIcon />}
                              className="resources-content__download-btn"
                            >
                              הורד
                            </Button>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                )}
                {downloadUrl && (
                  <Button
                    variant="contained"
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<DownloadIcon />}
                    className="resources-content__download-main-btn"
                  >
                    {downloadLabel}
                  </Button>
                )}
              </CardContent>
            </Card>
          </Box>
        );

      default:
        console.warn('Unknown block type:', block.type);
        return (
          <Box key={block.id} sx={{ p: 2, bgcolor: '#fff3cd', borderRadius: 1, mb: 2 }}>
            <Typography variant="caption">
              סוג בלוק לא מוכר: {block.type}
            </Typography>
          </Box>
        );
    }
  };

  if (!content || content.length === 0) {
    return (
      <Box className="resources-content" dir="rtl">
        <Typography variant="body1" color="text.secondary">
          אין תוכן להצגה
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="resources-content" dir="rtl">
      {content.map((block) => renderBlock(block as ContentBlock))}
    </Box>
  );
};

export default ResourcesContentRenderer;
