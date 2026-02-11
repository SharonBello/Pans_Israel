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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Timeline as TimelineIcon,
  CheckCircleOutline as CheckIcon,
  Warning as WarningIcon,
  ArrowBack as ArrowIcon,
  TrendingUp as TrendingIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import './PTECHomePage.scss';

const PTECHomePage: React.FC = () => {
  const [openExplanation, setOpenExplanation] = useState(false);
  const navigate = useNavigate();

  const handleStartScale = () => setOpenExplanation(true);
  const handleCloseExplanation = () => setOpenExplanation(false);

  const handleConfirmStart = () => {
    setOpenExplanation(false);
    navigate('/scales/ptec/form');
  };

  return (
    <Box className="ptec-homepage">
      <Container maxWidth="md" className="ptec-homepage__container">
        {/* Hero Section */}
        <Paper elevation={3} className="ptec-homepage__hero">
          <Box className="hero-icon">
            <TimelineIcon sx={{ fontSize: 60, color: '#00CEC9' }} />
          </Box>

          <Typography variant="h3" component="h1" className="hero-title">
            שאלון PTEC
          </Typography>

          <Typography variant="h6" className="hero-subtitle">
            כלי למעקב אחר תסמינים לאורך זמן
          </Typography>

          <Chip
            label="0-306 נקודות"
            sx={{ mb: 2, backgroundColor: 'rgba(0, 206, 201, 0.1)', color: '#00CEC9' }}
          />

          <Box className="hero-features">
            <Box className="feature">
              <TrendingDownIcon color="success" />
              <Typography>מעקב שיפור</Typography>
            </Box>
            <Box className="feature">
              <TrendingIcon color="warning" />
              <Typography>זיהוי החמרה</Typography>
            </Box>
            <Box className="feature">
              <TimelineIcon color="info" />
              <Typography>השוואת תקופות</Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={handleStartScale}
            className="start-button"
          >
            התחל שאלון
          </Button>
        </Paper>

        {/* Critical Disclaimer */}
        <Alert severity="warning" className="ptec-homepage__critical-disclaimer">
          <Typography variant="body1" fontWeight="bold" gutterBottom>
            ⚠️ הבהרה חשובה
          </Typography>
          <Typography variant="body2">
            שאלון PTEC <strong>אינו כלי אבחוני</strong>. הוא מיועד למעקב והשוואת תסמינים בשתי נקודות זמן או יותר - 
            למשל לפני ואחרי טיפול, או בין תקופת התלקחות לתקופת יציבות.
          </Typography>
        </Alert>

        {/* Info Section */}
        <Paper elevation={2} className="ptec-homepage__info">
          <Typography variant="h5" gutterBottom>
            על שאלון PTEC
          </Typography>

          <Typography variant="body1" paragraph>
            שאלון PTEC (פאנס/פאנדס Treatment and Flare Evaluation Checklist) פותח על ידי
            קרן Neuroimmune Foundation ככלי למעקב אחר שינויים בתסמינים לאורך זמן.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            למה מיועד השאלון:
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="השוואת תסמינים לפני ואחרי טיפול"
                secondary="מאפשר לראות האם הטיפול עוזר"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="מעקב אחר התלקחויות מול תקופות יציבות"
                secondary="זיהוי דפוסים וטריגרים"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="תיעוד מדידות בסיס"
                secondary="יצירת נקודת התייחסות להשוואה עתידית"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="תקשורת עם הצוות הרפואי"
                secondary="מידע מובנה לשיתוף עם רופאים"
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            10 קטגוריות תסמינים:
          </Typography>

          <Box className="category-chips">
            <Chip label="התנהגות/מצב רוח" />
            <Chip label="OCD" />
            <Chip label="חרדה" />
            <Chip label="אכילה" />
            <Chip label="טיקים" />
            <Chip label="קוגניטיבי" />
            <Chip label="חושי" />
            <Chip label="שינה" />
            <Chip label="בריאות" />
            <Chip label="אחר" />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            פירוש הציון (0-306):
          </Typography>

          <Box className="score-ranges">
            <Box className="score-range" sx={{ borderColor: '#4CAF50' }}>
              <Typography variant="subtitle2" sx={{ color: '#4CAF50' }}>0-30</Typography>
              <Typography variant="caption">מינימלי</Typography>
            </Box>
            <Box className="score-range" sx={{ borderColor: '#8BC34A' }}>
              <Typography variant="subtitle2" sx={{ color: '#8BC34A' }}>31-75</Typography>
              <Typography variant="caption">קל</Typography>
            </Box>
            <Box className="score-range" sx={{ borderColor: '#FFC107' }}>
              <Typography variant="subtitle2" sx={{ color: '#FFC107' }}>76-150</Typography>
              <Typography variant="caption">בינוני</Typography>
            </Box>
            <Box className="score-range" sx={{ borderColor: '#FF9800' }}>
              <Typography variant="subtitle2" sx={{ color: '#FF9800' }}>151-225</Typography>
              <Typography variant="caption">חמור</Typography>
            </Box>
            <Box className="score-range" sx={{ borderColor: '#F44336' }}>
              <Typography variant="subtitle2" sx={{ color: '#F44336' }}>226-306</Typography>
              <Typography variant="caption">קיצוני</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Explanation Modal */}
        <Modal open={openExplanation} onClose={handleCloseExplanation}>
          <Box className="explanation-modal">
            <Typography variant="h5" gutterBottom className="modal-title">
              לפני שמתחילים
            </Typography>

            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="body2" fontWeight="bold">
                <WarningIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 18 }} />
                שאלון זה אינו כלי אבחוני!
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                הוא מיועד למעקב והשוואת תסמינים בלבד, ואינו מחליף ייעוץ רפואי מקצועי.
              </Typography>
            </Alert>

            <Typography variant="body1" paragraph>
              שאלון PTEC נועד לעזור לכם לעקוב אחר שינויים בתסמינים לאורך זמן.
              ציון גבוה יותר מצביע על תסמינים חמורים יותר.
            </Typography>

            <Typography variant="body1" paragraph>
              <strong>מומלץ למלא על ידי אותו אדם בכל פעם</strong> (הורה, מטופל או מורה)
              כדי לשמור על עקביות בהערכה.
            </Typography>

            <Typography variant="body1" paragraph>
              <strong>השאלון כולל:</strong>
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="• פרטי רקע (גיל, מצב נוכחי)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• 10 קטגוריות של תסמינים (~102 פריטים)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• דירוג כל תסמין ב-4 רמות (0-3)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• זמן מילוי משוער: 10-15 דקות" />
              </ListItem>
            </List>

            <Box className="modal-buttons">
              <Button
                variant="contained"
                onClick={handleConfirmStart}
                size="large"
                endIcon={<ArrowIcon sx={{ transform: 'rotate(180deg)' }} />}
                sx={{ backgroundColor: '#00CEC9', '&:hover': { backgroundColor: '#00b3ae' } }}
              >
                הבנתי, התחל שאלון
              </Button>
              <Button variant="outlined" onClick={handleCloseExplanation} size="large">
                ביטול
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default PTECHomePage;
