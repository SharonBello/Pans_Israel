import React from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControlLabel,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { SymptomGroup, RatingValue } from '../../../../../../types/pandasScale';
import './Sections.scss';

interface FunctionalSectionProps {
  items: SymptomGroup[];
  onItemChange: (id: string, value: RatingValue) => void;
}

// const levelDescriptions: Record<RatingValue, string> = {
//   0: 'אין פגיעה: תפקוד רגיל (לימודים, בית, חברים).',
//   1: 'מינימלית (10): הפרעות בתפקוד יומיומי מינימליות; התנהלות עצמאית.',
//   2: 'קלה (20): קושי קל בלמידה, שינוי קל בהתנהגות או חוסר עניין בפעילות.',
//   3: 'בינונית (30): קושי משמעותי בלימודים, שינוי משמעותי בהתנהגות החברתית, נסיגה מסוימת מחברים ופעילויות.',
//   4: 'חמורה (40): אי יכולת לשוב ללימודים, הימנעות מלאה ממשימות יומיומיות, שינוי מהותי בהתנהגות החברתית.',
//   5: 'קיצונית (50): פגיעה תפקודית קיצונית, חוסר יכולת כמעט מוחלט לבצע פעולות יומיומיות, מצוקה קשה, צורך בסיוע צמוד.',
// };

const FunctionalSection: React.FC<FunctionalSectionProps> = ({ items, onItemChange }) => {
  const { t } = useTranslation();
  const symptom = items[0];

  return (
    <Box sx={{ mb: 4 }}>
      <RadioGroup
        name={symptom.id}
        value={symptom.ratingCurrent.toString()}
        onChange={(e) => onItemChange(symptom.id, parseInt(e.target.value, 10) as RatingValue)}
        sx={{ width: '100%' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                {t('functionalSection.column.description')}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                {t('functionalSection.column.level')}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                {t('functionalSection.column.select')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {([0, 1, 2, 3, 4, 5] as RatingValue[]).map((level) => (
              <TableRow key={level}>
                <TableCell sx={{ textAlign: 'right' }}>
                  {t(`functionalSection.levelDescriptions.${level}`)}
                </TableCell>
                <TableCell align="center">{level}</TableCell>
                <TableCell align="center">
                  <FormControlLabel
                    value={String(level)}
                    control={<Radio size="small" />}
                    label=""
                    sx={{ '& .MuiFormControlLabel-label': { display: 'none' } }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </RadioGroup>

      <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
        {t('functionalSection.caption')}
      </Typography>
    </Box>
  );
};

export default FunctionalSection;
