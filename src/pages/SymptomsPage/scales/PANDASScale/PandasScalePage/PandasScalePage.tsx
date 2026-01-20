import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './PandasScalePage.scss';
import CalculatorForm from '../components/CalculatorForm';

const PandasScalePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md" className="scale-root" dir={t('dir')}>
      <Typography variant="h4" align="center" gutterBottom>
        {t('scalePage.title')}
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        {t('scalePage.explanation')}
      </Typography>

      <Divider sx={{ my: 4 }} />

      {/* Survey Form */}
      <Box className="scale-form-box">
        <CalculatorForm />
      </Box>
    </Container>
  );
};

export default PandasScalePage;
