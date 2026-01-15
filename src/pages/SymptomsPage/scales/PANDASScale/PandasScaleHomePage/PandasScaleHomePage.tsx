import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Modal,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';
import './PandasScaleHomePage.scss';
import { useTranslation } from 'react-i18next';

const PandasScaleHomePage: React.FC = () => {
  const { t } = useTranslation();
  const [openInfo, setOpenInfo] = useState(false);
  const [openExplanation, setOpenExplanation] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setOpenInfo(false);

  const handleStartScale = () => setOpenExplanation(true);
  const handleCloseExplanation = () => setOpenExplanation(false);
  const handleConfirmStart = () => {
    setOpenExplanation(false);
    navigate('/scales/pandas/scales-page');
  };

  return (
    <Box className="homepage-root">
      <Box className="homepage-hero">
        <Container maxWidth="md" className="hero-content">
          <Typography variant="h2" className="hero-title">
            {t("home.title")}
          </Typography>
          <Typography variant="h6" className="hero-subtitle">
            {t("home.subtitle")}
          </Typography>
          <Box className="hero-buttons">
            <Button
              onClick={handleStartScale}
              variant="contained"
              className="hero-button"
              size="large"
            >
              התחל מדד
            </Button>
            <IconButton color="inherit" onClick={() => setOpenInfo(true)} aria-label={t("home.infoAria")}>
              <InfoIcon fontSize="large" />
            </IconButton>
          </Box>
        </Container>
        <Modal open={openInfo} onClose={() => setOpenInfo(false)}>
          <Box className="info-modal">
            <Typography variant="h5" className="modal-title" gutterBottom>
              {t("home.modal.title")}
            </Typography>
            <Typography variant="body1" className="modal-text">
              1. סמנו דירוג (0–5) עבור תסמיני OCD.<br />
              2. סמנו דירוג (0–5) עבור תסמינים נלווים (14 פריטים), קחו את חמשת הערכים הגבוהים וסכמו ⇒ 0–25.<br />
              3. סמנו דירוג (0–5) לפגיעה תפקודית והכפילו ב־10 ⇒ 0–50.<br />
              4. בסיום לחצו "חשב ניקוד" ותועברו לעמוד התוצאות.
            </Typography>
            <Button variant="outlined" onClick={handleClose} className="modal-close">
              סגור
            </Button>
          </Box>
        </Modal>

        {/* Modal הסבר על שאלון פאנס/פנדס */}
        <Modal open={openExplanation} onClose={handleCloseExplanation}>
          <Box className="explanation-modal">
            <Typography gutterBottom className="modal-title">
              הסבר על שאלון פאנס/פנדס
            </Typography>

            <Typography className="modal-text" sx={{ mb: 3 }}>
              שאלון זה, שפותח בגרסתו הנוכחית בשנת 2012, מבוסס על ניסיונם הקליני של ד"ר סוזן סוודו, ד"ר מירוסלב קובצ'ביק, ד"ר בת' לטימר וד"ר ג'יימס לקמן, ונוצר בסיועם של הורים ואנשי מקצוע.
            </Typography>

            <Typography className="modal-subtitle" sx={{ mb: 2 }}>
              מטרת השאלון:
            </Typography>
            <Typography className="modal-text" sx={{ mb: 3 }}>
              השאלון נועד לספק להורים ולאנשי מקצוע כלי סטנדרטי ואחיד, באמצעותו ניתן לדרג ולעקוב אחר חומרת התסמינים של הילד/ה לאורך זמן. תפקידו המרכזי הוא לאפשר השוואה בין המצב הנוכחי לבין התקופה שלפני הופעת התסמינים והשבוע שלאחריה, ובכך לסייע בזיהוי שינויים במצב.
              במהלך מילוי השאלון תתבקשו לדרג מגוון תסמינים – החל מתסמיני ליבה טורדניים-כפייתיים (OCD) ועד לתסמינים נלווים כמו חרדה, רגרסיה התנהגותית וקשיי למידה – בסולם חומרה שבין 0 (כלל לא) ל-5 (חמור ביותר).
              חשוב לציין כי אף שזהו כלי מוכר ובעל ערך, ייתכן שימוש בכלים קליניים ושאלונים נוספים לצורך הערכת פאנס/פנדס.
              <br />
              <a
                href="https://pandasnetwork.org/wp-content/uploads/2018/11/pandas_pans_scale.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="external-link"
              >
                המדד המקורי
              </a>
            </Typography>
            <Box className="warning-box" sx={{ mb: 4 }}>
              <Typography className="warning-title">
                הבהרה חשובה
              </Typography>
              <Typography className="warning-text">
                שאלון זה הינו כלי למעקב אחר תסמינים בלבד ואינו מהווה תחליף לאבחון רפואי. יש להשתמש בתוצאותיו כדי לסייע בניהול שיחה מעמיקה ומבוססת מידע עם איש מקצוע מוסמך. השאלון אינו מחליף הערכה רפואית מקיפה, אבחנה או תוכנית טיפול מקצועית.
              </Typography>
            </Box>

            <Box className="modal-buttons">
              <Button
                variant="contained"
                onClick={handleConfirmStart}
                className="confirm-button"
                size="large"
              >
                הבנתי, התחל שאלון
              </Button>
              <Button
                variant="outlined"
                onClick={handleCloseExplanation}
                className="cancel-button"
                size="large"
              >
                ביטול
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default PandasScaleHomePage;
