import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './sections/Sections.scss';
import type { PansFormData, RatingValue, SubSymptom, SurveyItem, SymptomGroup } from '../../../../../types/pandasScale';
import SurveySection from './SurveySection/SurveySection';
import FunctionalSection from './sections/FunctionalSection';
import { computeScores } from '../../../../../utils/pandasScoreUtils';
import { saveScaleResult } from '@/services/scalesService.ts';

const CalculatorForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // 1. הגדרת הנתונים ההתחלתיים לכל קבוצה
  const ocdInitial: SymptomGroup[] = [
    {
      id: 'ocd_contamination',
      label:
        'דאגות טורדניות ומתמשכות בנוגע ללכלוך וחיידקים. כפייתיות של רחיצה וניקיון.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'ocd_harm',
      label:
        'דאגות טורדניות ומתמשכות בנוגע לפגיעה בעצמי או באחרים. כפייתיות שקשורה בזה; כולל צורך להתוודות או לספר. עשוי להיות קשור גם לחששות מפרידה.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'ocd_sex_religion',
      label:
        'דאגות טורדניות ומתמשכות בנוגע למחשבות או התנהגויות בעלות אופי מיני או דתי. טקסים והתנהגויות כפייתיות קשורות.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'ocd_symmetry',
      label:
        'דאגות טורדניות בנוגע לסימטריה. כפייתיות של סידור, ספירה או ארגון; צורך לגעת, להקיש או לשפשף; או צורך שדברים ירגישו, ייראו או יישמעו "בדיוק נכון".',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'ocd_hoarding',
      label:
        'דאגות טורדניות ומתמשכות בנוגע לאגירה ואיסוף חפצים.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'ocd_eating',
      label:
        'תסמינים של הימנעות או הגבלה באכילה: חוסר עניין ניכר באוכל, רגישות חושית למרקם/טעם/ריח, או פחד מהשלכות של אכילה – מה שעלול להוביל לסירוב לאכול (אנורקסיה לא טיפוסית) או לירידה חדה בצריכת המזון.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'ocd_misc',
      label:
        'שונות: צורך לדעת או לזכור דברים; פחד לומר או לא לומר משהו מסוים; דימויים חודרניים (לא אלימים); מילים, קולות, מספרים או מוזיקה שחוזרים בראש; חזרתיות בפעולות כמו כניסה ויציאה מדלת; צורך לערב אדם אחר בטקסים (למשל לשאול שוב ושוב); טקסים מנטליים שאינם בדיקה או ספירה; רישום רשימות מופרז; או תסמינים אחרים.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
  ];

  const associatedInitial: SubSymptom[] = [
    {
      id: 'assoc_separation',
      domain: 'anxiety',
      sublabel: 'חרדת פרידה – צורך לשמור על קרבה לאדם מסוים, מקום מוכר כמו בית או חדר או חפץ.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'assoc_general_anxiety',
      domain: 'anxiety',
      sublabel: 'חרדה כללית.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'assoc_phobias',
      domain: 'anxiety',
      sublabel: 'פחדים לא רציונליים ו/או פוביות ללא בסיס ממשי.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'assoc_panic',
      domain: 'anxiety',
      sublabel: 'התקפי פאניקה.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'assoc_mood_changes',
      domain: 'moodiness',
      sublabel: 'תנודתיות רגשית ודיכאון – שינויים חדים במצב הרוח.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'assoc_depression',
      domain: 'moodiness',
      sublabel: 'דיכאון עם או בלי מחשבות אובדניות או התנהגות של פגיעה עצמית.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'assoc_irritability',
      domain: 'irritability',
      sublabel: 'רגזנות או תוקפנות – דרישות לא הגיוניות, התפרצויות כעס, התקפי זעם או התנהגות תגובתית אגרסיבית.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'assoc_withdrawal1',
      domain: 'regression',
      sublabel: 'נסיגה התנהגותית – “דיבור תינוקי” או התנהגות לא תואמת גיל.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'assoc_withdrawal2',
      domain: 'regression',
      sublabel: 'שינוי באישיות.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'assoc_school_function1',
      domain: 'cognitive',
      sublabel: 'תפקוד לימודי וריכוז – קושי להתרכז, בעיות בזיכרון קצר טווח.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'assoc_school_function2',
      domain: 'cognitive',
      sublabel: 'אובדן כישורים אקדמיים (במיוחד בחשבון, קריאה או כתיבה).',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'assoc_school_function3',
      domain: 'cognitive',
      sublabel: 'בלבול.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'assoc_sensory',
      domain: 'sensory',
      sublabel: 'תסמינים חושיים – רגישות לאור, מגע (כמו תגיות), צלילים, ריחות או טעמים; צורך לגעת בדברים בצורה מסוימת; עיוותים בתפיסה חזותית או מרחבית.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'assoc_hallucinations',
      domain: 'hallucinations',
      sublabel: 'הזיות – ראייה או שמיעה של דברים שאינם קיימים.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'assoc_motor1',
      domain: 'motor',
      sublabel: 'דיסגרפיה - ירידה או אובדן היכולת לצייר, להעתיק צוורת/דמויות, או לכתוב אותיות ומילים.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'assoc_motor2',
      domain: 'motor',
      sublabel: 'היפראקטיביות מוטורית או תנועות פתאומיות - בעיטות, יריקות, גפיים מתנופפות, הסתובבות, הליכה הלוך ושוב. אי יכולת להישאר בשקט מבחינה גופנית.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'assoc_motor3',
      domain: 'motor',
      sublabel: 'תנועות אצבעות כמו נגינה בפסנתר.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'assoc_motor4',
      domain: 'motor',
      sublabel: 'טיקים מוטוריים או קוליים פשוטים - נהמות, נחירות, צפצופים, חריקות וכו.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'assoc_motor5',
      domain: 'motor',
      sublabel: 'טיקים מוטוריים או קוליים מורכבים - יריקות, קללות, מילים או תנועות מגונות, חזרתיות על מילים, שינויים בטון הקול או בקצב הדיבור וכו.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'assoc_urinary',
      domain: 'urinary',
      sublabel: 'תסמינים במערכת השתן – תכיפות, דחיפות או קושי לתת שתן (ביום או בלילה).',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'assoc_sleep2',
      domain: 'sleep',
      sublabel: 'נדודי שינה או ישנוניות יתר. הפרעות שינה ועייפות – קושי להירדם, שינה מרובה, סיוטים, טקסים ארוכים לפני השינה.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'assoc_sleep1',
      domain: 'sleep',
      sublabel: 'עייפות קיצונית.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
    {
      id: 'assoc_pupil',
      domain: 'pupil',
      sublabel: 'אישונים מורחבים – מראה של “פחד קיצוני” או “מבט מבועת”.',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
  ];

  const functionalInitial: SymptomGroup[] = [
    {
      id: 'functional_impairment',
      label: 'פגיעה תפקודית (0–5)',
      ratingBefore: 0 as RatingValue,
      ratingAfter: 0 as RatingValue,
      ratingCurrent: 0 as RatingValue,
    },
  ];

  // 2. סטייט לכל מדור
  const [ocdAnswers, setOcdAnswers] = useState<SymptomGroup[]>([...ocdInitial]);

  // שימו לב: נהפוך את assocAnswers ל־SubSymptom[]
  const [assocAnswers, setAssocAnswers] = useState<SubSymptom[]>([...associatedInitial]);

  const [funcAnswers, setFuncAnswers] = useState<SymptomGroup[]>([...functionalInitial]);

  // 3. ניהול תצוגה: 0 = OCD, 1 = Associated, 2 = Functional, 3 = חישוב סופי
  const [sectionIndex, setSectionIndex] = useState<number>(0);

  // 4. טעינה/שמירה ב־localStorage
  useEffect(() => {
    const savedOCD = localStorage.getItem('ocdSymptoms');
    if (savedOCD) {
      try {
        setOcdAnswers(JSON.parse(savedOCD));
      } catch { }
    }
    const savedAssoc = localStorage.getItem('associatedSymptoms');
    if (savedAssoc) {
      try {
        setAssocAnswers(JSON.parse(savedAssoc));
      } catch { }
    }
    const savedFunc = localStorage.getItem('functionalImpairment');
    if (savedFunc) {
      try {
        setFuncAnswers(JSON.parse(savedFunc));
      } catch { }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ocdSymptoms', JSON.stringify(ocdAnswers));
  }, [ocdAnswers]);

  useEffect(() => {
    localStorage.setItem('associatedSymptoms', JSON.stringify(assocAnswers));
  }, [assocAnswers]);

  useEffect(() => {
    localStorage.setItem('functionalImpairment', JSON.stringify(funcAnswers));
  }, [funcAnswers]);

  // 5. סיום מדור I (now receives SurveyItem[])
  const finishOcd = (answers: SurveyItem[]) => {
    // cast back to SymptomGroup[]
    setOcdAnswers(answers as SymptomGroup[]);
    setSectionIndex(1);
  };

  // 6. סיום מדור II (now receives SurveyItem[])
  const finishAssoc = (answers: SurveyItem[]) => {
    // cast back to SubSymptom[]
    setAssocAnswers(answers as SubSymptom[]);
    setSectionIndex(2);
  };

  // 7. סיום מדור III (פגיעה תפקודית, remains SymptomGroup[])
  const finishFunctional = (answers: SymptomGroup[]) => {
    setFuncAnswers(answers);
    setSectionIndex(3);
  };

  // 8. חישוב סופי
  // const handleCalculate = () => {
  //   const formData: PansFormData = {
  //     ocdSymptoms: ocdAnswers,
  //     associatedSymptoms: assocAnswers,
  //     functionalImpairment: funcAnswers,
  //   };
  //   const scores = computeScores(formData);
  //   navigate('/scales/pandas/results', { state: { formData, scores } });
  // };

  // 9. פונקציות חזרה למדור הקודם
  const goBackToOCD = () => {
    setSectionIndex(0);
  };

  const goBackToAssociated = () => {
    setSectionIndex(1);
  };

  const handleCalculate = async () => {
    setIsSaving(true);
    setSaveError(null);

    const formData: PansFormData = {
      ocdSymptoms: ocdAnswers,
      associatedSymptoms: assocAnswers,
      functionalImpairment: funcAnswers,
    };

    try {
      // Save to Firestore
      const docId = await saveScaleResult(formData);
      console.log('✅ Results saved with ID:', docId);

      // Compute scores for navigation
      const scores = computeScores(formData);

      // Navigate to results page
      navigate('/scales/pandas/results', {
        state: { formData, scores, savedDocId: docId }
      });
    } catch (error) {
      console.error('❌ Error saving results:', error);
      setSaveError('שגיאה בשמירת התוצאות. התוצאות יוצגו אך לא נשמרו.');

      // Still navigate to results even if save failed
      const scores = computeScores(formData);
      setTimeout(() => {
        navigate('/scales/pandas/results', { state: { formData, scores } });
      }, 2000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }} dir={t('dir')}>
      <Paper elevation={3} sx={{ p: 2, maxWidth: 900, mx: 'auto' }}>
        {/* ===== מדור I: שאלון OCD "שאלה אחר שאלה" ===== */}
        {sectionIndex === 0 && (
          <SurveySection
            title={t('survey.ocdTitle')}
            items={ocdAnswers}
            onComplete={finishOcd}
            isFirstSection={true}
          />
        )}

        {/* ===== מדור II: תתי־הסימפטומים ("NP") ===== */}
        {sectionIndex === 1 && (
          <SurveySection
            title={t('survey.associatedTitle')}
            items={assocAnswers}
            onComplete={finishAssoc}
            onGoBack={goBackToOCD}
            isFirstSection={false}
          />
        )}
        {sectionIndex === 2 && (
          <>
            <FunctionalSection
              items={funcAnswers}
              onItemChange={(id, value: RatingValue) => {
                setFuncAnswers([
                  {
                    id: funcAnswers[0].id,
                    label: funcAnswers[0].label,
                    ratingBefore: funcAnswers[0].ratingBefore,
                    ratingAfter: funcAnswers[0].ratingAfter,
                    ratingCurrent: value, // value כבר RatingValue
                  },
                ]);
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="text" onClick={goBackToAssociated}>
                חזור
              </Button>
              <Button variant="contained" onClick={() => finishFunctional(funcAnswers)}>
                {t('survey.finishFunctionalButton')}
              </Button>
            </Box>
          </>
        )}
        {sectionIndex === 3 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              כל החלקים הושלמו!
            </Typography>
            {/* <Button variant="contained" size="large" onClick={handleCalculate}>
              {t('survey.calculateScoreButton')}
            </Button> */}
            {isSaving ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">
                  שומר תוצאות...
                </Typography>
              </Box>
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={handleCalculate}
                disabled={isSaving}
              >
                {t('survey.calculateScoreButton')}
              </Button>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default CalculatorForm;