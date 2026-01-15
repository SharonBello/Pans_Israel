import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RatingValue, SymptomGroup } from '../../types/pansTypes';
import SymptomRating from '../SymptomRating/SymptomRating';

interface AssociatedSectionProps {
  items: SymptomGroup[];
  onItemChange: (
    id: string,
    field: 'before' | 'after' | 'current',
    value: RatingValue
  ) => void;
  currentIndex?: number;
  total?: number;
}

const AssociatedSectionWithTimeline: React.FC<AssociatedSectionProps> = ({ items, onItemChange, currentIndex = 0, total = 0, }) => {
  const {t} = useTranslation()

  return (
    <Box sx={{ mb: 4, direction: 'rtl' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          II. תסמינים נלווים (0–5 בכל טווח זמן)
        </Typography>
        {total > 0 && (
          <Typography variant="h6" color="textSecondary">
            {`שאלה ${currentIndex + 1} מתוך ${total}`}
          </Typography>
        )}
      </Box>

      {/* טבלה עם כל הסימפטומים ה־Associated וה־Sliders שלהם */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: 'bold', width: '35%' }}>
              {t('associatedSection.column.topic')}
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', width: '20%' }}>
              {t('timelines.beforeFirstWeek')}
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', width: '20%' }}>
              {t('timelines.afterFirstWeek')}
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', width: '20%' }}>
              {t('timelines.last7Days')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell sx={{ textAlign: 'right' }}>
                <Typography variant="body2">{t(`associated.${item.id}.label`)}</Typography>
              </TableCell>

              <TableCell>
                <SymptomRating
                  id={`${item.id}_before`}
                  label=""
                  ratingBefore={item.ratingBefore}
                  ratingAfter={0}
                  ratingCurrent={0}
                  showSingle="before"
                  onChange={(id, field, value) => {
                    onItemChange(item.id, field, value);
                  }}
                />
              </TableCell>
              <TableCell>
                <SymptomRating
                  id={`${item.id}_after`}
                  label=""
                  ratingBefore={0}
                  ratingAfter={item.ratingAfter}
                  ratingCurrent={0}
                  showSingle="after"
                  onChange={(id, field, value) => {
                    onItemChange(item.id, field, value);
                  }}
                />
              </TableCell>
              <TableCell>
                <SymptomRating
                  id={`${item.id}_current`}
                  label=""
                  ratingBefore={0}
                  ratingAfter={0}
                  ratingCurrent={item.ratingCurrent}
                  showSingle="current"
                  onChange={(id, field, value) => {
                    onItemChange(item.id, field, value);
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default AssociatedSectionWithTimeline;
