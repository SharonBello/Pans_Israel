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
  Psychology as PsychologyIcon,
  CheckCircleOutline as CheckIcon,
  Warning as WarningIcon,
  ArrowBack as ArrowIcon,
  Favorite as HeartIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';
import { CBI_CITATION, PANS_NORMS } from '@/types/cbiScale';
import './CBIHomePage.scss';

const CBIHomePage: React.FC = () => {
  const [openDisclaimer, setOpenDisclaimer] = useState(false);
  const navigate = useNavigate();

  const handleStartScale = () => setOpenDisclaimer(true);
  const handleCloseDisclaimer = () => setOpenDisclaimer(false);

  const handleConfirmStart = () => {
    setOpenDisclaimer(false);
    navigate('/scales/cbi/form');
  };

  return (
    <Box className="cbi-homepage">
      <Container maxWidth="md" className="cbi-homepage__container">
        {/* Hero Section */}
        <Paper elevation={3} className="cbi-homepage__hero">
          <Box className="hero-badge">
            <ScienceIcon sx={{ color: '#9B59B6', mr: 1 }} />
            <Typography variant="caption" sx={{ color: '#9B59B6', fontWeight: 'bold' }}>
              מאומת ל-PANS
            </Typography>
          </Box>

          <Box className="hero-icon">
            <HeartIcon sx={{ fontSize: 60, color: '#9B59B6' }} />
          </Box>

          <Typography variant="h3" component="h1" className="hero-title">
            שאלון עומס המטפל (CBI)
          </Typography>

          <Typography variant="h6" className="hero-subtitle">
            כלי להערכת העומס הרגשי, הפיזי והחברתי של הורים לילדים עם פאנס/פאנדס
          </Typography>

          <Box className="hero-stats">
            <Box className="stat">
              <Typography variant="h4">24</Typography>
              <Typography variant="caption">פריטים</Typography>
            </Box>
            <Box className="stat">
              <Typography variant="h4">5</Typography>
              <Typography variant="caption">תחומים</Typography>
            </Box>
            <Box className="stat">
              <Typography variant="h4">104</Typography>
              <Typography variant="caption">ילדי PANS במחקר</Typography>
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

        {/* For Parents Alert */}
        <Alert
          severity="info"
          icon={<HeartIcon />}
          className="cbi-homepage__parent-message"
        >
          <Typography variant="body2">
            <strong>להורים:</strong> הטיפול בילד עם פאנס/פאנדס יכול להיות מאתגר מאוד.
            השאלון הזה נועד לעזור לכם לזהות את תחומי העומס ולפנות לקבלת תמיכה כשצריך.
            אתם לא לבד.
          </Typography>
        </Alert>

        {/* PANS Validation Info */}
        <Alert
          severity="success"
          icon={<ScienceIcon />}
          className="cbi-homepage__validation"
        >
          <Typography variant="body2">
            <strong>מאומת ל-PANS:</strong> השאלון עבר תיקוף מחקרי ספציפי להורים לילדים
            עם PANS באוניברסיטת סטנפורד (Farmer et al., 2018). הממוצע בקרב 104 הורים
            לילדי PANS היה {PANS_NORMS.mean} נקודות.
          </Typography>
        </Alert>

        {/* Info Section */}
        <Paper elevation={2} className="cbi-homepage__info">
          <Typography variant="h5" gutterBottom>
            על שאלון עומס המטפל
          </Typography>

          <Typography variant="body1" paragraph>
            שאלון עומס המטפל (Caregiver Burden Inventory - CBI) פותח על ידי Novak & Guest (1989)
            ומודד את ההשפעות השליליות של הטיפול במישהו יקר על חיי המטפל.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            5 תחומי עומס:
          </Typography>

          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="תלות בזמן (5 פריטים)"
                secondary="עומס הנובע מהגבלת הזמן האישי שלך"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="התפתחותי (5 פריטים)"
                secondary='תחושה של "פספוס" בחיים בהשוואה לבני גילך'
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="בריאות גופנית (4 פריטים)"
                secondary="ההשפעה על בריאותך הפיזית"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="בריאות רגשית (5 פריטים)"
                secondary="רגשות שליליים שעלולים להתעורר"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="יחסים חברתיים (5 פריטים)"
                secondary="השפעה על מערכות יחסים"
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            סולם הדירוג (0-4):
          </Typography>

          <Box className="rating-scale">
            <Box className="rating-item">
              <Typography variant="subtitle2" sx={{ color: '#4CAF50' }}>0 - אף פעם</Typography>
            </Box>
            <Box className="rating-item">
              <Typography variant="subtitle2" sx={{ color: '#8BC34A' }}>1 - לעתים רחוקות</Typography>
            </Box>
            <Box className="rating-item">
              <Typography variant="subtitle2" sx={{ color: '#FFC107' }}>2 - לפעמים</Typography>
            </Box>
            <Box className="rating-item">
              <Typography variant="subtitle2" sx={{ color: '#FF9800' }}>3 - לעתים קרובות</Typography>
            </Box>
            <Box className="rating-item">
              <Typography variant="subtitle2" sx={{ color: '#F44336' }}>4 - כמעט תמיד</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>נקודת חתך קלינית:</strong> ציון מעל 36 מצביע על צורך בשירותי הקלה (respite).
              הממוצע בקרב הורים לילדי PANS הוא 36.7 נקודות - כלומר, רוב ההורים חווים עומס משמעותי.
            </Typography>
          </Alert>
        </Paper>

        {/* Attribution */}
        <Paper elevation={1} className="cbi-homepage__attribution">
          <Typography variant="subtitle2" gutterBottom>
            ייחוס:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>מקור:</strong> {CBI_CITATION.original.authors} ({CBI_CITATION.original.year}).
            {' '}{CBI_CITATION.original.title}. {CBI_CITATION.original.journal}, {CBI_CITATION.original.volume}, {CBI_CITATION.original.pages}.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <strong>תיקוף ל-PANS:</strong> {CBI_CITATION.pansValidation.authors} ({CBI_CITATION.pansValidation.year}).
            {' '}{CBI_CITATION.pansValidation.title}. {CBI_CITATION.pansValidation.journal}, {CBI_CITATION.pansValidation.volume}, {CBI_CITATION.pansValidation.pages}.
            {' '}
            <Link
              href={`https://pmc.ncbi.nlm.nih.gov/articles/${CBI_CITATION.pansValidation.pmcid}/`}
              target="_blank"
              rel="noopener"
            >
              PMC{CBI_CITATION.pansValidation.pmcid}
            </Link>
          </Typography>
        </Paper>

        {/* Disclaimer Modal */}
        <Modal open={openDisclaimer} onClose={handleCloseDisclaimer}>
          <Box className="disclaimer-modal">
            <Typography variant="h5" gutterBottom className="modal-title">
              לפני שמתחילים
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <HeartIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 18 }} />
                השאלון הזה מיועד <strong>לכם - ההורים</strong>. הוא לא מודד את מצב הילד,
                אלא את ההשפעה של הטיפול עליכם.
              </Typography>
            </Alert>

            <Typography variant="body1" paragraph>
              שאלון עומס המטפל בודק כיצד הטיפול בילדכם משפיע על תחומים שונים בחייכם.
            </Typography>

            <Typography variant="body1" paragraph>
              <strong>חשוב לדעת:</strong> עומס גבוה הוא תגובה נורמלית לטיפול בילד עם פאנס/פאנדס.
              מטרת השאלון היא לעזור לכם לזהות תחומים שבהם אתם צריכים תמיכה נוספת.
            </Typography>

            <List dense>
              <ListItem>
                <ListItemText primary="• ענו על 24 שאלות קצרות" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• דרגו כל שאלה לפי התדירות (0-4)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• משך הזמן: כ-5 דקות" />
              </ListItem>
            </List>

            <Box className="modal-buttons">
              <Button
                variant="contained"
                onClick={handleConfirmStart}
                size="large"
                endIcon={<ArrowIcon sx={{ transform: 'rotate(180deg)' }} />}
                sx={{ backgroundColor: '#9B59B6', '&:hover': { backgroundColor: '#8E44AD' } }}
              >
                הבנתי, התחל
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

export default CBIHomePage;
