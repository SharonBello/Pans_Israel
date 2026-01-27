import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import { IoClose } from 'react-icons/io5';
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import { FaVirus, FaBrain, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './WhatIsPansPandasModal.scss';

interface WhatIsPansPandasModalProps {
  open: boolean;
  onClose: () => void;
}

const WhatIsPansPandasModal: React.FC<WhatIsPansPandasModalProps> = ({
  open,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleNavigateToResources = () => {
    onClose();
    navigate('/info');
  };

  const symptoms = [
    'הופעה פתאומית של טקסים כפייתיים (OCD)',
    'פחדים קיצוניים או חרדה נרחבת (חרדה חברתית, פחדים לא רציונליים)',
    'חוסר יציבות רגשית ודיכאון',
    'טיקים מוטוריים או קוליים',
    'תוקפנות או התפרצויות בלתי מוסברות (קשיי ויסות רגשי)',
    'רגישות מוגברת לאור, קולות או מגע',
    'נסיגה פתאומית ביכולות לימודיות או מוטוריות (ירידה ביכולות כתיבה וריכוז)',
    'רגרסיה התנהגותית (התנהגות לא תואמת גיל, עלייה בהתפרצויות זעם, אובדן שפה המתאימה לגיל, התנהגות "היצמדות" שאינה נובעת מחרדה)',
    'שינויים בשינה או עייפות מוגזמת',
    'סירוב לאכול או הגבלת אכילה משמעותית',
    'כאבי ראש ומפרקים, תכיפות במתן שתן או הרטבה',
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className="pans-pandas-modal"
      dir="rtl"
      scroll="paper"
      PaperProps={{
        className: 'pans-pandas-modal__paper',
      }}
    >
      {/* Header */}
      <DialogTitle className="pans-pandas-modal__header">
        <Box className="pans-pandas-modal__title-wrapper">
          <FaBrain className="pans-pandas-modal__icon" />
          <Typography variant="h5" component="h2" className="pans-pandas-modal__title">
            מה זה פאנס ופאנדס?
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          className="pans-pandas-modal__close"
          aria-label="סגור"
        >
          <IoClose />
        </IconButton>
      </DialogTitle>

      <DialogContent className="pans-pandas-modal__content">
        {/* Acronym Badges */}
        {/* <Box className="pans-pandas-modal__badges">
          <Chip
            icon={<FaVirus />}
            label="PANS - Pediatric Acute-Onset Neuropsychiatric Syndrome"
            className="pans-pandas-modal__badge pans-pandas-modal__badge--pans"
          />
          <Chip
            icon={<FaVirus />}
            label="PANDAS - Pediatric Autoimmune Neuropsychiatric Disorders Associated with Streptococcal Infections"
            className="pans-pandas-modal__badge pans-pandas-modal__badge--pandas"
          />
        </Box> */}

        {/* Main Description */}
        <Box className="pans-pandas-modal__section">
          <Typography className="pans-pandas-modal__text pans-pandas-modal__text--lead">
            פאנס (PANS) ופאנדס (PANDAS) הן תסמונות נוירו־פסיכיאטריות אוטואימוניות בעלות
            התחלה חריפה, המאופיינות בהופעה פתאומית וחמורה של קשת רחבה של סימפטומים
            נוירו־פסיכיאטריים.
          </Typography>
        </Box>

        {/* Mechanism Section */}
        <Box className="pans-pandas-modal__section">
          <Typography className="pans-pandas-modal__subtitle">
            <FaBrain className="pans-pandas-modal__subtitle-icon" />
            מנגנון התסמונת
          </Typography>
          <Typography className="pans-pandas-modal__text">
            התסמונת נובעת ממצב פוסט־זיהומי הפוגע בגרעיני הבסיס במוח (basal ganglia),
            כנראה דרך דלקת חיסונית, ציטוקינים פרו‑דלקתיים ואוטואנטיגנים נגד רקמה עצבית.
            כבר ידוע כי לא רק זיהום בחיידק הסטרפטוקוק יכול לשמש כטריגר להופעת התסמונת,
            אלא גם זיהומים אחרים, לרבות זיהומים וירליים כגון SARS‑CoV‑2.
          </Typography>
        </Box>

        {/* PANS vs PANDAS Difference */}
        <Box className="pans-pandas-modal__comparison">
          <Box className="pans-pandas-modal__comparison-item pans-pandas-modal__comparison-item--pans">
            <Typography className="pans-pandas-modal__comparison-title">
              PANS
            </Typography>
            <Typography className="pans-pandas-modal__comparison-text">
              התגובה החיסונית/דלקתית הלא תקינה שגורמת לתסמינים דווחה ככזו שעלולה להיות
              מופעלת על‑ידי <strong>מגוון רחב של זיהומים שונים</strong>.
            </Typography>
          </Box>
          <Box className="pans-pandas-modal__comparison-item pans-pandas-modal__comparison-item--pandas">
            <Typography className="pans-pandas-modal__comparison-title">
              PANDAS
            </Typography>
            <Typography className="pans-pandas-modal__comparison-text">
              התגובה החריגה מופעלת בעקבות <strong>זיהום סטרפטוקוקי מקבוצה A (GAS)</strong> בלבד.
            </Typography>
          </Box>
        </Box>

        <Divider className="pans-pandas-modal__divider" />

        {/* Symptoms Section */}
        <Box className="pans-pandas-modal__section">
          <Typography className="pans-pandas-modal__subtitle">
            <FaExclamationTriangle className="pans-pandas-modal__subtitle-icon" />
            תסמינים אפשריים
          </Typography>
          <Typography className="pans-pandas-modal__text">
            ילדים ובוגרים עם PANS/PANDAS יכולים לסבול בין היתר מהתסמינים הבאים:
          </Typography>
          <Box className="pans-pandas-modal__symptoms">
            {symptoms.map((symptom, index) => (
              <Box key={index} className="pans-pandas-modal__symptom">
                <span className="pans-pandas-modal__symptom-bullet" />
                <Typography className="pans-pandas-modal__symptom-text">
                  {symptom}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Psychosis Note */}
          <Box className="pans-pandas-modal__note">
            <FaInfoCircle className="pans-pandas-modal__note-icon" />
            <Typography className="pans-pandas-modal__note-text">
              לעיתים ייתכנו גם הזיות ו/או פסיכוזה כחלק מהתסמינים, אך חשוב לדעת כי הן
              אינן חלק מהקריטריונים הרשמיים לאבחון.
            </Typography>
          </Box>
        </Box>

        {/* Flare-ups Section */}
        <Box className="pans-pandas-modal__section pans-pandas-modal__section--info">
          <Typography className="pans-pandas-modal__text">
            <strong>החמרות והפוגות:</strong> בדומה למחלות אוטואימוניות אחרות, התסמונות מתאפיינות
            לא פעם בהחמרות והפוגות – כלומר תקופות של שיפור יחסי, ואז החמרה חדה, לעיתים
            לאחר חשיפה לזיהום נוסף, מתן חיסון וכד'.
          </Typography>
        </Box>

        <Divider className="pans-pandas-modal__divider" />

        {/* Why Hard to Diagnose */}
        <Box className="pans-pandas-modal__section">
          <Typography className="pans-pandas-modal__subtitle">
            למה קשה לזהות את זה?
          </Typography>
          <Typography className="pans-pandas-modal__text">
            PANS ו־PANDAS עלולות להידמות להפרעות אחרות כמו ADHD, OCD, חרדה כללית,
            הפרעות מצב רוח ואפילו אוטיזם, ולכן ילדים רבים מאובחנים בטעות ומקבלים טיפול
            שאינו מתאים. התסמונות עדיין נחשבות נדירות יחסית, אך יותר ויותר מחקרים מראים
            שהן עשויות להיות שכיחות יותר משחשבו בעבר.
          </Typography>
        </Box>

        <Divider className="pans-pandas-modal__divider" />

        {/* Important for Parents */}
        <Box className="pans-pandas-modal__section pans-pandas-modal__section--parents">
          <Typography className="pans-pandas-modal__subtitle">
            חשוב לדעת כהורים
          </Typography>
          <Box className="pans-pandas-modal__parent-tips">
            <Box className="pans-pandas-modal__tip">
              <span className="pans-pandas-modal__tip-icon">✓</span>
              <Typography>
                <strong>אתם לא מדמיינים</strong> — שינוי פתאומי וקיצוני בהתנהגות הילד מצריך בדיקה.
              </Typography>
            </Box>
            <Box className="pans-pandas-modal__tip">
              <span className="pans-pandas-modal__tip-icon">✓</span>
              <Typography>
                יש אנשי מקצוע המנוסים בזיהוי PANS/PANDAS.
              </Typography>
            </Box>
            <Box className="pans-pandas-modal__tip">
              <span className="pans-pandas-modal__tip-icon">✓</span>
              <Typography>
                אבחון נכון מאפשר טיפול יעיל יותר.
              </Typography>
            </Box>
            <Box className="pans-pandas-modal__tip">
              <span className="pans-pandas-modal__tip-icon">✓</span>
              <Typography>
                התערבות מוקדמת מסייעת להפחתת סבל הילד והמשפחה.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* CTA Section */}
        <Box className="pans-pandas-modal__cta">
          {/* <Typography className="pans-pandas-modal__cta-text">
            רוצים לדעת מה הצעד הבא?
          </Typography> */}
          <Button
            variant="contained"
            onClick={handleNavigateToResources}
            className="pans-pandas-modal__cta-button"
            endIcon={<FiArrowLeft />}
          >
            מה לעשות עכשיו?
          </Button>
          {/* <a
            href="https://panspandasuk.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="pans-pandas-modal__external-link"
          >
            <FiExternalLink />
            <span>למידע נוסף באתר PANS PANDAS UK</span>
          </a> */}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default WhatIsPansPandasModal;
