import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
} from '@mui/material';
import {
  type PansFormData,
  type NPDomainKey,
  NP_DOMAIN_LABELS,
} from '../../../../../types/pandasScale';
import './PandasScaleResultsPage.scss';

interface ResultsState {
  formData: PansFormData;
}

// פונקציה עזר לחישוב סכום ה־5 התחומים החמורים ביותר מתוך מערך מספרים
const sumTop5 = (arr: number[]) =>
  [...arr].sort((a, b) => b - a).slice(0, 5).reduce((sum, v) => sum + v, 0);

const PandasScaleResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ResultsState | undefined;

  if (!state) {
    navigate('/');
    return null;
  }

  const { formData } = state;
  const { ocdSymptoms, associatedSymptoms, functionalImpairment } = formData;

  // ===== 1. חישובי OCD לכל טווח =====
  const maxOCD_before = Math.max(...ocdSymptoms.map((s) => s.ratingBefore));
  const maxOCD_after = Math.max(...ocdSymptoms.map((s) => s.ratingAfter));
  const maxOCD_current = Math.max(...ocdSymptoms.map((s) => s.ratingCurrent));

  const scoreOCD_before = maxOCD_before * 5;
  const scoreOCD_after = maxOCD_after * 5;
  const scoreOCD_current = maxOCD_current * 5;

  // ===== 2. חישובי NP domains מתוך SubSymptom =====
  // כל מפתחות התחומים
  const allDomains: NPDomainKey[] = [
    'anxiety',
    'moodiness',
    'irritability',
    'cognitive',
    'regression',
    'sensory',
    'hallucinations',
    'motor',
    'urinary',
    'sleep',
    'pupil',
  ];

  // מושכים את הדירוג המקסימלי לכל תחום ולכל טווח
  const domainRatingsBefore: Record<NPDomainKey, number> = {} as any;
  const domainRatingsAfter: Record<NPDomainKey, number> = {} as any;
  const domainRatingsCurrent: Record<NPDomainKey, number> = {} as any;

  allDomains.forEach((domainKey) => {
    const subs = associatedSymptoms.filter((s) => s.domain === domainKey);
    domainRatingsBefore[domainKey] =
      subs.length > 0 ? Math.max(...subs.map((s) => s.ratingBefore)) : 0;
    domainRatingsAfter[domainKey] =
      subs.length > 0 ? Math.max(...subs.map((s) => s.ratingAfter)) : 0;
    domainRatingsCurrent[domainKey] =
      subs.length > 0 ? Math.max(...subs.map((s) => s.ratingCurrent)) : 0;
  });

  const scoreAssoc_before = sumTop5(Object.values(domainRatingsBefore));
  const scoreAssoc_after = sumTop5(Object.values(domainRatingsAfter));
  const scoreAssoc_current = sumTop5(Object.values(domainRatingsCurrent));

  // ===== 3. חישובי פגיעה תפקודית לכל טווח =====
  const func = functionalImpairment[0];
  const func_before = func.ratingBefore * 10;
  const func_after = func.ratingAfter * 10;
  const func_current = func.ratingCurrent * 10;

  // ===== 4. TOTAL SYMPTOMS (OCD + Associated) לכל טווח =====
  const totalSymp_before = scoreOCD_before + scoreAssoc_before;
  const totalSymp_after = scoreOCD_after + scoreAssoc_after;
  const totalSymp_current = scoreOCD_current + scoreAssoc_current;

  // ===== 5. TOTAL SCORE (TOTAL SYMPTOMS + Functional) לכל טווח =====
  const totalScore_before = totalSymp_before + func_before;
  const totalScore_after = totalSymp_after + func_after;
  const totalScore_current = totalSymp_current + func_current;

  return (
    <Container maxWidth="lg" sx={{ py: 4, direction: 'rtl' }} className='results-container'>
      <Typography variant="h4" gutterBottom align="center">
        תוצאות מדד פאנס/פאנדס
      </Typography>

      <Table className="results-table printable-area" sx={{ mb: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: '#717DBC', color: '#FFF', fontWeight: 'bold', fontSize: '1rem' }}>
              תחום / סימפטום
            </TableCell>
            <TableCell sx={{ backgroundColor: '#717DBC', color: '#FFF', fontWeight: 'bold', fontSize: '1rem' }}>
              שבוע לפני הופעה ראשונה
            </TableCell>
            <TableCell sx={{ backgroundColor: '#717DBC', color: '#FFF', fontWeight: 'bold', fontSize: '1rem' }}>
              שבוע אחרי הופעה ראשונה
            </TableCell>
            <TableCell sx={{ backgroundColor: '#717DBC', color: '#FFF', fontWeight: 'bold', fontSize: '1rem' }}>
              7 ימים אחרונים
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {/** ===== שורה 1: OCD (סיכום) ===== */}
          <TableRow className='worst-ocd-symptoms'>
            <TableCell sx={{ textAlign: 'right', fontWeight: 'bold' }}>
              תסמיני OCD (0–25) <br />
              (5 × החמור ביותר של תסמיני ה-OCD)
            </TableCell>
            <TableCell align="center">{scoreOCD_before}</TableCell>
            <TableCell align="center">{scoreOCD_after}</TableCell>
            <TableCell align="center">{scoreOCD_current}</TableCell>
          </TableRow>

          {/** ===== שורה 2: NP (כותרת ראשית) ===== */}
          <TableRow>
            <TableCell colSpan={4} sx={{ fontWeight: 'bold', fontSize: '0.95rem', textAlign: 'right' }} >
              תסמינים נוירו-פסיכיאטריים נלווים (0–25) <br />
              (סכום חמשת התחומים החמורים מתוך 7 תחומי ה-NP)
            </TableCell>
          </TableRow>

          {/** ===== שורות 3–13: כל אחד מ־11 התחומים הראשיים ושיעורו בכל טווח ===== */}
          {allDomains.map((domainKey) => {
            const labelHeb = NP_DOMAIN_LABELS[domainKey];
            const rb = domainRatingsBefore[domainKey];
            const ra = domainRatingsAfter[domainKey];
            const rc = domainRatingsCurrent[domainKey];

            return (
              <TableRow key={domainKey} className='domain-container'>
                <TableCell sx={{ textAlign: 'right' }}>{labelHeb}</TableCell>
                <TableCell align="center">{rb}</TableCell>
                <TableCell align="center">{ra}</TableCell>
                <TableCell align="center">{rc}</TableCell>
              </TableRow>
            );
          })}

          {/** ===== שורת סיכום NP: סכום 5 התחומים החמורים ביותר ===== */}
          <TableRow className="results-table__summary-associated">
            <TableCell sx={{ textAlign: 'right' }}>
              סך תסמינים NP (חמשת התחומים החמורים ביותר)
            </TableCell>
            <TableCell align="center">
              {scoreAssoc_before}
            </TableCell>
            <TableCell align="center">
              {scoreAssoc_after}
            </TableCell>
            <TableCell align="center">
              {scoreAssoc_current}
            </TableCell>
          </TableRow>

          <TableRow className="results-table__summary-totalsymptoms">
            <TableCell sx={{ textAlign: 'right', fontWeight: 'bold' }}>
              סך כל הסימפטומים (0–50)
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              {totalSymp_before}
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              {totalSymp_after}
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              {totalSymp_current}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ textAlign: 'right', fontWeight: 'bold' }}>
              פגיעה תפקודית (0–50)
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>{func_before}</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>{func_after}</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>{func_current}</TableCell>
          </TableRow>

          <TableRow className="results-table__summary-totalscore">
            <TableCell
              sx={{
                backgroundColor: '#E3E3E5',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                textAlign: 'right',
              }}>
              מדד פאנס/פאנדס (0–100)
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              {totalScore_before}
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              {totalScore_after}
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              {totalScore_current}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/** ===== לחצני פעולה ===== */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/')} className='return-to-start-btn'>
          חזרה להתחלה
        </Button>
        <Button variant="contained" onClick={() => window.print()} className='print-results-btn'>
          הדפס תוצאות
        </Button>
      </Box>
    </Container>
  );
};

export default PandasScaleResultsPage;