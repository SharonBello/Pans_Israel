import type { InfoSection, AssessmentScale } from '../types/info.types';
import relatedImage1 from '../styles/assets/related_image_1.jpg';
import relatedImage2 from '../styles/assets/related_image_2.jpg';
import relatedImage3 from '../styles/assets/related_image_3.jpg';

export const infoSections: Record<string, InfoSection> = {
  overview: {
    id: 'overview',
    title: 'מידע על התסמונות',
    slug: 'overview',
    description: 'מדריך מקיף להבנת פאנדס ו-פאנס',
    content: [
      {
        id: 'intro-heading',
        type: 'heading',
        title: 'מהן תסמונות פאנדס ו-פאנס?'
      },
      {
        id: 'intro-paragraph',
        type: 'paragraph',
        content: 'PANS (Pediatric Acute-Onset Neuropsychiatric Syndrome) ו-פאנדס (Pediatric Autoimmune Neuropsychiatric Disorders Associated with Streptococcal Infections) הן תסמונות נוירו-פסיכיאטריות אוטואימוניות המאופיינות בהופעה פתאומית וחריפה של מגוון רחב של תסמינים נוירו-פסיכיאטריים.'
      },
      {
        id: 'mechanism-heading',
        type: 'heading',
        title: 'מנגנון המחלה'
      },
      {
        id: 'mechanism-paragraph',
        type: 'paragraph',
        content: 'התסמונת נובעת ממצב פוסט-זיהומי הפוגע בגרעיני הבסיס במוח (Basal Ganglia), כנראה דרך דלקת חיסונית, ציטוקינים פרו-דלקתיים ונוגדנים עצמיים נגד רקמה עצבית. כבר ידוע כי לא רק זיהום בחיידק הסטרפטוקוק יכול לשמש כטריגר להופעת התסמונת, אלא גם זיהומים אחרים, כולל זיהומים ויראליים כגון SARS-CoV-2.'
      },
      {
        id: 'difference-callout',
        type: 'callout',
        variant: 'info',
        title: 'מה ההבדל בין פאנדס ל-פאנס?',
        content: 'פאנדס הוא תת-סוג של פאנס, הנגרם ספציפית לאחר זיהום סטרפטוקוקי (כמו דלקת גרון סטרפטוקוקית). פאנס ללא סטרפטוקוק = פאנס. במילים אחרות, כאשר אין קשר לסטרפטוקוק, האבחנה היא פאנס.'
      },
      {
        id: 'impact-heading',
        type: 'heading',
        title: 'ההשפעה על הילד והמשפחה'
      },
      {
        id: 'impact-paragraph',
        type: 'paragraph',
        content: 'פאנדס/פאנס מוכרות יותר ויותר כצורה של דלקת מוח אוטואימונית (Autoimmune Encephalitis) - ובאופן ספציפי יותר, דלקת מוח פוסט-זיהומית של גרעיני הבסיס (Basal Ganglia Encephalitis). תסמינים עלולים לגרום לנכות חמורה ולשינויים נוירולוגיים קיצוניים, כולל התקפים ו/או בעיות בשיווי משקל, דיבור או ראייה. תסמינים פסיכיאטריים גם הם שכיחים וכוללים תוקפנות, התנהגויות לא הולמות או כפייתיות, ופחד.'
      },
      {
        id: 'symptoms-preview-heading',
        type: 'heading',
        title: 'תסמינים אפשריים'
      },
      {
        id: 'symptoms-preview-list',
        type: 'list',
        items: [
          'הופעה פתאומית של הפרעה טורדנית-כפייתית (OCD)',
          'הגבלת אכילה חמורה',
          'עצבנות או התנהגות תוקפנית',
          'שינויי מצב רוח קיצוניים או דיכאון',
          'הידרדרות ביכולות מוטוריות',
          'טיקים ותנועות חריגות',
          'הזיות ראייה או שמיעה',
          'רגישות לאור, קולות ומגע',
          'הפרעות שינה או עייפות',
        ]
      },
      {
        id: 'episodic-callout',
        type: 'callout',
        variant: 'warning',
        title: 'מהלך אפיזודי',
        content: 'בדומה למחלות אוטואימוניות אחרות, התסמונות מתאפיינות לא פעם בהחמרות והפוגות – כלומר תקופות של שיפור יחסי, ואז החמרה חדה, לעיתים לאחר חשיפה לזיהום נוסף, מתן חיסון וכדומה.'
      },
      {
        id: 'why-hard-heading',
        type: 'heading',
        title: 'למה קשה לזהות את זה?'
      },
      {
        id: 'why-hard-paragraph',
        type: 'paragraph',
        content: 'פאנס ו-פאנדס עלולות להידמות להפרעות אחרות כמו ADHD, OCD, חרדה כללית, הפרעות מצב רוח ואפילו אוטיזם, ולכן ילדים רבים מאובחנים בטעות ומקבלים טיפול שאינו מתאים. התסמונות עדיין נחשבות נדירות יחסית, אך יותר ויותר מחקרים מראים שהן עשויות להיות שכיחות יותר משחשבו בעבר.'
      },
      {
        id: 'parents-callout',
        type: 'callout',
        variant: 'tip',
        title: 'חשוב לדעת כהורים',
        content: 'אתם לא מדמיינים — שינוי פתאומי וקיצוני בהתנהגות הילד מצריך בדיקה. יש אנשי מקצוע המנוסים בזיהוי פאנס/פאנדס. אבחון נכון מאפשר טיפול יעיל יותר. התערבות מוקדמת מסייעת להפחתת סבל הילד והמשפחה.'
      },
      {
        id: 'video-section',
        type: 'video',
        title: 'צפו בסרטון הסבר',
        videoUrl: 'https://www.youtube.com/watch?v=l55SX33ZQy0',
        content: 'להבנה טובה יותר של הספקטרום של פאנדס/פאנס ודלקת מוח אוטואימונית, צפו בסרטון הקצר הזה.'
      }
    ],
    relatedPages: [
      {
        id: 'diagnosis',
        slug: 'diagnosis',
        title: 'אבחון פאנדס',
        description: 'האבחון מבוסס על תסמינים, היסטוריה רפואית ובדיקות מעבדה.',
        imageUrl: relatedImage1,
        imageAlt: 'אבחון פאנדס'
      },
      {
        id: 'treatment',
        slug: 'treatment',
        title: 'טיפול ב-פאנדס',
        description: 'טיפול מוקדם יכול לצמצם משך וחומרה של תסמינים.',
        imageUrl: relatedImage2,
        imageAlt: 'טיפול ב-פאנדס'
      },
      {
        id: 'faq',
        slug: 'faq',
        title: 'שאלות נפוצות',
        description: 'תשובות לשאלות שכיחות של הורים, מטפלים ותומכים.',
        imageUrl: relatedImage3,
        imageAlt: 'שאלות נפוצות'
      }
    ]
  },

  symptoms: {
    id: 'symptoms',
    title: 'סימנים ותסמינים',
    slug: 'symptoms',
    description: 'מבט מעמיק על תסמיני פאנדס/פאנס',
    content: [
      {
        id: 'symptoms-intro',
        type: 'paragraph',
        content: 'פאנדס/פאנס כוללות מגוון תסמינים שיכולים להופיע בפתאומיות ובאופן הרסני. רבים מהתסמינים הללו, בדרגות חומרה שונות, מופיעים בו-זמנית.'
      },
      {
        id: 'symptoms-callout',
        type: 'callout',
        variant: 'info',
        title: 'אופי התסמינים',
        content: 'חומרת התסמינים והופעת פאנדס/פאנס משתנות ממטופל למטופל, אך התסמינים בדרך כלל מופיעים בפתאומיות ובאינטנסיביות. התסמינים יכולים להשתפר ואז להחמיר שוב, במה שמכונה מהלך אפיזודי.'
      },
      {
        id: 'comprehensive-heading',
        type: 'heading',
        title: 'רשימת תסמינים מקיפה'
      },
      {
        id: 'symptoms-detailed',
        type: 'accordion',
        items: [
          {
            title: 'הפרעה טורדנית-כפייתית (OCD)',
            description: 'OCD יכולה להתבטא בדרכים שונות בילדים צעירים. מחשבות טורדניות חוזרות ונשנות והתנהגויות כפייתיות שהילד מרגיש שהוא חייב לבצע. יכולה לכלול טקסים, ספירות, בדיקות חוזרות ונשנות, ופחדים לא רציונליים.'
          },
          {
            title: 'הגבלת אכילה',
            description: 'כולל אכילה סלקטיבית וסירוב לאוכל. יכולים להיות מגוון סיבות לכך, כולל פחדים מזיהום, רגישויות חושיות, קושי בבליעה, פחד מהקאות או עלייה במשקל ועוד. אם הגבלת האכילה גורמת לירידה חמורה במשקל, יש לפנות מיד לרופא.'
          },
          {
            title: 'טיקים',
            description: 'טיקים הם תנועות או קולות חוזרים שקשה לילד לשלוט בהם. טיקים מוטוריים יכולים לכלול מצמוץ עיניים, תנועות ראש, משיכת כתפיים, עיוות פנים. טיקים קוליים יכולים לכלול גניחות, המהום, ניקוי גרון, שיעול או חזרה על מילים ומשפטים.'
          },
          {
            title: 'חרדה',
            description: 'חרדה קיצונית שיכולה להתבטא בחרדת נטישה, חרדה חברתית, חרדה כללית, התקפי פאניקה ופחדים לא רציונליים.'
          },
          {
            title: 'לאביליות רגשית',
            description: 'לאביליות רגשית כוללת חוסר יכולת לשלוט בתגובות רגשיות, כגון בכי או צחוק בלתי נשלט. זהו תסמין נוירולוגי.'
          },
          {
            title: 'דיכאון',
            description: 'עצבות מתמשכת, חוסר עניין בפעילויות שבעבר נהנה מהן, תחושת חוסר ערך, ומחשבות שליליות.'
          },
          {
            title: 'עצבנות ותוקפנות',
            description: 'התפרצויות זעם בלתי מוסברות, תוקפנות פיזית או מילולית, קשיי ויסות רגשי חמורים.'
          },
          {
            title: 'רגרסיה התפתחותית/התנהגותית',
            description: 'אובדן מיומנויות תקשורת וחברתיות, דיבור תינוקי, מציצת אצבעות, לעיסת בגדים, התנהגות שאינה תואמת גיל.'
          },
          {
            title: 'הידרדרות בביצועים בבית הספר',
            description: 'כולל הידרדרות ביכולות מתמטיות, קושי בריכוז, קושי לשמר מידע וסירוב ללכת לבית הספר. ביצועים לימודיים יכולים להיפגע גם כתוצאה מתסמינים אחרים כמו OCD או חרדת נטישה חמורה.'
          },
          {
            title: 'שינויים בכתב היד',
            description: 'כולל סטייה משוליים וקריאות ירודה של הכתב.'
          },
          {
            title: 'רגישויות חושיות',
            description: 'רגישות למגע, לקולות ולרעש. מגעים פשוטים עשויים להרגיש כואבים. למשל, חוסר יכולת לסבול את תחושת הגרביים או את המרקם או הטמפרטורה של מאכלים מסוימים. בעיות בעיבוד חושי יכולות גם לגרום לקושי במציאת פריט כשהוא בין מבחר גדול של פריטים.'
          },
          {
            title: 'סימנים סומטיים',
            description: 'כולל קשיי שינה, הרטבה, תכיפות במתן שתן.'
          },
          {
            title: 'היפראקטיביות',
            description: 'פעילות יתר, קושי לשבת במקום, אימפולסיביות מוגברת.'
          },
          {
            title: 'תנועות כוראיפורמיות',
            description: 'תנועות לא רצוניות של הגפיים. הילד מנסה להחזיק את ידיו ישר לפנים ומנסה לא להזיז את אצבעותיו, אך לא מצליח לשלוט בתנועות.'
          },
          {
            title: 'חרדת נטישה חמורה',
            description: 'חרדת נטישה בילד מבוגר יותר תתבטא בצורה שונה. למשל, ילד עשוי לא להיות מוכן לצאת מהבית או מחדרו.'
          },
          {
            title: 'הזיות',
            description: 'כולל הזיות ראייה ושמיעה.'
          },
          {
            title: 'תגובת "הילחם או ברח"',
            description: 'יכולה להתבטא בדרכים שונות, כמו בריחה מההורים או תגובות פחד קיצוניות כאשר אירוע נתפס כמלחיץ ומפחיד.'
          },
          {
            title: 'אישונים מורחבים (מידריאזיס)',
            description: 'יכול להיות לסירוגין במהלך התפרצויות רגשיות.'
          },
          {
            title: 'כאבים ראומטיים במפרקים',
            description: 'כאבי מפרקים, כאבי ראש, כאבי גוף כלליים.'
          },
          {
            title: 'בעיות במתן שתן',
            description: 'תאונות הרטבה ביום/בלילה או תכיפות במתן שתן.'
          }
        ]
      },
      {
        id: 'scales-heading',
        type: 'heading',
        title: 'סולמות הערכת תסמינים'
      },
      {
        id: 'scales-intro',
        type: 'paragraph',
        content: 'פאנדס ו-פאנס הן אבחנות קליניות התלויות מאוד בהצגת התסמינים. אבחנה קלינית היא אבחנה שאינה מבוססת אך ורק על בדיקת אבחון כמו בדיקת דם. במקום זאת, האבחנה מבוססת על אוסף של סימנים, תסמינים, היסטוריה רפואית וממצאי מעבדה. כרגע, אין בדיקה אבחנתית מוחלטת 100% ל-פאנדס או פאנס.'
      },
      {
        id: 'scales-callout',
        type: 'callout',
        variant: 'tip',
        title: 'חשיבות התיעוד',
        content: 'הצגת חומרת התסמינים, משך הזמן וההופעה הפתאומית הם כלים חשובים בקביעת אבחנה אפשרית. סולמות ההערכה להלן יעזרו להורים להציג את התסמינים של ילדם בצורה מסודרת לצוות הרפואי.'
      },
      // {
      //   id: 'scales-downloads',
      //   type: 'download',
      //   title: 'סולמות להורדה',
      //   downloadUrl: 'https://pandasnetwork.org/wp-content/uploads/2024/06/PANS-31-Item-Symptom-Rating-Scale-4-30-24.pdf',
      //   downloadLabel: 'מדד הערכת תסמינים פאנס (31 פריטים)'
      // }
    ],
    relatedPages: [
      {
        id: 'diagnosis',
        slug: 'diagnosis',
        title: 'אבחון פאנדס',
        description: 'האבחון מבוסס על תסמינים, היסטוריה רפואית ובדיקות מעבדה.',
        imageUrl: relatedImage1,
        imageAlt: 'אבחון פאנדס'
      },
      {
        id: 'treatment',
        slug: 'treatment',
        title: 'טיפול ב-פאנדס',
        description: 'טיפול מוקדם יכול לצמצם משך וחומרה של תסמינים.',
        imageUrl: relatedImage2,
        imageAlt: 'טיפול ב-פאנדס'
      },
    ]
  },

  diagnosis: {
    id: 'diagnosis',
    title: 'אבחון',
    slug: 'diagnosis',
    description: 'קריטריונים לאבחון פאנדס/פאנס ובדיקות מומלצות',
    content: [
      {
        id: 'diagnosis-intro',
        type: 'paragraph',
        content: 'פאנדס ו-פאנס הן אבחנות קליניות המבוססות על אוסף של סימנים, תסמינים, היסטוריה רפואית וממצאי מעבדה שאינם יכולים להיות מוסברים על ידי הפרעות נוירולוגיות או רפואיות אחרות. כרגע, אין בדיקה אבחנתית מוחלטת 100% ל-פאנדס או פאנס.'
      },
      {
        id: 'pandas-criteria-heading',
        type: 'heading',
        title: 'קריטריונים לאבחון פאנדס'
      },
      {
        id: 'pandas-criteria-intro',
        type: 'paragraph',
        content: 'המאפיין העיקרי של פאנדס הוא הופעה חריפה ופתאומית של חרדה אינטנסיבית ולאביליות במצב הרוח, מלווה בבעיות דמויות-OCD או טיקים, בקשר לזיהום סטרפטוקוקי (GABHS) שהתרחש מיד לפני התסמינים.'
      },
      {
        id: 'pandas-criteria-list',
        type: 'list',
        title: 'אבחנה קלינית של פאנדס מוגדרת על ידי הקריטריונים הבאים:',
        items: [
          'נוכחות של אובססיות, כפיות או טיקים משמעותיים',
          'הופעה פתאומית של תסמינים או מהלך של התלקחויות והפוגות',
          // 'הופעה לפני גיל ההתבגרות',
          'קשר לזיהום סטרפטוקוקי',
          'קשר לתסמינים נוירו-פסיכיאטריים נוספים'
        ]
      },
      {
        id: 'pans-criteria-heading',
        type: 'heading',
        title: 'קריטריונים לאבחון פאנס'
      },
      {
        id: 'pans-criteria-intro',
        type: 'paragraph',
        content: 'פאנס היא אבחנה קלינית.'
      },
      {
        id: 'pans-criteria-list',
        type: 'list',
        title: 'הקריטריונים לאבחון פאנס:',
        items: [
          {
            title: '1. הופעה פתאומית ודרמטית של OCD, או הגבלת אכילה חמורה',
            description: ''
          },
          {
            title: '2. נוכחות במקביל של תסמינים נוירו-פסיכיאטריים נוספים, עם הופעה חמורה וחריפה דומה, מלפחות שתיים מתוך שבע הקטגוריות הבאות:',
            description: 'חרדה | לאביליות רגשית או דיכאון | עצבנות, תוקפנות או התנהגויות התנגדותיות חמורות | רגרסיה התנהגותית (התפתחותית) | הידרדרות בביצועים בבית הספר | הפרעות חושיות או מוטוריות | סימנים סומטיים כולל הפרעות שינה, הרטבה או תכיפות במתן שתן'
          },
          {
            title: '3. התסמינים אינם מוסברים טוב יותר על ידי הפרעה נוירולוגית או רפואית ידועה',
            description: 'כגון כוריאה של סידנהאם, לופוס, תסמונת טורט או אחרות'
          }
        ]
      },
      {
        id: 'tests-heading',
        type: 'heading',
        title: 'בדיקות אבחנתיות ראשוניות'
      },
      {
        id: 'tests-intro',
        type: 'paragraph',
        content: 'אם אתם חושדים שלילדכם יש פאנדס או פאנס, הבדיקות הבאות, בנוסף למילוי סולמות התסמינים, יכולות לעזור לספק הרפואי שלכם לבצע אבחנה נכונה.'
      },
      {
        id: 'basic-blood-heading',
        type: 'heading',
        title: 'בדיקות דם בסיסיות'
      },
      {
        id: 'basic-blood-table',
        type: 'table',
        columns: ['בדיקה', 'מטרה'],
        rows: [
          ['IgA', 'בדיקת רמות נוגדנים'],
          ['IgM', 'בדיקת רמות נוגדנים'],
          ['IgG (תת-סוגים 1, 2, 3, 4)', 'בדיקת רמות נוגדנים ומצב חיסוני'],
          ['CBC (ספירת דם מלאה)', 'הערכת מצב בריאותי כללי'],
          ['ANA', 'בדיקת נוגדנים אוטואימוניים'],
          ['פריטין (ברזל)', 'בדיקת רמות ברזל'],
          ['B-12', 'בדיקת רמות ויטמין B12'],
          ['ויטמין D', 'בדיקת רמות ויטמין D']
        ]
      },
      {
        id: 'infection-tests-heading',
        type: 'heading',
        title: 'בדיקות זיהום ויראלי/חיידקי'
      },
      {
        id: 'infection-tests-table',
        type: 'table',
        columns: ['בדיקה', 'מטרה'],
        rows: [
          ['תרבית גרון לסטרפ, תרבית 48 שעות או תרבית פריאנאלית', 'זיהוי זיהום סטרפטוקוקי פעיל'],
          ['ASO (Anti-Streptolysin O)', 'נוגדנים לסטרפטוקוק קבוצה A'],
          ['Anti DNase B', 'נוגדנים לסטרפטוקוק'],
          ['Streptozyme', 'בדיקת נוגדנים מרובה לסטרפ'],
          ['Mycoplasma Pneumoniae IgA & IgM', 'זיהום מיקופלזמה'],
          ['Pneumococcal Antibody Titers', 'נוגדנים לפנאומוקוק'],
          ['בדיקות ליים וקו-זיהומים', 'מחלת ליים'],
          ['פאנל נגיף אפשטיין-בר', 'זיהום EBV'],
          ['Coxsackie A & B Titers', 'נגיפי קוקסקי'],
          ['HHV-6 Titers', 'נגיף הרפס 6']
        ]
      },
      {
        id: 'strep-heading',
        type: 'heading',
        title: 'על סטרפטוקוק'
      },
      {
        id: 'strep-callout',
        type: 'callout',
        variant: 'warning',
        title: 'למעלה ממחצית מזיהומי הסטרפ מתפספסים בילדים צעירים',
        content: 'על פי מחקר Hysmith ושות\' (2017), 65% מזיהומי סטרפ חדשים מקבוצה A לא גרמו לתסמינים אך עדיין היו משמעותיים מבחינה אימונולוגית. לכן, כדאי לבצע בדיקת דם לחיפוש סטרפ או תרבית של 48 שעות.'

      },
      {
        id: 'strep-locations',
        type: 'paragraph',
        content: 'סטרפטוקוק יכול להופיע לא רק בגרון, אלא גם בסינוסים, באוזניים, במעי, על העור ובאזורים הווגינליים והפריאנאליים. משטח גרון לא ייתן תוצאה חיובית לסטרפ שמתרחש במקום אחר בגוף.'
      },
      {
        id: 'family-testing-callout',
        type: 'callout',
        variant: 'tip',
        title: 'בדיקת בני משפחה',
        content: 'חשוב לבדוק את כל בני המשפחה כדי לוודא שאף אחד אינו נשא א-תסמיני או נשא סטרפ. נשאים לעיתים קרובות לא יראו תסמיני סטרפ, אבל אם ייבדקו, הם יהיו חיוביים. בדיקת בני המשפחה תפחית את הסיכוי של ילדכם להידבק מחדש.'
      },
      // {
      //   id: 'cunningham-heading',
      //   type: 'heading',
      //   title: 'פאנל קנינגהם'
      // },
      // {
      //   id: 'cunningham-paragraph',
      //   type: 'paragraph',
      //   content: 'פאנל קנינגהם™ קובע את "הסבירות שמצבו של המטופל הוא אוטואימוני באופיו", כולל פאנדס ו-פאנס אפשריים. הבדיקה מודדת חמישה מדדים וזמינה מסחרית על ידי Moleculera Labs. מחקרה של ד"ר קנינגהם, שהוביל לבדיקה זו, מדד נוגדנים מגיבים-צולבים המוגברים במוח של ילד עם פאנדס.'
      // },
      {
        id: 'imaging-heading',
        type: 'heading',
        title: 'הדמיות מוחיות'
      },
      {
        id: 'imaging-list',
        type: 'list',
        items: [
          {
            title: 'MRI',
            description: 'נוירולוג ילדים מזמין MRI. מחקרים מראים שנמצאו חריגות בסריקות מוח בילדים עם פאנס.'
          },
          {
            title: 'EEG',
            description: 'כמה ילדים נמצאו עם EEG לא תקין. זה יכול להיות פאנדס או בעיה אחרת של התקפים באונה הקדמית. EEG גם מומלץ אם הילד חווה הפרעות שינה.'
          },
          {
            title: 'PET או CT',
            description: 'אלו מוזמנים מדי פעם - במיוחד במקרים של מבוגרים צעירים - אך אינם מומלצים ברוב הילדים.'
          }
        ]
      }
    ],
    relatedPages: [
      {
        id: 'diagnosis',
        slug: 'diagnosis',
        title: 'אבחון פאנדס',
        description: 'האבחון מבוסס על תסמינים, היסטוריה רפואית ובדיקות מעבדה.',
        imageUrl: relatedImage1,
        imageAlt: 'אבחון פאנדס'
      },
      {
        id: 'treatment',
        slug: 'treatment',
        title: 'טיפול ב-פאנדס',
        description: 'טיפול מוקדם יכול לצמצם משך וחומרה של תסמינים.',
        imageUrl: relatedImage2,
        imageAlt: 'טיפול ב-פאנדס'
      },
      {
        id: 'faq',
        slug: 'faq',
        title: 'שאלות נפוצות',
        description: 'תשובות לשאלות שכיחות של הורים, מטפלים ותומכים.',
        imageUrl: relatedImage3,
        imageAlt: 'שאלות נפוצות'
      }
    ]
  },

  treatment: {
    id: 'treatment',
    title: 'טיפול',
    slug: 'treatment',
    description: 'אפשרויות טיפול ב-פאנדס/פאנס ופרוגנוזה',
    content: [
      {
        id: 'treatment-intro',
        type: 'callout',
        variant: 'success',
        title: 'למה טיפול מוקדם חשוב?',
        content: 'התלקחות יכולה לחזור ולהפוך; הן נוטות להתארך ולהחמיר עם כל אפיזודה. פאנדס/פאנס לא מטופל יכול לגרום לנכות קבועה, ובמקרים מסוימים יכול להפוך לדלקת מוח. זיהומי סטרפ חוזרים יכולים לגרום לבעיות חמורות, לכן חיוני לחסל את הסטרפ. כשמטופל מוקדם ובזמן, פאנדס/פאנס יכול להיעלם לחלוטין.'
      },
      {
        id: 'antibiotics-heading',
        type: 'heading',
        title: 'אנטיביוטיקה'
      },
      {
        id: 'antibiotics-intro',
        type: 'paragraph',
        content: 'סוג הזיהום קובע את סוג האנטיביוטיקה הנדרשת. אם לא מתרחש שיפור לאורך זמן, ייתכן שנדרשת אנטיביוטיקה אחרת או שקיים זיהום שונה או נוסף.'
      },
      {
        id: 'antibiotics-list',
        type: 'list',
        items: [
          {
            title: 'פניצילין',
            description: 'בחירה ראשונה מצוינת כי זו אנטיביוטיקה מניעתית נחקרת היטב למחלות כמו קדחת שיגרונית וכוריאה של סידנהאם.'
          },
          {
            title: 'אוגמנטין (אמוקסיצילין/קלבולנט)',
            description: 'משמש על ידי רופאים רבים בקונסורציום.'
          },
          {
            title: 'צפלוספורינים (צפלקסין, צפדיניר)',
            description: 'מצוינים לעצירת רוב זני הסטרפ.'
          },
          {
            title: 'אזיתרומיצין',
            description: 'אנטיביוטיקה רחבת טווח המגינה מפני צורות רבות של חיידקים. מחקר הראה שאזיתרומיצין עוזר לטפל בנוער עם OCD בהופעה חריפה.'
          }
        ]
      },
      {
        id: 'prophylactic-heading',
        type: 'heading',
        title: 'אנטיביוטיקה מניעתית'
      },
      {
        id: 'prophylactic-paragraph',
        type: 'paragraph',
        content: 'רופאים ממליצים שילד עם פאנדס יישאר על אנטיביוטיקה מניעתית בהתאם להנחיות קדחת שיגרונית (RF) שנקבעו על ידי האקדמיה האמריקאית לרפואת ילדים. ההנחיה קובעת שמניעה צריכה להימשך חמש שנים לאחר ההתקף האחרון, או עד גיל 21 (הארוך מביניהם).'
      },
      {
        id: 'prophylactic-callout',
        type: 'callout',
        variant: 'info',
        title: 'יעילות אנטיביוטיקה מניעתית',
        content: 'מחקר הראה הפחתה כוללת של 61% בהתלקחויות תסמינים נוירו-פסיכיאטריים במהלך שנת מניעה אנטיביוטית, והפחתה של 94% בהתלקחויות שנגרמו על ידי סטרפ.'
      },
      {
        id: 'ivig-heading',
        type: 'heading',
        title: 'IVIG (אימונוגלובולין תוך-ורידי)'
      },
      {
        id: 'ivig-paragraph',
        type: 'paragraph',
        content: 'IVIG הוא מוצר דם תוך-ורידי המורכב מאימונוגלובולינים המשמש לטיפול בחסרים חיסוניים, דלקת מוח ומצבים רפואיים אחרים. IVIG הוכח כמועיל לרוב הילדים עם פאנדס/פאנס.'
      },
      {
        id: 'ivig-results',
        type: 'callout',
        variant: 'success',
        title: 'תוצאות מחקר IVIG',
        content: 'מחקר NIMH הראה הפחתה ממוצעת של 60% בתסמינים בחולי פאנדס. ב-21 מטופלים עם פאנס בינוני עד חמור, התוצאות הדגימו הפחתות משמעותיות בתסמינים מתחילת הטיפול ועד סופו.'
      },
      {
        id: 'plasmapheresis-heading',
        type: 'heading',
        title: 'פלסמפרזיס (החלפת פלזמה)'
      },
      {
        id: 'plasmapheresis-paragraph',
        type: 'paragraph',
        content: 'פלסמפרזיס (אפרזיס) או החלפת פלזמה (PEX) הוא תהליך שבו נוגדנים עצמיים מזיקים מוסרים ממערכת הדם. הליך זה מתבצע בסביבה בית-חולימית. כאשר ילד מציג תסמינים חמורים שייחשבו מסכני חיים, פלסמפרזיס עשוי להיות שיטת הטיפול המועדפת בשל קצב התגובה המהיר.'
      },
      {
        id: 'other-treatments-heading',
        type: 'heading',
        title: 'טיפולים נוספים'
      },
      {
        id: 'other-treatments-list',
        type: 'list',
        items: [
          {
            title: 'CBT/ERP (טיפול קוגניטיבי-התנהגותי)',
            description: 'עשוי להיות מועיל לילד עם פאנדס בהחלמה. התערבויות רפואיות כמו אנטיביוטיקה, IVIG וכו\' נדרשות ליצור בסיס לפני הכנסת טיפול.'
          },
          {
            title: 'סטרואידים',
            description: 'סטרואידים ככל הנראה מפחיתים את הדלקת המתרחשת במוח הילד והוכחו כמפחיתים את חומרת התסמינים בחולים עם כוריאה של סידנהאם. יש לטפל בזיהומים פעילים עם שימוש בסטרואידים.'
          },
          {
            title: 'כריתת שקדים',
            description: 'כריתת שקדים עשויה להישקל על ידי רופא אא"ג מנוסה. מחקרים מסוימים הראו שיפור ניכר לאחר כריתת שקדים, כולל הפסקה מלאה של תסמינים בחלק מהמטופלים.'
          },
          {
            title: 'אומגה 3',
            description: 'חלק מהילדים מומלץ להם ליטול תוסף אומגה-3 בשל השפעתו החיובית הידועה על תפקוד המוח. הוא גם ידוע כמפחית דלקת, מפחית היפראקטיביות ומגביר ריכוז בילדים עם ADHD.'
          },
          {
            title: 'NSAIDs (איבופרופן)',
            description: 'חלק מהילדים חווים הקלה זמנית בתסמינים עם איבופרופן. אם ילד לא מראה שיפור עם איבופרופן, זה לא שולל אבחנה אפשרית של פאנדס או פאנס.'
          },
          {
            title: 'פרוביוטיקה',
            description: 'פרוביוטיקה עוזרת לשמור על חיידקי מעי בריאים, שיכולים להיפגע עם שימוש באנטיביוטיקה. יש ליטול פרוביוטיקה לפחות שעתיים בנפרד מאנטיביוטיקה.'
          }
        ]
      },
      {
        id: 'prognosis-heading',
        type: 'heading',
        title: 'פרוגנוזה'
      },
      {
        id: 'prognosis-intro',
        type: 'paragraph',
        content: 'הורים רוצים לדעת אם ילדם יגדל מ-פאנדס ו-פאנס. כרגע אין מחקר פרוספקטיבי ארוך טווח של ילדי פאנדס/פאנס. הפרוגנוזה אינה ידועה לאורך חיים שלם. עם זאת, אנו רואים תוצאות חיוביות עבור רוב הילדים.'
      },
      {
        id: 'prognosis-positive',
        type: 'callout',
        variant: 'success',
        title: 'תוצאות חיוביות עם טיפול',
        content: 'קונסורציום פאנס נפגש לדון בתוצאות מקרים מאז 2013, ורוב הילדים משתפרים וחוזרים לבית הספר ולפעילויות חברתיות רגילות עם טיפולי אימונומודולציה.'
      },
      {
        id: 'prognosis-maturity',
        type: 'callout',
        variant: 'info',
        title: 'תוצאות חיוביות עם בגרות',
        content: 'הרגישות לסטרפטוקוק קבוצה A פוחתת עבור רוב הילדים עד גיל ההתבגרות. תקלות במערכת החיסון בילדות (כמו דיסגמגלובולינמיה, נויטרופניה, אלרגיות חמורות וכו\') לעיתים קרובות נעלמות כאשר ילדים מתבגרים לבגרות צעירה.'
      },
      {
        id: 'takeaways-heading',
        type: 'heading',
        title: 'נקודות חשובות ממקרים יציבים'
      },
      {
        id: 'takeaways-list',
        type: 'list',
        items: [
          'זהו ומנעו כל זיהום פעיל כשהילד במצב בריאותי יציב',
          'הכירו את מערכת החיסון של הילד ושמרו על הרגלי תזונה בריאים',
          'הכירו את ההיסטוריה המשפחתית של מחלות אוטואימוניות',
          'לעיתים קרובות חרדה קלה או OCD עשויים להימשך, ותמיכה פסיכולוגית מתמשכת מועילה למטופל ולמשפחה',
          'במקרה של סטרפ, ספרו לרופאים על היסטוריה משפחתית של קדחת שיגרונית או היסטוריית סטרפ דומה'
        ]
      },
      {
        id: 'knowledge-callout',
        type: 'callout',
        variant: 'tip',
        title: 'ידע הוא כוח!',
        content: 'הישארו מעודכנים ותמכו בקהילת ההורים. מחקר גנטי מתבצע בכל מרכז מחקר פאנס ברחבי העולם, ואנו מקווים שבתוך עשור זה יעזור להסביר את הנטייה לתגובה יתר אוטואימונית.'
      }
    ],
    relatedPages: [
      {
        id: 'diagnosis',
        slug: 'diagnosis',
        title: 'אבחון פאנדס',
        description: 'האבחון מבוסס על תסמינים, היסטוריה רפואית ובדיקות מעבדה.',
        imageUrl: relatedImage1,
        imageAlt: 'אבחון פאנדס'
      },
      {
        id: 'treatment',
        slug: 'treatment',
        title: 'טיפול ב-פאנדס',
        description: 'טיפול מוקדם יכול לצמצם משך וחומרה של תסמינים.',
        imageUrl: relatedImage2,
        imageAlt: 'טיפול ב-פאנדס'
      },
    ]
  },
};

// Assessment Scales Data
export const assessmentScales: AssessmentScale[] = [
  {
    id: 'pans-rating-scale',
    title: 'PANS Symptom Rating Scale',
    titleHe: 'מדד דירוג תסמיני פאנס',
    description: 'A 31-item scale to quantify the frequency and severity of PANS symptoms',
    descriptionHe: 'מדד בן 31 פריטים לכימות תדירות וחומרת תסמיני פאנס',
    type: 'external',
    externalUrl: 'https://pandasnetwork.org/wp-content/uploads/2024/06/PANS-31-Item-Symptom-Rating-Scale-4-30-24.pdf'
  },
  {
    id: 'ybocs',
    title: 'Y-BOCS (Yale-Brown OCD Scale)',
    titleHe: 'מדד ייל-בראון ל-OCD',
    description: 'Scale to measure OCD severity',
    descriptionHe: 'מדד למדידת חומרת OCD',
    type: 'external',
    externalUrl: 'https://pandasnetwork.org/wp-content/uploads/2018/11/y-bocs-w-checklist.pdf'
  },
  {
    id: 'ygtss',
    title: 'YGTSS (Yale Global Tic Severity Scale)',
    titleHe: 'מדד ייל לחומרת טיקים',
    description: 'Scale to measure tic severity',
    descriptionHe: 'מדד למדידת חומרת טיקים',
    type: 'external',
    externalUrl: 'https://pandasnetwork.org/wp-content/uploads/2018/11/YGTSS.pdf'
  },
  {
    id: 'caregiver-burden',
    title: 'Caregiver Burden Scale',
    titleHe: 'מדד עומס המטפל',
    description: 'Scale to assess caregiver burden',
    descriptionHe: 'מדד להערכת עומס המטפל/ים',
    type: 'external',
    externalUrl: 'https://pandasnetwork.org/wp-content/uploads/2024/03/FTLDA-CARGIVER-BURDEN-SCALE.pdf'
  },
  {
    id: 'quick-symptom-check',
    title: 'Quick Symptom Checklist',
    titleHe: 'רשימת תסמינים מהירה',
    description: 'Interactive quick assessment for parents',
    descriptionHe: 'הערכה מהירה אינטראקטיבית להורים',
    type: 'interactive',
    questions: [
      {
        id: 'q1',
        question: 'Sudden onset of OCD symptoms (obsessive thoughts, compulsive behaviors)',
        questionHe: 'הופעה פתאומית של תסמיני OCD (מחשבות טורדניות, התנהגויות כפייתיות)',
        options: [
          { value: 0, label: 'Not present', labelHe: 'לא קיים' },
          { value: 1, label: 'Mild', labelHe: 'קל' },
          { value: 2, label: 'Moderate', labelHe: 'בינוני' },
          { value: 3, label: 'Severe', labelHe: 'חמור' }
        ]
      },
      {
        id: 'q2',
        question: 'Severe anxiety or panic attacks',
        questionHe: 'חרדה חמורה או התקפי פאניקה',
        options: [
          { value: 0, label: 'Not present', labelHe: 'לא קיים' },
          { value: 1, label: 'Mild', labelHe: 'קל' },
          { value: 2, label: 'Moderate', labelHe: 'בינוני' },
          { value: 3, label: 'Severe', labelHe: 'חמור' }
        ]
      },
      {
        id: 'q3',
        question: 'Motor or vocal tics',
        questionHe: 'טיקים מוטוריים או קוליים',
        options: [
          { value: 0, label: 'Not present', labelHe: 'לא קיים' },
          { value: 1, label: 'Mild', labelHe: 'קל' },
          { value: 2, label: 'Moderate', labelHe: 'בינוני' },
          { value: 3, label: 'Severe', labelHe: 'חמור' }
        ]
      },
      {
        id: 'q4',
        question: 'Emotional lability (rapid mood changes, crying spells)',
        questionHe: 'לאביליות רגשית (שינויי מצב רוח מהירים, התקפי בכי)',
        options: [
          { value: 0, label: 'Not present', labelHe: 'לא קיים' },
          { value: 1, label: 'Mild', labelHe: 'קל' },
          { value: 2, label: 'Moderate', labelHe: 'בינוני' },
          { value: 3, label: 'Severe', labelHe: 'חמור' }
        ]
      },
      {
        id: 'q5',
        question: 'Irritability or aggression',
        questionHe: 'עצבנות או תוקפנות',
        options: [
          { value: 0, label: 'Not present', labelHe: 'לא קיים' },
          { value: 1, label: 'Mild', labelHe: 'קל' },
          { value: 2, label: 'Moderate', labelHe: 'בינוני' },
          { value: 3, label: 'Severe', labelHe: 'חמור' }
        ]
      },
      {
        id: 'q6',
        question: 'Behavioral regression (acting younger than age)',
        questionHe: 'רגרסיה התנהגותית (התנהגות צעירה מהגיל)',
        options: [
          { value: 0, label: 'Not present', labelHe: 'לא קיים' },
          { value: 1, label: 'Mild', labelHe: 'קל' },
          { value: 2, label: 'Moderate', labelHe: 'בינוני' },
          { value: 3, label: 'Severe', labelHe: 'חמור' }
        ]
      },
      {
        id: 'q7',
        question: 'Decline in school performance',
        questionHe: 'ירידה בביצועים בבית הספר',
        options: [
          { value: 0, label: 'Not present', labelHe: 'לא קיים' },
          { value: 1, label: 'Mild', labelHe: 'קל' },
          { value: 2, label: 'Moderate', labelHe: 'בינוני' },
          { value: 3, label: 'Severe', labelHe: 'חמור' }
        ]
      },
      {
        id: 'q8',
        question: 'Sensory sensitivities (light, sound, touch)',
        questionHe: 'רגישויות חושיות (אור, קול, מגע)',
        options: [
          { value: 0, label: 'Not present', labelHe: 'לא קיים' },
          { value: 1, label: 'Mild', labelHe: 'קל' },
          { value: 2, label: 'Moderate', labelHe: 'בינוני' },
          { value: 3, label: 'Severe', labelHe: 'חמור' }
        ]
      },
      {
        id: 'q9',
        question: 'Sleep disturbances',
        questionHe: 'הפרעות שינה',
        options: [
          { value: 0, label: 'Not present', labelHe: 'לא קיים' },
          { value: 1, label: 'Mild', labelHe: 'קל' },
          { value: 2, label: 'Moderate', labelHe: 'בינוני' },
          { value: 3, label: 'Severe', labelHe: 'חמור' }
        ]
      },
      {
        id: 'q10',
        question: 'Food restriction or eating difficulties',
        questionHe: 'הגבלת אוכל או קשיי אכילה',
        options: [
          { value: 0, label: 'Not present', labelHe: 'לא קיים' },
          { value: 1, label: 'Mild', labelHe: 'קל' },
          { value: 2, label: 'Moderate', labelHe: 'בינוני' },
          { value: 3, label: 'Severe', labelHe: 'חמור' }
        ]
      }
    ],
    maxScore: 30,
    interpretation: [
      {
        minScore: 0,
        maxScore: 5,
        label: 'Minimal',
        labelHe: 'מינימלי',
        description: 'Few or no concerning symptoms',
        descriptionHe: 'מעט או ללא תסמינים מדאיגים',
        severity: 'minimal'
      },
      {
        minScore: 6,
        maxScore: 12,
        label: 'Mild',
        labelHe: 'קל',
        description: 'Some symptoms present, consider monitoring',
        descriptionHe: 'כמה תסמינים קיימים, יש לשקול מעקב',
        severity: 'mild'
      },
      {
        minScore: 13,
        maxScore: 19,
        label: 'Moderate',
        labelHe: 'בינוני',
        description: 'Multiple symptoms present, consider consultation',
        descriptionHe: 'מספר תסמינים קיימים, יש לשקול התייעצות',
        severity: 'moderate'
      },
      {
        minScore: 20,
        maxScore: 25,
        label: 'Severe',
        labelHe: 'חמור',
        description: 'Significant symptoms, professional evaluation recommended',
        descriptionHe: 'תסמינים משמעותיים, מומלץ הערכה מקצועית',
        severity: 'severe'
      },
      {
        minScore: 26,
        maxScore: 30,
        label: 'Extreme',
        labelHe: 'קיצוני',
        description: 'Severe symptoms, urgent professional evaluation needed',
        descriptionHe: 'תסמינים חמורים, נדרשת הערכה מקצועית דחופה',
        severity: 'extreme'
      }
    ]
  }
];

// Navigation items for the info section
export const infoNavItems = [
  {
    id: 'overview',
    title: 'מידע על התסמונות',
    slug: 'overview'
  },
  {
    id: 'symptoms',
    title: 'סימנים ותסמינים',
    slug: 'symptoms'
  },
  {
    id: 'diagnosis',
    title: 'אבחון',
    slug: 'diagnosis'
  },
  {
    id: 'treatment',
    title: 'טיפול',
    slug: 'treatment'
  },
];
