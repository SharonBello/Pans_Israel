import type { InfoSection } from '../types/info.types';
import relatedImage1 from '../styles/assets/related_image_1.jpg';
import relatedImage2 from '../styles/assets/related_image_2.jpg';
import relatedImage3 from '../styles/assets/related_image_3.jpg';
import relatedImage4 from '../styles/assets/related_image_4.jpg';

// Extended types for Resources
export interface ResourceLink {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  url: string;
  type: 'pdf' | 'external' | 'video' | 'article';
  icon?: string;
}

export interface ResourceCategory {
  id: string;
  title: string;
  description?: string;
  links: ResourceLink[];
}

export const resourceSections: Record<string, InfoSection> = {
  overview: {
    id: 'overview',
    title: 'משאבים',
    slug: 'overview',
    description: 'מרכז משאבים מקיף עבור הורים, אנשי מקצוע ומחנכים',
    content: [
      {
        id: 'intro-heading',
        type: 'heading',
        title: 'משאבים להתמודדות עם פאנס/פאנדס'
      },
      {
        id: 'intro-paragraph',
        type: 'paragraph',
        content: 'צוללים לספריית המשאבים שלנו הכוללת מידע ממומחים רפואיים ומטפלים על פאנס/פאנדס. כאן תמצאו מדריכים להורדה, סרטוני הדרכה, קישורים לאתרים מועילים ומאמרי חדשות.'
      },
      {
        id: 'for-parents-callout',
        type: 'callout',
        variant: 'info',
        title: 'משאבים להורים',
        content: 'מרשימות רופאים מומחים ועד סיפורי חיים אמיתיים, גלו את כל המשאבים שלנו להורים שיעזרו לכם לטפל בילדכם החי עם פאנס/פאנדס ולהעלות מודעות בקהילה שלכם.'
      },
      {
        id: 'for-clinicians-callout',
        type: 'callout',
        variant: 'tip',
        title: 'משאבים לאנשי מקצוע',
        content: 'הישארו מעודכנים במידע האחרון על הנחיות אבחון, מחקר פורץ דרך, אפשרויות טיפול יעילות, דרכים להתחבר לקולגות בתחום ועוד.'
      },
      {
        id: 'for-educators-callout',
        type: 'callout',
        variant: 'success',
        title: 'משאבים למחנכים',
        content: 'קבלו גישה למידע ותובנות על חינוך ילדים וצעירים בכיתה עם פאנס/פאנדס.'
      },
      {
        id: 'quick-links-heading',
        type: 'heading',
        title: 'קישורים מהירים'
      },
      {
        id: 'quick-downloads',
        type: 'list',
        title: 'מסמכים להורדה',
        items: [
          {
            title: 'עובדות מהירות על פאנס/פאנדס',
            description: 'מדריך קצר ותמציתי להבנת התסמונות'
          },
          {
            title: 'ערכת כלים חינוכית',
            description: 'ערכה מקיפה לצוות בית הספר'
          },
          {
            title: 'חוברת מידע',
            description: 'חוברת להפצה בקהילה'
          }
        ]
      }
    ],
    relatedPages: [
      {
        id: 'parents',
        title: 'משאבים להורים',
        description: 'מדריכים, מכתבים לדוגמה וטיפים להתמודדות',
        imageUrl: relatedImage1,
        slug: 'parents'
      },
      {
        id: 'clinicians',
        title: 'משאבים לאנשי מקצוע',
        description: 'הנחיות אבחון, מחקר ופרוטוקולי טיפול',
        imageUrl: relatedImage2,
        slug: 'clinicians'
      },
      {
        id: 'educators',
        title: 'משאבים למחנכים',
        description: 'כלים והתאמות לסביבה החינוכית',
        imageUrl: relatedImage3,
        slug: 'educators'
      },
      // {
      //   id: 'videos',
      //   title: 'סרטונים ווובינרים',
      //   description: 'ספריית וידאו ממומחים רפואיים',
      //   imageUrl: relatedImage4,
      //   slug: 'videos'
      // }
    ]
  },

  parents: {
    id: 'parents',
    title: 'משאבים להורים',
    slug: 'parents',
    description: 'כל מה שהורים צריכים לדעת על החיים עם פאנס/פאנדס',
    content: [
      {
        id: 'living-heading',
        type: 'heading',
        title: 'החיים עם פאנס/פאנדס'
      },
      {
        id: 'living-paragraph',
        type: 'paragraph',
        content: 'ללמוד שלילדכם או לאדם אהוב אובחנה פאנס/פאנדס זה לא קל. הדבר החשוב ביותר הוא להיות תומכים ומודעים לכאב ולבלבול שהם עשויים לחוות. עם אבחון וטיפול מוקדם, למטופלים יש סיכוי גבוה יותר להחלים ולהבריא מהתסמינים.'
      },
      {
        id: 'advocate-callout',
        type: 'callout',
        variant: 'tip',
        title: 'היו עורכי דין של ילדכם',
        content: 'עזרו להגן על יקירכם כדי לקבל את סוג הטיפול הנכון, במיוחד אם הם לא מסוגלים לתקשר בעצמם. חנכו את בני המשפחה, את בית הספר של ילדכם, שכנים ונותני שירותי בריאות באמצעות מקורות אמינים.'
      },
      {
        id: 'faq-heading',
        type: 'heading',
        title: 'שאלות נפוצות להורים'
      },
      {
        id: 'faq-accordion',
        type: 'accordion',
        items: [
          {
            title: 'מהן פאנס/פאנדס?',
            description: 'PANDAS (הפרעות נוירופסיכיאטריות אוטואימוניות ילדיות הקשורות לסטרפטוקוק) ו-PANS (תסמונת נוירופסיכיאטרית ילדית בהופעה חריפה) הן תסמונות נוירופסיכיאטריות הנגרמות על ידי תגובה מוטעית של מערכת החיסון.'
          },
          {
            title: 'מה גורם ל-פאנס/פאנדס?',
            description: 'מטופלים עשויים לחוות תסמינים לאחר "גירוי חזק" למערכת החיסון, כמו זיהום סטרפ, שפעת, דלקת ריאות או אפילו הצטננות רגילה. במטופלים עם פאנס/פאנדס, מערכת החיסון מגיבה בטעות וגורמת לתגובה אוטואימונית שגורמת לדלקת בחלק המוח האחראי על שליטה מוטורית, תפקודים ניהוליים, התנהגויות ורגשות.'
          },
          {
            title: 'מהם תסמינים אופייניים של פאנס/פאנדס?',
            description: 'פאנס/פאנדס יכולות לייצר תסמינים פתאומיים, לא אחידים וחריגים בילדים, בדרך כלל בגילאי 4 עד 10. אך זה יכול להופיע גם אצל מתבגרים, ומחקר חדש מצביע על כך שזה יכול להתרחש גם בבגרות צעירה. תסמינים עשויים לכלול חרדת נטישה, אובססיות וכפיות, חוסר יכולת לסבול פעילויות מסוימות, טיקים, תנועות לא רצוניות או היפראקטיביות.'
          },
          {
            title: 'אילו סוגי טיפולים זמינים?',
            description: 'הטיפולים הבאים יכולים לעזור להקל על תסמיני פאנס/פאנדס: אנטיביוטיקה (פניצילין, אוגמנטין, צפלוספורינים, אזיתרומיצין), IVIG (אימונוגלובולין תוך-ורידי), פלסמפרזיס, סטרואידים, כריתת שקדים, וטיפול קוגניטיבי-התנהגותי (CBT/ERP).'
          },
          {
            title: 'למה כל כך קשה למצוא אבחנה וטיפול לילדי?',
            description: 'יש מחקר מוגבל על פאנס/פאנדס, והמצב מאובחן לעיתים קרובות בטעות. בנוסף, פאנס/פאנדס עשויות להתרחש עם הפרעות אוטואימוניות אחרות, חסר חיסוני או הפרעות נוירולוגיות או פסיכיאטריות אחרות. זה יכול להפוך את הטיפול והניהול למורכבים יותר.'
          }
        ]
      },
      {
        id: 'downloads-heading',
        type: 'heading',
        title: 'מדריכים ומשאבים להורדה'
      },
      {
        id: 'downloads-list',
        type: 'list',
        items: [
          {
            title: 'עובדות מהירות על פאנס/פאנדס',
            description: 'PDF - מדריך תמציתי'
          },
          {
            title: 'חדש ל-פאנס/פאנדס?',
            description: 'מדריך התחלתי להורים חדשים'
          },
          {
            title: 'חוברת פאנדס',
            description: 'חוברת מידע להפצה'
          }
        ]
      },
      {
        id: 'letters-heading',
        type: 'heading',
        title: 'מכתבים לדוגמה למשפחות'
      },
      {
        id: 'letters-paragraph',
        type: 'paragraph',
        content: 'תוכלו להשתמש במסגרות אלו ליצירת מכתב למורים, מנהלים וצוות שמתקשרים עם ילדכם בבית הספר. העתיקו והדביקו את הטקסט, ואז התאימו אותם לשימוש האישי שלכם.'
      },
      {
        id: 'letters-list',
        type: 'list',
        items: [
          {
            title: 'מכתב לבית הספר בזמן התלקחות פאנס/פאנדס',
            description: 'לשימוש כשהילד נמצא באפיזודה פעילה'
          },
          {
            title: 'מכתב לבית הספר בזמן הפוגה',
            description: 'לשימוש כשהילד במצב יציב'
          },
          {
            title: 'מכתב בקשה להתראה על חשיפה לסטרפ',
            description: 'בקשה מבית הספר להודיע על מקרי סטרפ בכיתה'
          }
        ]
      },
      {
        id: 'tips-heading',
        type: 'heading',
        title: 'טיפים לתקשורת עם בית הספר'
      },
      {
        id: 'tips-callout',
        type: 'callout',
        variant: 'info',
        title: 'הצעות שימושיות',
        content: 'גם אם אין לכם תוכנית 504 או IEP, עדיין תוכלו לדבר עם המורה/ים וההנהלה על מה שיהפוך את בית הספר לנוח יותר עבור ילדכם ועבורכם.'
      },
      {
        id: 'tips-list',
        type: 'list',
        items: [
          'התקשרו למנהל ובקשו להיות מודעים כשתלמיד בכיתה נעדר עקב סטרפ',
          'דברו עם המורה על מתן הפסקות שירותים תכופות אם תכיפות במתן שתן היא בעיה',
          'קבעו "קוד" עם המורה - אות שהתלמיד מוצף וזקוק להפסקה מהכיתה',
          'קבלו אישור לילדכם להשתמש בבקבוק מים בכיתה למניעת חשיפה לחיידקים ממזרקות מים',
          'בדקו יומני כתיבה ישנים לשינויים אפשריים בכתב יד - כולל סטיות משוליים ובעיות קריאות'
        ]
      }
    ],
    relatedPages: [
      {
        id: 'educators',
        title: 'משאבים למחנכים',
        description: 'כלים והתאמות לסביבה החינוכית',
        imageUrl: relatedImage1,
        slug: 'educators'
      },
      {
        id: 'clinicians',
        title: 'משאבים לאנשי מקצוע',
        description: 'הנחיות אבחון ופרוטוקולי טיפול',
        imageUrl: relatedImage2,
        slug: 'clinicians'
      },
      {
        id: 'websites',
        title: 'אתרים מועילים',
        description: 'קישורים לארגונים ומשאבים נוספים',
        imageUrl: relatedImage3,
        slug: 'websites'
      }
    ]
  },

  clinicians: {
    id: 'clinicians',
    title: 'משאבים לאנשי מקצוע',
    slug: 'clinicians',
    description: 'מידע מקצועי עבור רופאים, פסיכולוגים ואנשי טיפול',
    content: [
      {
        id: 'intro-heading',
        type: 'heading',
        title: 'משאבים לאנשי מקצוע בתחום הבריאות'
      },
      {
        id: 'intro-paragraph',
        type: 'paragraph',
        content: 'אין גישה אחת שמתאימה לכולם לאבחון וטיפול במטופל עם פאנס/פאנדס. אנו כאן לעזור לכם עם תובנות נוספות ומחקר כדי שתוכלו לספק למטופלים ולמשפחותיהם את המידע והתמיכה העדכניים ביותר בזמן שהם מנווטים בהפרעה זו.'
      },
      {
        id: 'faq-heading',
        type: 'heading',
        title: 'שאלות נפוצות לאנשי מקצוע'
      },
      {
        id: 'faq-accordion',
        type: 'accordion',
        items: [
          {
            title: 'אילו בדיקות זמינות ל-פאנס/פאנדס?',
            description: 'כרגע, אין בדיקה מוחלטת 100% ל-פאנס/פאנדס, ולכן האבחנה נעשית על בסיס הערכה קלינית של התסמינים הנוירולוגיים ובריאות הנפש, יחד עם היסטוריה רפואית וממצאי מעבדה. אם אתם חושדים שלמטופל שלכם יש פאנס/פאנדס, בדיקות מעבדה כולל בדיקות דם בסיסיות, בדיקות ויראליות/חיידקיות כולל תרביות גרון לסטרפ ופאנל קנינגהם יכולות לעזור באבחנה נכונה.'
          },
          {
            title: 'אילו טיפולים זמינים לילדים עם פאנס/פאנדס?',
            description: 'אנטיביוטיקה (פניצילין, אוגמנטין, צפלוספורינים, אזיתרומיצין), אנטיביוטיקה מניעתית, IVIG, פלסמפרזיס, סטרואידים, כריתת שקדים, וטיפול קוגניטיבי-התנהגותי או חשיפה ומניעת תגובה (ERP).'
          },
          {
            title: 'מהם גורמי הסיכון ל-פאנס/פאנדס?',
            description: 'למרות שסטרפ הוא הטריגר הנפוץ ביותר ל-פאנס/פאנדס, חיידקים, וירוסים וגורמים סביבתיים אחרים יכולים ליצור את התגובה החיסונית המוטעית, כולל Mycoplasma pneumoniae, זיהומי סטאפ, מחלת ליים, שפעת, קוקסקי, אפשטיין-בר ונגיף הרפס סימפלקס. טריגרים אפשריים נוספים כוללים חשיפה למחלה, אלרגיות, מתח, כלור, תזונה וצמיחת יתר של שמרים.'
          },
          {
            title: 'מה צריך לדעת על אינטראקציה עם הורים?',
            description: 'זו ההזדמנות שלכם לעשות הבדל גדול ולהשפיע עמוקות על ילדים ומשפחות. אתם יכולים להיות מקור חשוב לתקווה במצב שיכול להרגיש נואש. בקשו ממשפחות לצלם וידאו של ילדם ולשלוח לכם. הכינו המלצות לאימונולוגים, נוירולוגים, פסיכולוגים ופסיכיאטרים ילדים מקומיים מהימנים.'
          }
        ]
      },
      {
        id: 'resources-heading',
        type: 'heading',
        title: 'משאבים נוספים לאנשי מקצוע'
      },
      {
        id: 'resources-list',
        type: 'list',
        items: [
          {
            title: 'PANDAS Physicians Network',
            description: 'רשת רופאים בינלאומית מקצועית עם הנחיות אבחון וטיפול'
          },
          {
            title: 'המכון הלאומי לבריאות הנפש (NIMH)',
            description: 'סוכנות המחקר הפדרלית המובילה להפרעות נפשיות'
          },
          {
            title: 'International OCD Foundation',
            description: 'המשימה היא לעזור לכל מי שמושפע מ-OCD והפרעות קשורות'
          },
          {
            title: 'ערכות כלים למחלות נדירות',
            description: 'מידע שימושי על חיים עם או תמיכה במטופלים עם מחלות נדירות'
          }
        ]
      },
      {
        id: 'pdf-heading',
        type: 'heading',
        title: 'משאבי PDF'
      },
      {
        id: 'pdf-list',
        type: 'list',
        items: [
          {
            title: 'עובדות מהירות על פאנס/פאנדס',
            description: 'סיכום תמציתי לאנשי מקצוע'
          },
          {
            title: 'עובדות מהירות לאחיות בית ספר',
            description: 'מדריך ספציפי לאחיות בית ספר'
          },
          {
            title: 'חוברת פאנדס',
            description: 'חוברת מידע מקיפה'
          }
        ]
      }
    ],
    relatedPages: [
      {
        id: 'parents',
        title: 'משאבים להורים',
        description: 'מדריכים וטיפים להתמודדות',
        imageUrl: relatedImage1,
        slug: 'parents'
      },
      // {
      //   id: 'videos',
      //   title: 'סרטונים ווובינרים',
      //   description: 'ספריית וידאו ממומחים רפואיים',
      //   imageUrl: relatedImage2,
      //   slug: 'videos'
      // },
      // {
      //   id: 'news',
      //   title: 'חדשות ומאמרים',
      //   description: 'עדכונים אחרונים מהתחום',
      //   imageUrl: relatedImage3,
      //   slug: 'news'
      // }
    ]
  },

  educators: {
    id: 'educators',
    title: 'משאבים למחנכים',
    slug: 'educators',
    description: 'כלים ומידע למורים, יועצים וצוות בית ספר',
    content: [
      {
        id: 'intro-heading',
        type: 'heading',
        title: 'פאנס/פאנדס בסביבה בית ספרית'
      },
      {
        id: 'intro-paragraph',
        type: 'paragraph',
        content: 'קבוצת העבודה לגישה חינוכית של רשת פאנדס פיתחה ערכת כלים להורדה לצוות בית הספר, ושיתפה פעולה עם סטודנטים לתואר שני בריפוי בעיסוק מאוניברסיטת באפלו לפיתוח הדרכה פיילוט בת 1.5 שעות לצוות בית הספר.'
      },
      {
        id: 'toolkit-callout',
        type: 'callout',
        variant: 'success',
        title: 'ערכת כלים חינוכית',
        content: 'הורידו את ערכת הכלים החינוכית המקיפה שלנו הכוללת מידע, טיפים והמלצות לעבודה עם תלמידים עם פאנס/פאנדס.'
      },
      {
        id: 'impact-heading',
        type: 'heading',
        title: 'כיצד פאנס/פאנדס יכולות להשפיע על השתתפות בבית הספר?'
      },
      {
        id: 'impact-paragraph',
        type: 'paragraph',
        content: 'תסמיני פאנס/פאנדס עשויים לגרום לחסרים בביצוע, במיוחד בתחומים הבאים:'
      },
      {
        id: 'impact-list',
        type: 'list',
        items: [
          {
            title: 'נוכחות',
            description: 'עקב חוסר שינה, עייפות'
          },
          {
            title: 'קוגניציה',
            description: 'כולל התנהגות, לימודים (קריאה, כתיבה ומתמטיקה), עומס חושי'
          },
          {
            title: 'מיומנויות מוטוריות עדינות',
            description: 'כתב יד והשלמת מטלות'
          },
          {
            title: 'בעיות תפיסתיות ופיזיות',
            description: 'המשפיעות על מיומנויות מוטוריות עדינות/גסות'
          },
          {
            title: 'תכיפות ושליטה במתן שתן',
            description: ''
          },
          {
            title: 'יכולת לאכול כרגיל',
            description: ''
          },
          {
            title: 'בעיות חברתיות עם עמיתים',
            description: ''
          }
        ]
      },
      {
        id: 'abilities-heading',
        type: 'heading',
        title: 'השפעה על יכולות התלמיד'
      },
      {
        id: 'abilities-paragraph',
        type: 'paragraph',
        content: 'בהתאם לחומרה, שעשויה להשתנות לאורך זמן, פאנס/פאנדס עשויות להשפיע על יכולת התלמיד:'
      },
      {
        id: 'abilities-list',
        type: 'list',
        items: [
          'להגיע ולנסוע לפעילויות הקשורות לבית הספר',
          'לשמור על קשב ממוקד ותפקוד ניהולי',
          'להסתגל למעברים ומתחים',
          'להבין ולזכור מידע',
          'לתקשר ביעילות, הן בעל פה והן בכתב',
          'להתנהג בדרכים המתאימות לגיל ולהפגין טיפול עצמי ומיומנויות חיי יומיום',
          'לשמור על רמת הסיבולת הפיזית והנפשית הקודמת שלהם'
        ]
      },
      {
        id: 'ihcp-heading',
        type: 'heading',
        title: 'כיצד לפתח תוכנית טיפול בריאותי אישית?'
      },
      {
        id: 'ihcp-list',
        type: 'list',
        title: 'אחיות בית ספר העובדות עם תלמידי פאנס/פאנדס יכולות ליישם את הצעדים הבאים:',
        items: [
          {
            title: 'התחילו בשיתוף פעולה',
            description: 'הכירו בצורך של מחנכים, נותני שירות, משפחה וכאשר אפשר, התלמיד, לספק משוב ולעבוד יחד'
          },
          {
            title: 'שקלו התערבויות',
            description: 'שיתייחסו לתסמינים המשפיעים על נוכחות והשתתפות במהלך יום הלימודים'
          },
          {
            title: 'שקלו שינויי לוח זמנים',
            description: 'פעילויות חלופיות ומיקומים, לוגיסטיקת הסעות וגמישות בנוכחות'
          },
          {
            title: 'שקלו טיפול תומך',
            description: 'ריפוי בעיסוק, פיזיותרפיה ותמיכה במיומנויות חברתיות'
          }
        ]
      },
      {
        id: 'accommodations-heading',
        type: 'heading',
        title: 'התאמות לימודיות ובדיקות'
      },
      {
        id: 'accommodations-list',
        type: 'list',
        items: [
          'הוראות לזמן נוסף',
          'סביבות ללא הסחות דעת',
          'טכנולוגיה מסייעת',
          'שיטות חלופיות של גישה והשלמה',
          'תעדוף השלמת מטלות שנועד לשקף מיומנות',
          'שימוש בעוזרי הערות',
          'עומס עבודה מופחת או שיעורי בית מופחתים',
          'תקופות מנוחה עם אחות',
          'חינוך גופני מותאם והוראה בבית/בית חולים'
        ]
      },
      // {
      //   id: 'books-heading',
      //   type: 'heading',
      //   title: 'ספרים מומלצים למחנכים'
      // },
      // {
      //   id: 'books-list',
      //   type: 'list',
      //   items: [
      //     {
      //       title: 'PANDAS and PANS in School Settings',
      //       description: 'מדריך מקיף למחנכים על עבודה עם תלמידים עם פאנס/פאנדס'
      //     },
      //     {
      //       title: 'A Parents\' Guide to PANDAS, PANS, and Related Neuroimmune Disorders',
      //       description: 'מדריך להורים על הפרעות נוירואימוניות'
      //     },
      //     {
      //       title: 'PANS, CANS, and Automobiles',
      //       description: 'מדריך עזר מקיף לסיוע לתלמידים עם פאנדס ו-PANS'
      //     }
      //   ]
      // }
    ],
    relatedPages: [
      {
        id: 'parents',
        title: 'משאבים להורים',
        description: 'מדריכים וטיפים להתמודדות',
        imageUrl: relatedImage1,
        slug: 'parents'
      },
      {
        id: 'clinicians',
        title: 'משאבים לאנשי מקצוע',
        description: 'הנחיות אבחון ופרוטוקולי טיפול',
        imageUrl: relatedImage2,
        slug: 'clinicians'
      },
      {
        id: 'overview',
        title: 'משאבים - סקירה כללית',
        description: 'חזרה לעמוד המשאבים הראשי',
        imageUrl: relatedImage3,
        slug: 'overview'
      }
    ]
  },

  // videos: {
  //   id: 'videos',
  //   title: 'סרטונים ווובינרים',
  //   slug: 'videos',
  //   description: 'ספריית וידאו ממומחים רפואיים ומטפלים',
  //   content: [
  //     {
  //       id: 'intro-heading',
  //       type: 'heading',
  //       title: 'ספריית וידאו'
  //     },
  //     {
  //       id: 'intro-paragraph',
  //       type: 'paragraph',
  //       content: 'גלו שפע של משאבים מאנשי מקצוע רפואיים על פאנס/פאנדס. הסרטונים שלנו כוללים הרצאות, וובינרים וסיפורים אישיים.'
  //     },
  //     {
  //       id: 'featured-heading',
  //       type: 'heading',
  //       title: 'סרטונים מומלצים'
  //     },
  //     {
  //       id: 'featured-list',
  //       type: 'list',
  //       items: [
  //         {
  //           title: 'הבנת ספקטרום דלקת המוח בילדות כולל פאנדס ו-פאנס',
  //           description: 'כנס Northwell Health 2022 - הרצאות ממומחים מובילים'
  //         },
  //         {
  //           title: 'חוטים משותפים בין מחלות אוטואימוניות מופעלות זיהום של המוח',
  //           description: 'פאנל עגול מליאה עם מומחים בינלאומיים'
  //         },
  //         {
  //           title: 'מדע עצבים ונוירולוגיה: אנצפלופתיות אוטואימוניות',
  //           description: 'הרצאה על דלקות מוח אוטואימוניות'
  //         }
  //       ]
  //     },
  //     {
  //       id: 'youtube-callout',
  //       type: 'callout',
  //       variant: 'info',
  //       title: 'ערוץ YouTube',
  //       content: 'בקרו בערוץ YouTube של PANDAS Network לצפייה בספריית הסרטונים המלאה, כולל עדויות משפחות, הרצאות רפואיות ועדכונים מהתחום.'
  //     },
  //     {
  //       id: 'story-heading',
  //       type: 'heading',
  //       title: 'הסיפור של רבקה'
  //     },
  //     {
  //       id: 'story-paragraph',
  //       type: 'paragraph',
  //       content: 'רבקה הייתה ילדה מוחצנת שאישיותה השתנתה באופן דרמטי לאחר זיהום סטרפ. קבלת אבחנת פאנדס נתנה למשפחתה תקווה. שמעו את סיפורה על אבחון, טיפול והחלמה מ-PANDAS.'
  //     }
  //   ],
  //   relatedPages: [
  //     // {
  //     //   id: 'news',
  //     //   title: 'חדשות ומאמרים',
  //     //   description: 'עדכונים אחרונים מהתחום',
  //     //   imageUrl: relatedImage1,
  //     //   slug: 'news'
  //     // },
  //     {
  //       id: 'websites',
  //       title: 'אתרים מועילים',
  //       description: 'קישורים לארגונים ומשאבים נוספים',
  //       imageUrl: relatedImage2,
  //       slug: 'websites'
  //     },
  //     {
  //       id: 'clinicians',
  //       title: 'משאבים לאנשי מקצוע',
  //       description: 'הנחיות אבחון ופרוטוקולי טיפול',
  //       imageUrl: relatedImage3,
  //       slug: 'clinicians'
  //     }
  //   ]
  // },

  // news: {
  //   id: 'news',
  //   title: 'חדשות ומאמרים',
  //   slug: 'news',
  //   description: 'עדכונים אחרונים על טיפול, אבחון ומודעות ל-פאנס/פאנדס',
  //   content: [
  //     {
  //       id: 'intro-heading',
  //       type: 'heading',
  //       title: 'חדשות ומאמרים'
  //     },
  //     {
  //       id: 'intro-paragraph',
  //       type: 'paragraph',
  //       content: 'גלו את החדשות והמידע האחרונים הנוגעים לטיפול, אבחון ומודעות ל-פאנס/פאנדס.'
  //     },
  //     {
  //       id: 'articles-heading',
  //       type: 'heading',
  //       title: 'מאמרים אחרונים'
  //     },
  //     {
  //       id: 'articles-list',
  //       type: 'list',
  //       items: [
  //         {
  //           title: 'המוח שלו היה מודלק. פתאום הקו בין בריאות פיזית ונפשית התחיל להיטשטש',
  //           description: 'CBC News - פברואר 2023'
  //         },
  //         {
  //           title: 'בריטניה סובלת ממתקפה של קדחת שני. האם ארה"ב הבאה?',
  //           description: 'Wired Magazine - מרץ 2021'
  //         },
  //         {
  //           title: 'אשם חדש ומוזר מאחורי הפרעות אכילה',
  //           description: 'The Atlantic - אוקטובר 2019'
  //         },
  //         {
  //           title: 'הורות לילד נוירו-שונה היא קשה!',
  //           description: 'Psychology Today - אוגוסט 2021'
  //         },
  //         {
  //           title: '25 שנה ל-פאנס/פאנדס',
  //           description: 'ציון דרך היסטורי במחקר והכרה בתסמונות'
  //         }
  //       ]
  //     },
  //     {
  //       id: 'archive-callout',
  //       type: 'callout',
  //       variant: 'info',
  //       title: 'ארכיון מאמרים',
  //       content: 'גשו לארכיון המלא של מאמרי חדשות על פאנס/פאנדס מהשנים האחרונות.'
  //     }
  //   ],
  //   relatedPages: [
  //     {
  //       id: 'videos',
  //       title: 'סרטונים ווובינרים',
  //       description: 'ספריית וידאו ממומחים רפואיים',
  //       imageUrl: relatedImage1,
  //       slug: 'videos'
  //     },
  //     {
  //       id: 'websites',
  //       title: 'אתרים מועילים',
  //       description: 'קישורים לארגונים ומשאבים נוספים',
  //       imageUrl: relatedImage2,
  //       slug: 'websites'
  //     },
  //     {
  //       id: 'overview',
  //       title: 'משאבים - סקירה כללית',
  //       description: 'חזרה לעמוד המשאבים הראשי',
  //       imageUrl: relatedImage3,
  //       slug: 'overview'
  //     }
  //   ]
  // },

  websites: {
    id: 'websites',
    title: 'אתרים מועילים',
    slug: 'websites',
    description: 'קישורים לארגונים ומשאבים נוספים בעולם',
    content: [
      {
        id: 'intro-heading',
        type: 'heading',
        title: 'חקרו משאבים נוספים'
      },
      {
        id: 'intro-paragraph',
        type: 'paragraph',
        content: 'למדו עוד על פאנס/פאנדס והפרעות קשורות וארגונים מרשימת האתרים המועילים להלן.'
      },
      {
        id: 'us-heading',
        type: 'heading',
        title: 'ארגונים בארה"ב'
      },
      {
        id: 'us-list',
        type: 'list',
        items: [
          {
            title: 'PANDAS Physicians Network',
            description: 'PPN מוקדש לעזור לאנשי מקצוע רפואיים להבין טוב יותר את פאנס/פאנדס דרך מידע בזמן אמת ונטוורקינג.',
            url: 'https://www.pandasppn.org/'
          },
          {
            title: 'International OCD Foundation',
            description: 'המשימה של International OCD Foundation היא לעזור לכל מי שמושפע מהפרעה טורדנית-כפייתית והפרעות קשורות.',
            url: 'https://iocdf.org/'
          },
          {
            title: 'המכון הלאומי לבריאות הנפש (NIMH)',
            description: 'סוכנות המחקר הפדרלית המובילה להפרעות נפשיות.',
            url: 'https://www.nimh.nih.gov/'
          },
          {
            title: 'The Balanced Mind Foundation',
            description: 'רשת ההורים Balanced Mind מנחה משפחות המגדלות ילדים עם הפרעות מצב רוח לתשובות, תמיכה ויציבות.',
            url: 'https://www.dbsalliance.org/support/for-friends-family/for-parents/balanced-mind-parent-network/'
          },
          {
            title: 'On Our Sleeves',
            description: 'On Our Sleeves מציעה משאבים מבוססי ראיות מהמומחים בבית החולים לילדים Nationwide Children\'s.',
            url: 'https://www.onoursleeves.org/'
          },
          {
            title: 'Immune Deficiency Foundation',
            description: 'קרן חסר החיסון משפרת את האבחון, הטיפול ואיכות החיים של אנשים עם חסר חיסוני ראשוני.',
            url: 'https://primaryimmune.org/'
          },
          {
            title: 'New England PANS/PANDAS Association',
            description: 'קבוצת הורים ומתנדבים רפואיים ממדינות שונות ברחבי ניו אינגלנד המתמקדת בהעלאת מודעות.',
            url: 'https://nepans.org/'
          },
          {
            title: 'Northwest PANS/PANDAS Network',
            description: 'עמותה המשרתת את אלה במערב צפון אמריקה עם פאנס/פאנדס/AE ומשפחותיהם.',
            url: 'https://www.nwppn.org/'
          },
          {
            title: 'Aspire',
            description: 'המשימה של Aspire היא לשפר את חייהם של ילדים ומבוגרים המושפעים מ-פאנס/פאנדס.',
            url: 'https://aspire.care/'
          }
        ]
      },
      {
        id: 'international-heading',
        type: 'heading',
        title: 'ארגונים בינלאומיים'
      },
      {
        id: 'international-list',
        type: 'list',
        items: [
          {
            title: 'PANS PANDAS UK (בריטניה)',
            description: 'עמותה בריטית שהוקמה על ידי קבוצת הורים מסורה עם ילדים המושפעים ממצבים אלה.',
            url: 'https://www.panspandasuk.org/'
          },
          {
            title: 'SANE - PANDAS Sweden (שבדיה)',
            description: 'ארגון זה מציע רשת תמיכה בחברות למטופלים ומשפחותיהם.',
            url: 'https://sane.nu/'
          },
          {
            title: 'Inflamed Brain Alliance (קנדה)',
            description: 'ברית המוח הדלוק שואפת להקל על הנטל על ידי עזרה בניווט מסלולים לטיפול קליני.',
            url: 'https://inflamedbrain.org/'
          },
          {
            title: 'PANDAS Poland (פולין)',
            description: 'אתר ובלוג המנוהלים על ידי אם מסורה לשיתוף מידע על פאנדס, פאנס ותסמיני ASD.',
            url: 'https://www.facebook.com/pandaspansPL/'
          },
          {
            title: 'PANDAS Italia (איטליה)',
            description: 'PANDAS Italia ODV היא ארגון התנדבותי שנולד באמפולי באוגוסט 2010.',
            url: 'https://pandasitalia.it/'
          }
        ]
      }
    ],
    relatedPages: [
      {
        id: 'news',
        title: 'חדשות ומאמרים',
        description: 'עדכונים אחרונים מהתחום',
        imageUrl: relatedImage1,
        slug: 'news'
      },
      {
        id: 'videos',
        title: 'סרטונים ווובינרים',
        description: 'ספריית וידאו ממומחים רפואיים',
        imageUrl: relatedImage2,
        slug: 'videos'
      },
      {
        id: 'overview',
        title: 'משאבים - סקירה כללית',
        description: 'חזרה לעמוד המשאבים הראשי',
        imageUrl: relatedImage3,
        slug: 'overview'
      }
    ]
  },
};

// Navigation items for the resources section
export const resourceNavItems = [
  {
    id: 'overview',
    title: 'סקירה כללית',
    slug: 'overview'
  },
  {
    id: 'parents',
    title: 'משאבים להורים',
    slug: 'parents'
  },
  {
    id: 'clinicians',
    title: 'משאבים לאנשי מקצוע',
    slug: 'clinicians'
  },
  {
    id: 'educators',
    title: 'משאבים למחנכים',
    slug: 'educators'
  },
  // {
  //   id: 'videos',
  //   title: 'סרטונים ווובינרים',
  //   slug: 'videos'
  // },
  // {
  //   id: 'news',
  //   title: 'חדשות ומאמרים',
  //   slug: 'news'
  // },
  {
    id: 'websites',
    title: 'אתרים מועילים',
    slug: 'websites'
  }
];

// Downloadable resources with links
export const downloadableResources: ResourceLink[] = [
  {
    id: 'quick-facts',
    title: 'עובדות מהירות על פאנס/פאנדס',
    titleEn: 'PANDAS, PANS Quick Facts',
    description: 'מדריך תמציתי להבנת התסמונות',
    url: '/pdfs/quickFactsHe.pdf',
    type: 'pdf'
  },
  {
    id: 'education-toolkit',
    title: 'ערכת כלים חינוכית',
    titleEn: 'PANDAS Education Toolkit',
    description: 'ערכה מקיפה לצוות בית הספר',
    url: 'https://pandasnetwork.org/wp-content/uploads/2022/03/PANDAS-NETWORK_EDUCATIONTOOLKIT.pdf',
    type: 'pdf'
  },
  {
    id: 'brochure',
    title: 'חוברת פאנדס',
    titleEn: 'PANDAS Brochure',
    description: 'חוברת מידע להפצה',
    url: 'https://pandasnetwork.org/wp-content/uploads/2023/04/Brochure.pdf',
    type: 'pdf'
  },
  {
    id: 'school-nurse',
    title: 'עובדות מהירות לאחיות בית ספר',
    titleEn: 'Quick Facts for School Nurses',
    description: 'מדריך ספציפי לאחיות בית ספר',
    url: 'https://pandasnetwork.org/wp-content/uploads/2019/04/PANDAS-NETWORK_SCHOOLNURSE.pdf',
    type: 'pdf'
  },
  {
    id: 'letter-exacerbation',
    title: 'מכתב לבית הספר בזמן התלקחות',
    titleEn: 'Letter to School while in Exacerbation',
    description: 'לשימוש כשהילד נמצא באפיזודה פעילה',
    url: 'https://pandasnetwork.org/wp-content/uploads/2021/08/Letter-while-in-exacerbation.pdf',
    type: 'pdf'
  },
  {
    id: 'letter-remission',
    title: 'מכתב לבית הספר בזמן הפוגה',
    titleEn: 'Letter to School while in Remission',
    description: 'לשימוש כשהילד במצב יציב',
    url: 'https://pandasnetwork.org/wp-content/uploads/2021/08/Letter-while-in-remission.pdf',
    type: 'pdf'
  },
  {
    id: 'strep-notification',
    title: 'מכתב בקשה להתראה על חשיפה לסטרפ',
    titleEn: 'Letter Requesting Notification of Strep Exposure',
    description: 'בקשה מבית הספר להודיע על מקרי סטרפ בכיתה',
    url: 'https://pandasnetwork.org/wp-content/uploads/2021/08/Notification-Letter.pdf',
    type: 'pdf'
  },
  {
    id: 'handout-teachers',
    title: 'דף מידע למורים',
    titleEn: 'Handout for Teachers',
    description: 'מידע תמציתי למורים על פאנס/פאנדס',
    url: 'https://pandasnetwork.org/wp-content/uploads/2021/08/Handout-for-Teachers1.pdf',
    type: 'pdf'
  },
  {
    id: 'friend-wants-to-know',
    title: 'מה החבר שלך עם פאנס/פאנדס רוצה שתדע',
    titleEn: 'What Your Friend with PANS/PANDAS Wants You To Know',
    description: 'מדריך לחברים ובני משפחה',
    url: 'https://pandasnetwork.org/wp-content/uploads/2021/08/What-your-friend-with-PANDAS-or-PANS-wants-you-to-know.pdf',
    type: 'pdf'
  }
];

// Helpful websites organized by category
export const helpfulWebsites = {
  us: [
    {
      id: 'ppn',
      name: 'PANDAS Physicians Network',
      nameHe: 'רשת רופאי פאנדס',
      description: 'רשת רופאים בינלאומית מקצועית עם הנחיות אבחון וטיפול',
      url: 'https://www.pandasppn.org/'
    },
    {
      id: 'iocdf',
      name: 'International OCD Foundation',
      nameHe: 'הקרן הבינלאומית ל-OCD',
      description: 'עוזרת לכל מי שמושפע מ-OCD והפרעות קשורות',
      url: 'https://iocdf.org/'
    },
    {
      id: 'nimh',
      name: 'National Institute of Mental Health',
      nameHe: 'המכון הלאומי לבריאות הנפש',
      description: 'סוכנות המחקר הפדרלית המובילה להפרעות נפשיות',
      url: 'https://www.nimh.nih.gov/'
    },
    {
      id: 'balanced-mind',
      name: 'The Balanced Mind Foundation',
      nameHe: 'קרן Balanced Mind',
      description: 'מנחה משפחות המגדלות ילדים עם הפרעות מצב רוח',
      url: 'https://www.dbsalliance.org/support/for-friends-family/for-parents/balanced-mind-parent-network/'
    },
    {
      id: 'on-our-sleeves',
      name: 'On Our Sleeves',
      nameHe: 'On Our Sleeves',
      description: 'משאבים מבוססי ראיות לבריאות הנפש של ילדים',
      url: 'https://www.onoursleeves.org/'
    },
    {
      id: 'idf',
      name: 'Immune Deficiency Foundation',
      nameHe: 'קרן חסר החיסון',
      description: 'משפרת אבחון וטיפול לאנשים עם חסר חיסוני ראשוני',
      url: 'https://primaryimmune.org/'
    },
    {
      id: 'nepans',
      name: 'New England PANS/PANDAS Association',
      nameHe: 'עמותת ניו אינגלנד פאנס/פאנדס',
      description: 'קבוצת הורים ומתנדבים להעלאת מודעות',
      url: 'https://nepans.org/'
    },
    {
      id: 'nwppn',
      name: 'Northwest פאנס/פאנדס Network',
      nameHe: 'רשת Northwest פאנס/פאנדס',
      description: 'עמותה המשרתת משפחות במערב צפון אמריקה',
      url: 'https://www.nwppn.org/'
    },
    {
      id: 'aspire',
      name: 'Aspire',
      nameHe: 'Aspire',
      description: 'משפרת חיי ילדים ומבוגרים עם פאנס/פאנדס',
      url: 'https://aspire.care/'
    }
  ],
  international: [
    {
      id: 'pans-pandas-uk',
      name: 'PANS PANDAS UK',
      nameHe: 'פאנס פאנדס (בריטניה)',
      description: 'עמותה בריטית שהוקמה על ידי הורים מסורים',
      url: 'https://www.panspandasuk.org/'
    },
    {
      id: 'sane-sweden',
      name: 'SANE (PANDAS Sweden)',
      nameHe: 'SANE (שבדיה)',
      description: 'רשת תמיכה למטופלים ומשפחותיהם בשבדיה',
      url: 'https://sane.nu/'
    },
    {
      id: 'inflamed-brain-canada',
      name: 'Inflamed Brain Alliance',
      nameHe: 'Inflamed Brain Alliance (קנדה)',
      description: 'עוזרת בניווט מסלולים לטיפול קליני בקנדה',
      url: 'https://inflamedbrain.org/'
    },
    {
      id: 'pandas-poland',
      name: 'PANDAS Poland',
      nameHe: 'PANDAS Poland (פולין)',
      description: 'אתר ובלוג בפולנית על פאנס/פאנדס',
      url: 'https://www.facebook.com/pandaspansPL/'
    },
    {
      id: 'pandas-italia',
      name: 'PANDAS Italia',
      nameHe: 'פאנדס איטליה',
      description: 'ארגון התנדבותי איטלקי',
      url: 'https://pandasitalia.it/'
    }
  ]
};
