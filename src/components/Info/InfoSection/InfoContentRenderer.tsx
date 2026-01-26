import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Link,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Lightbulb as TipIcon,
  Download as DownloadIcon,
  PlayCircle as PlayIcon,
} from '@mui/icons-material';
import type { InfoContent, ListItem } from '../../../types/info.types';
import './InfoContentRenderer.scss';

interface InfoContentRendererProps {
  content: InfoContent[];
}

const InfoContentRenderer: React.FC<InfoContentRendererProps> = ({ content }) => {
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);

  const handleAccordionChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAccordion(isExpanded ? panel : false);
    };

  const getCalloutIcon = (variant?: string) => {
    switch (variant) {
      case 'warning':
        return <WarningIcon />;
      case 'success':
        return <SuccessIcon />;
      case 'tip':
        return <TipIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const renderContent = (item: InfoContent) => {
    switch (item.type) {
      case 'heading':
        return (
          <Typography
            key={item.id}
            variant="h4"
            className="info-content__heading"
            id={item.id}
          >
            {item.title}
            <Box className="info-content__heading-decoration" />
          </Typography>
        );

      case 'paragraph':
        return (
          <Typography
            key={item.id}
            variant="body1"
            className="info-content__paragraph"
          >
            {item.content}
          </Typography>
        );

      case 'list':
        return (
          <Box key={item.id} className="info-content__list-container">
            {item.title && (
              <Typography variant="h6" className="info-content__list-title">
                {item.title}
              </Typography>
            )}
            <ul className="info-content__list">
              {item.items?.map((listItem, index) => {
                if (typeof listItem === 'string') {
                  return (
                    <li key={index} className="info-content__list-item">
                      <Box className="info-content__list-bullet" />
                      <Typography variant="body1">{listItem}</Typography>
                    </li>
                  );
                }
                const typedItem = listItem as ListItem;
                return (
                  <li key={index} className="info-content__list-item info-content__list-item--detailed">
                    <Box className="info-content__list-bullet" />
                    <Box>
                      <Typography variant="subtitle1" className="info-content__list-item-title">
                        {typedItem.title}
                      </Typography>
                      {typedItem.description && (
                        <Typography variant="body2" className="info-content__list-item-description">
                          {typedItem.description}
                        </Typography>
                      )}
                    </Box>
                  </li>
                );
              })}
            </ul>
          </Box>
        );

      case 'callout':
        return (
          <Box
            key={item.id}
            className={`info-content__callout info-content__callout--${item.variant || 'info'}`}
          >
            <Box className="info-content__callout-icon">
              {getCalloutIcon(item.variant)}
            </Box>
            <Box className="info-content__callout-content">
              {item.title && (
                <Typography variant="h6" className="info-content__callout-title">
                  {item.title}
                </Typography>
              )}
              <Typography variant="body1" className="info-content__callout-text">
                {item.content}
              </Typography>
            </Box>
          </Box>
        );

      case 'accordion':
        return (
          <Box key={item.id} className="info-content__accordion-container">
            {(item.items as ListItem[])?.map((accordionItem, index) => (
              <Accordion
                key={index}
                expanded={expandedAccordion === `${item.id}-${index}`}
                onChange={handleAccordionChange(`${item.id}-${index}`)}
                className="info-content__accordion"
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  className="info-content__accordion-summary"
                >
                  <Typography variant="subtitle1">
                    {accordionItem.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className="info-content__accordion-details">
                  <Typography variant="body2">
                    {accordionItem.description}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        );

      case 'table':
        return (
          <TableContainer
            key={item.id}
            component={Paper}
            className="info-content__table-container"
          >
            <Table className="info-content__table">
              <TableHead>
                <TableRow>
                  {item.columns?.map((col, index) => (
                    <TableCell key={index} className="info-content__table-header">
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {item.rows?.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="info-content__table-row">
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex} className="info-content__table-cell">
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
          <Box key={item.id} className="info-content__video">
            <Typography variant="h6" className="info-content__video-title">
              <PlayIcon />
              {item.title}
            </Typography>
            {item.content && (
              <Typography variant="body2" className="info-content__video-description">
                {item.content}
              </Typography>
            )}
            <Link
              href={item.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="info-content__video-link"
            >
              <Button
                variant="outlined"
                startIcon={<PlayIcon />}
                className="info-content__video-button"
              >
                צפה בסרטון
              </Button>
            </Link>
          </Box>
        );

      case 'download':
        return (
          <Box key={item.id} className="info-content__download">
            <Typography variant="h6" className="info-content__download-title">
              <DownloadIcon />
              {item.title}
            </Typography>
            <Link
              href={item.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="info-content__download-link"
            >
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                className="info-content__download-button"
              >
                {item.downloadLabel || 'הורד קובץ'}
              </Button>
            </Link>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box className="info-content" dir="rtl">
      {content.map((item) => renderContent(item))}
    </Box>
  );
};

export default InfoContentRenderer;
