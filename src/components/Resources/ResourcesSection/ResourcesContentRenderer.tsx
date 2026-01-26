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
} from '@mui/icons-material';
import './ResourcesContentRenderer.scss';

// Types for content blocks - unified type supporting both Info and Resources content
interface ContentBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'accordion' | 'callout' | 'card' | 'table' | 'video' | 'download';
  title?: string;
  content?: string;
  items?: Array<{
    title?: string;
    description?: string;
    url?: string;
  } | string>;
  variant?: 'info' | 'warning' | 'tip' | 'success';
  columns?: string[];
  rows?: string[][];
  videoUrl?: string;
  // Download properties (supports both naming conventions)
  url?: string;
  buttonText?: string;
  downloadUrl?: string;
  downloadLabel?: string;
}

interface ResourcesContentRendererProps {
  content: ContentBlock[];
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
          <Box key={block.id} className="resources-content__list-wrapper">
            {block.title && (
              <Typography variant="h6" className="resources-content__list-title">
                {block.title}
              </Typography>
            )}
            <List className="resources-content__list">
              {block.items?.map((item, index) => (
                <ListItem key={index} className="resources-content__list-item">
                  <ListItemIcon className="resources-content__list-icon">
                    <BulletIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={typeof item === 'string' ? item : item.title}
                    secondary={typeof item === 'object' ? item.description : undefined}
                    className="resources-content__list-text"
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        );

      case 'accordion':
        return (
          <Box key={block.id} className="resources-content__accordion-wrapper">
            {block.items?.map((item, index) => {
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
                    {block.columns.map((col, index) => (
                      <TableCell key={index} className="resources-content__table-header">
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
              )}
              <TableBody>
                {block.rows?.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
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
        // Support both url/buttonText and downloadUrl/downloadLabel naming
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
                    {block.items.map((item, index) => {
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
        return null;
    }
  };

  return (
    <Box className="resources-content" dir="rtl">
      {content.map(renderBlock)}
    </Box>
  );
};

export default ResourcesContentRenderer;
