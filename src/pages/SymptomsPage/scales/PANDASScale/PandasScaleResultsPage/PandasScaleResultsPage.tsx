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
  savedDocId?: string;
}

// Helper function to sum top 5 domain ratings
const sumTop5 = (arr: number[]) =>
  [...arr].sort((a, b) => b - a).slice(0, 5).reduce((sum, v) => sum + v, 0);

const PandasScaleResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ResultsState | undefined;

  if (!state) {
    navigate('/scales/pandas');
    return null;
  }

  const { formData, savedDocId } = state;
  const { ocdSymptoms, associatedSymptoms, functionalImpairment } = formData;

  // ===== 1. OCD Calculations for each timeframe =====
  const maxOCD_before = Math.max(...ocdSymptoms.map((s) => s.ratingBefore));
  const maxOCD_after = Math.max(...ocdSymptoms.map((s) => s.ratingAfter));
  const maxOCD_current = Math.max(...ocdSymptoms.map((s) => s.ratingCurrent));

  const scoreOCD_before = maxOCD_before * 5;
  const scoreOCD_after = maxOCD_after * 5;
  const scoreOCD_current = maxOCD_current * 5;

  // ===== 2. NP Domain Calculations =====
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

  // Get max rating for each domain and timeframe
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

  // ===== 3. Functional Impairment Calculations =====
  const func = functionalImpairment[0];
  const func_before = func.ratingBefore * 10;
  const func_after = func.ratingAfter * 10;
  const func_current = func.ratingCurrent * 10;

  // ===== 4. Total Symptoms (OCD + Associated) =====
  const totalSymp_before = scoreOCD_before + scoreAssoc_before;
  const totalSymp_after = scoreOCD_after + scoreAssoc_after;
  const totalSymp_current = scoreOCD_current + scoreAssoc_current;

  // ===== 5. Total Score (Total Symptoms + Functional) =====
  const totalScore_before = totalSymp_before + func_before;
  const totalScore_after = totalSymp_after + func_after;
  const totalScore_current = totalSymp_current + func_current;

  return (
    <Container maxWidth="lg" sx={{ py: 4, direction: 'rtl' }} className="results-container">
      <Typography variant="h4" gutterBottom align="center">
        תוצאות מדד פאנס/פאנדס
      </Typography>

      {savedDocId && (
        <Typography
          variant="caption"
          color="success.main"
          sx={{ display: 'block', textAlign: 'center', mb: 2 }}
        >
          ✓ התוצאות נשמרו בהצלחה
        </Typography>
      )}

      {/* ===== Personal Results ===== */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }} className="results-title">
        התוצאות שלך:
      </Typography>

      <Table className="results-table printable-area" sx={{ mb: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                backgroundColor: '#717DBC',
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              תחום / סימפטום
            </TableCell>
            <TableCell
              sx={{
                backgroundColor: '#717DBC',
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              שבוע לפני הופעה ראשונה
            </TableCell>
            <TableCell
              sx={{
                backgroundColor: '#717DBC',
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              שבוע אחרי הופעה ראשונה
            </TableCell>
            <TableCell
              sx={{
                backgroundColor: '#717DBC',
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              7 ימים אחרונים
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {/* Row 1: OCD Summary */}
          <TableRow className="worst-ocd-symptoms">
            <TableCell sx={{ textAlign: 'right', fontWeight: 'bold' }}>
              תסמיני OCD (0–25) <br />
              (5 × החמור ביותר של תסמיני ה-OCD)
            </TableCell>
            <TableCell align="center">{scoreOCD_before}</TableCell>
            <TableCell align="center">{scoreOCD_after}</TableCell>
            <TableCell align="center">{scoreOCD_current}</TableCell>
          </TableRow>

          {/* Row 2: NP Header */}
          <TableRow>
            <TableCell
              colSpan={4}
              sx={{ fontWeight: 'bold', fontSize: '0.95rem', textAlign: 'right' }}
            >
              תסמינים נוירו-פסיכיאטריים נלווים (0–25) <br />
              (סכום חמשת התחומים החמורים מתוך 7 תחומי ה-NP)
            </TableCell>
          </TableRow>

          {/* Rows 3-13: Domain Details */}
          {allDomains.map((domainKey) => {
            const labelHeb = NP_DOMAIN_LABELS[domainKey];
            const rb = domainRatingsBefore[domainKey];
            const ra = domainRatingsAfter[domainKey];
            const rc = domainRatingsCurrent[domainKey];

            return (
              <TableRow key={domainKey} className="domain-container">
                <TableCell sx={{ textAlign: 'right' }}>{labelHeb}</TableCell>
                <TableCell align="center">{rb}</TableCell>
                <TableCell align="center">{ra}</TableCell>
                <TableCell align="center">{rc}</TableCell>
              </TableRow>
            );
          })}

          {/* NP Summary Row */}
          <TableRow className="results-table__summary-associated">
            <TableCell sx={{ textAlign: 'right' }}>
              סך תסמינים NP (חמשת התחומים החמורים ביותר)
            </TableCell>
            <TableCell align="center">{scoreAssoc_before}</TableCell>
            <TableCell align="center">{scoreAssoc_after}</TableCell>
            <TableCell align="center">{scoreAssoc_current}</TableCell>
          </TableRow>

          {/* Total Symptoms Row */}
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

          {/* Functional Impairment Row */}
          <TableRow>
            <TableCell sx={{ textAlign: 'right', fontWeight: 'bold' }}>
              פגיעה תפקודית (0–50)
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              {func_before}
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              {func_after}
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              {func_current}
            </TableCell>
          </TableRow>

          {/* Final Total Score Row */}
          <TableRow className="results-table__summary-totalscore">
            <TableCell
              sx={{
                backgroundColor: '#E3E3E5',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                textAlign: 'right',
              }}
            >
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

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2, mb: 4 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/scales/pandas')}
          className="return-to-start-btn"
        >
          חזרה להתחלה
        </Button>
        <Button
          variant="contained"
          onClick={() => window.print()}
          className="print-results-btn"
        >
          הדפס תוצאות
        </Button>
      </Box>

      {/* Note: Community Chart has been moved to the Scales Page */}
    </Container>
  );
};

export default PandasScaleResultsPage;
