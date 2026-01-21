import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Modal,
  Paper,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Assessment as AssessmentIcon,
  CheckCircleOutline as CheckIcon,
  Warning as WarningIcon,
  ArrowBack as ArrowIcon,
  Verified as VerifiedIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';
import { PANS31_LICENSE } from '@/types/pans31Scale';
import './PANS31HomePage.scss';

const PANS31HomePage: React.FC = () => {
  const [openDisclaimer, setOpenDisclaimer] = useState(false);
  const navigate = useNavigate();

  const handleStartScale = () => setOpenDisclaimer(true);
  const handleCloseDisclaimer = () => setOpenDisclaimer(false);

  const handleConfirmStart = () => {
    setOpenDisclaimer(false);
    navigate('/scales/pans31/form');
  };

  return (
    <Box className="pans31-homepage">
      <Container maxWidth="md" className="pans31-homepage__container">
        {/* Hero Section */}
        <Paper elevation={3} className="pans31-homepage__hero">
          <Box className="hero-badge">
            <VerifiedIcon sx={{ color: '#4CAF50', mr: 1 }} />
            <Typography variant="caption" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
              מאומת מחקרית
            </Typography>
          </Box>

          <Box className="hero-icon">
            <AssessmentIcon sx={{ fontSize: 60, color: '#717DBC' }} />
          </Box>

          <Typography variant="h3" component="h1" className="hero-title">
            סולם PANS 31-פריטים
          </Typography>

          <Typography variant="h6" className="hero-subtitle">
            כלי הערכה מאומת לזיהוי ומדידת חומרת תסמיני PANS
          </Typography>

          <Box className="hero-stats">
            <Box className="stat">
              <Typography variant="h4">31</Typography>
              <Typography variant="caption">פריטים</Typography>
            </Box>
            <Box className="stat">
              <Typography variant="h4">0.89</Typography>
              <Typography variant="caption">Cronbach's α</Typography>
            </Box>
            <Box className="stat">
              <Typography variant="h4">135</Typography>
              <Typography variant="caption">ילדים במחקר</Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={handleStartScale}
            className="start-button"
          >
            התחל הערכה
          </Button>
        </Paper>

        {/* Validation Alert */}
        <Alert
          severity="success"
          icon={<ScienceIcon />}
          className="pans31-homepage__validation"
        >
          <Typography variant="body2">
            <strong>מאומת מחקרית:</strong> סולם זה עבר תיקוף פסיכומטרי באוניברסיטת סטנפורד
            ואוניברסיטת מינסוטה עם 135 ילדים עם PANS. פורסם ב-Journal of Child and
            Adolescent Psychopharmacology (2024).
          </Typography>
        </Alert>

        {/* Info Section */}
        <Paper elevation={2} className="pans31-homepage__info">
          <Typography variant="h5" gutterBottom>
            על סולם PANS 31-פריטים
          </Typography>

          <Typography variant="body1" paragraph>
            סולם ה-PANS 31-פריטים פותח על ידי ד"ר טניה מרפי (אוניברסיטת דרום פלורידה)
            וד"ר גייל ברנשטיין (אוניברסיטת מינסוטה) כדי לזהות ולמדוד את חומרת
            תסמיני PANS.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            נתוני התיקוף:
          </Typography>

          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="עקביות פנימית גבוהה (Cronbach's α = 0.89)"
                secondary="מעיד על מהימנות גבוהה של הסולם"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="מתאם גבוה עם מדדי פגיעה תפקודית (r = 0.81)"
                secondary="תוקף התכנסות מול Columbia Impairment Scale"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="מבחין בין התלקחות לתקופה יציבה"
                secondary="ציונים גבוהים יותר בזמן התלקחות"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="מתאם עם CY-BOCS (r = 0.66) ו-YGTSS"
                secondary="תוקף התכנסות מול סולמות OCD וטיקים"
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            6 קטגוריות תסמינים:
          </Typography>

          <Box className="category-chips">
            <Chip label="OCD והפרעות אכילה (6)" />
            <Chip label="חרדה ומצב רוח (6)" />
            <Chip label="התנהגות (7)" />
            <Chip label="קוגניטיבי ולימודי (3)" />
            <Chip label="גופני (5)" />
            <Chip label="פסיכוזה וטיקים (4)" />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            סולם הדירוג (0-4):
          </Typography>

          <Box className="rating-scale">
            <Box className="rating-item">
              <Typography variant="subtitle2" sx={{ color: '#4CAF50' }}>0 - אין</Typography>
              <Typography variant="caption">ללא תסמינים</Typography>
            </Box>
            <Box className="rating-item">
              <Typography variant="subtitle2" sx={{ color: '#8BC34A' }}>1 - קל</Typography>
              <Typography variant="caption">הפרעה קלה, לא פוגע בתפקוד</Typography>
            </Box>
            <Box className="rating-item">
              <Typography variant="subtitle2" sx={{ color: '#FFC107' }}>2 - בינוני</Typography>
              <Typography variant="caption">הפרעה ברורה, עדיין ניתנת לניהול</Typography>
            </Box>
            <Box className="rating-item">
              <Typography variant="subtitle2" sx={{ color: '#FF9800' }}>3 - חמור</Typography>
              <Typography variant="caption">הפרעה משמעותית</Typography>
            </Box>
            <Box className="rating-item">
              <Typography variant="subtitle2" sx={{ color: '#F44336' }}>4 - קיצוני</Typography>
              <Typography variant="caption">תסמינים משתקים</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Attribution - Required by License */}
        <Paper elevation={1} className="pans31-homepage__attribution">
          <Typography variant="subtitle2" gutterBottom>
            ייחוס ורישיון:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {PANS31_LICENSE.title} © {PANS31_LICENSE.year} by {PANS31_LICENSE.authors}
            {' '}is licensed under{' '}
            <Link
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
              target="_blank"
              rel="noopener"
            >
              {PANS31_LICENSE.license}
            </Link>
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            מקור: {PANS31_LICENSE.citation}
          </Typography>
          <Typography variant="caption" display="block">
            תיקוף: {PANS31_LICENSE.validation}
          </Typography>
        </Paper>

        {/* Disclaimer Modal */}
        <Modal open={openDisclaimer} onClose={handleCloseDisclaimer}>
          <Box className="disclaimer-modal">
            <Typography variant="h5" gutterBottom className="modal-title">
              לפני שמתחילים
            </Typography>

            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight="bold">
                <WarningIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 18 }} />
                הבהרה חשובה
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                סולם זה הוא כלי הערכה ואינו מהווה תחליף לאבחון רפואי מקצועי.
                יש להתייעץ עם רופא מומחה לקבלת אבחנה וטיפול.
              </Typography>
            </Alert>

            <Typography variant="body1" paragraph>
              סולם PANS 31-פריטים מעריך את חומרת התסמינים <strong>בשבוע האחרון</strong>.
            </Typography>

            <Typography variant="body1" paragraph>
              <strong>מי ממלא:</strong> הסולם מיועד למילוי על ידי הורה או מטפל ראשי
              המכיר היטב את הילד.
            </Typography>

            <Typography variant="body1" paragraph>
              <strong>משך הזמן:</strong> כ-5-10 דקות
            </Typography>

            <List dense>
              <ListItem>
                <ListItemText primary="• דרגו כל תסמין לפי חומרתו (0-4)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• התייחסו לשבוע האחרון בלבד" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• ענו על כל 31 הפריטים" />
              </ListItem>
            </List>

            <Box className="modal-buttons">
              <Button
                variant="contained"
                onClick={handleConfirmStart}
                size="large"
                endIcon={<ArrowIcon sx={{ transform: 'rotate(180deg)' }} />}
                sx={{ backgroundColor: '#717DBC', '&:hover': { backgroundColor: '#5a6499' } }}
              >
                הבנתי, התחל הערכה
              </Button>
              <Button variant="outlined" onClick={handleCloseDisclaimer} size="large">
                ביטול
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default PANS31HomePage;
